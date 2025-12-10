// API endpoint to ensure daily quests exist for a specific local date
import { json } from '@sveltejs/kit';
import { getDB, schema } from '$lib/db';
import { eq, and, inArray } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { date } = await request.json();

	// Validate date format (YYYY-MM-DD)
	if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return json({ error: 'Invalid date format' }, { status: 400 });
	}

	const db = getDB(platform!.env.DB);
	const userId = locals.user.id;

	// Get user's focus domain
	const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).get();

	if (!user) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	// Use the existing getDailyQuests function which handles get-or-create logic
	// Pass the client's local date so quests are generated for their timezone
	const { getDailyQuests } = await import('$lib/dailyQuests');
	const dailyQuestIds = await getDailyQuests(db, userId, user.focusDomain, date);

	// Fetch the actual quest details
	const quests = await db
		.select()
		.from(schema.quests)
		.where(inArray(schema.quests.id, dailyQuestIds))
		.all();

	// Sort quests to match the order from dailyQuestIds (focus domain first)
	const questsMap = new Map(quests.map((q) => [q.id, q]));
	const sortedQuests = dailyQuestIds.map((id) => questsMap.get(id)!).filter(Boolean);

	return json(sortedQuests);
};
