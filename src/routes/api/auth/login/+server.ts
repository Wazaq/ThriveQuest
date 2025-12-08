// src/routes/api/auth/login/+server.ts
import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { verifyPassword } from '$lib/crypto';
import { signJWT } from '$lib/jwt';
import { getDB, schema } from '$lib/db';
import { eq } from 'drizzle-orm';

export async function POST({ request, cookies, platform }: RequestEvent) {
	const { email, password } = await request.json();

	const db = getDB(platform!.env.DB);
	const jwtSecret = platform!.env.JWT_SECRET || 'DEFAULT_SECRET_CHANGE_IN_PROD';

	const user = await db.select().from(schema.users).where(eq(schema.users.email, email)).get();

	if (!user) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const passwordMatch = await verifyPassword(password, user.password);
	if (!passwordMatch) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const token = await signJWT({ userId: user.id, email: user.email }, jwtSecret, '7d');

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
