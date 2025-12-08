// src/routes/api/auth/logout/+server.ts
import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function POST({ cookies }: RequestEvent) {
	cookies.delete('auth_token', { path: '/' });
	return json({ message: 'Logged out' });
}
