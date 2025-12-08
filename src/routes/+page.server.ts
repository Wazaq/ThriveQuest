// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import { getDB, schema } from '$lib/db';
import { eq, and, gte, lt, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const db = getDB(platform!.env.DB);

	// Check if user has completed onboarding
	const user = await db
		.select()
		.from(schema.users)
		.where(eq(schema.users.id, locals.user.id))
		.get();

	if (!user?.onboardingComplete) {
		throw redirect(303, '/onboarding');
	}

	// Get today's 5 daily quests
	const { getDailyQuests } = await import('$lib/dailyQuests');
	const dailyQuestIds = await getDailyQuests(db, locals.user.id, user.focusDomain);

	// Fetch the actual quest details
	const quests = await db
		.select()
		.from(schema.quests)
		.where(inArray(schema.quests.id, dailyQuestIds))
		.all();

	// Sort quests to match the order from dailyQuestIds (focus domain first)
	const questsMap = new Map(quests.map((q) => [q.id, q]));
	const sortedQuests = dailyQuestIds.map((id) => questsMap.get(id)!).filter(Boolean);

	// Fetch ALL completions for calendar
	const allCompletions = await db
		.select({ date: schema.questCompletions.date })
		.from(schema.questCompletions)
		.where(eq(schema.questCompletions.userId, locals.user.id))
		.all();

	// Pass dates as strings to avoid serialization issues
	const completionDates = allCompletions.map((c) => {
		const date = c.date instanceof Date ? c.date : new Date(c.date);
		return date.toISOString().split('T')[0];
	});

	// Fetch today's completions for quest buttons
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const completions = await db
		.select()
		.from(schema.questCompletions)
		.where(
			and(
				eq(schema.questCompletions.userId, locals.user.id),
				gte(schema.questCompletions.date, today),
				lt(schema.questCompletions.date, tomorrow)
			)
		)
		.all();

	return {
		quests: sortedQuests,
		completions,
		completionDates: [...new Set(completionDates)]
	};
};
