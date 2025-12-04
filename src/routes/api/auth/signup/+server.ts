import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST({ request }: RequestEvent) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return json({ error: 'User with that email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    return json({ message: 'User created successfully', userId: user.id }, { status: 201 });
}