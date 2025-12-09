// src/routes/api/completions/+server.ts
import { json } from '@sveltejs/kit';
import { getDB, schema } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, locals, platform }: RequestEvent) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { questId, date } = await request.json();

	// Date should be sent from client in YYYY-MM-DD format (user's local timezone)
	const dateStr = date;

	const db = getDB(platform!.env.DB);

	const result = await db
		.insert(schema.questCompletions)
		.values({
			userId: locals.user.id,
			questId: questId,
			date: dateStr
		})
		.returning();

	return json(result[0], { status: 201 });
}
