import { json } from '@sveltejs/kit';
import { getDB, schema } from '$lib/db';
import { eq, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

// GET /api/journal?date=YYYY-MM-DD - Fetch entry for specific date
export const GET: RequestHandler = async ({ locals, platform, url }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const date = url.searchParams.get('date');
	if (!date) {
		return json({ error: 'Date parameter required' }, { status: 400 });
	}

	const db = getDB(platform!.env.DB);

	const entry = await db
		.select()
		.from(schema.journalEntries)
		.where(
			and(eq(schema.journalEntries.userId, locals.user.id), eq(schema.journalEntries.date, date))
		)
		.get();

	if (!entry) {
		return json({ content: '' });
	}

	return json({ content: entry.content, updatedAt: entry.updatedAt });
};

// POST /api/journal - Save/update entry for specific date
export const POST: RequestHandler = async ({ locals, platform, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { date, content } = await request.json();

	if (!date || content === undefined) {
		return json({ error: 'Date and content required' }, { status: 400 });
	}

	const db = getDB(platform!.env.DB);

	// Try to update existing entry first
	const existing = await db
		.select()
		.from(schema.journalEntries)
		.where(
			and(eq(schema.journalEntries.userId, locals.user.id), eq(schema.journalEntries.date, date))
		)
		.get();

	if (existing) {
		// Update existing entry
		await db
			.update(schema.journalEntries)
			.set({
				content,
				updatedAt: new Date()
			})
			.where(eq(schema.journalEntries.id, existing.id))
			.run();
	} else {
		// Create new entry
		await db
			.insert(schema.journalEntries)
			.values({
				userId: locals.user.id,
				date,
				content,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.run();
	}

	return json({ success: true });
};
