// src/routes/api/auth/login/+server.ts
// src/routes/api/auth/login/+server.ts
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const prisma = new PrismaClient();
// IMPORTANT: Add JWT_SECRET to your .env file!
const jwtSecret = env.JWT_SECRET || 'DEFAULT_SECRET_CHANGE_IN_PROD';

export async function POST({ request, cookies }: RequestEvent) {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });

    // Set token in an HttpOnly cookie
    cookies.set('auth_token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return json({ message: 'Logged in successfully' });
}