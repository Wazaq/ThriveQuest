import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { hashPassword } from '$lib/crypto';
import { signJWT } from '$lib/jwt';
import { getDB, schema } from '$lib/db';
import { eq } from 'drizzle-orm';

export async function POST({ request, platform, cookies }: RequestEvent) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return json({ error: 'Email and password are required' }, { status: 400 });
	}

	const db = getDB(platform!.env.DB);

	// Check if user exists
	const existingUser = await db
		.select()
		.from(schema.users)
		.where(eq(schema.users.email, email))
		.get();

	if (existingUser) {
		return json({ error: 'User with that email already exists' }, { status: 409 });
	}

	const hashedPassword = await hashPassword(password);

	// Create user
	const result = await db
		.insert(schema.users)
		.values({
			email,
			password: hashedPassword
		})
		.returning();

	const user = result[0];

	// Auto-login: Generate JWT token and set cookie
	const token = signJWT({ userId: user.id, email: user.email });
	cookies.set('token', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});

	return json({ message: 'User created successfully', userId: user.id }, { status: 201 });
}
