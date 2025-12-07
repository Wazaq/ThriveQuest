import { json } from '@sveltejs/kit';
import { getDB, schema } from '$lib/db';
import { eq, desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

// GET /api/journal/history - Fetch all journal entries for the user
export const GET: RequestHandler = async ({ locals, platform }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const db = getDB(platform!.env.DB);

	const entries = await db
		.select()
		.from(schema.journalEntries)
		.where(eq(schema.journalEntries.userId, locals.user.id))
		.orderBy(desc(schema.journalEntries.date))
		.all();

	return json({ entries });
};
