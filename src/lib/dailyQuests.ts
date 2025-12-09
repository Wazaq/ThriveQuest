// Daily quest selection and management
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { eq, and, sql } from 'drizzle-orm';
import * as schema from './db/schema';

const PERMA_DOMAINS = [
	'Positive Emotion',
	'Engagement',
	'Relationships',
	'Meaning',
	'Accomplishment'
];;

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
	const now = new Date();
	return now.toISOString().split('T')[0];
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

/**
 * Select 5 daily quests for a user:
 * - 1 from their focus domain
 * - 1 from each of the other 4 domains
 */
async function selectDailyQuests(
	db: DrizzleD1Database,
	userId: number,
	focusDomain: string | null
): Promise<number[]> {
	const selectedQuestIds: number[] = [];

	// Determine actual focus domain (default to random if not set)
	const actualFocusDomain =
		focusDomain || PERMA_DOMAINS[Math.floor(Math.random() * PERMA_DOMAINS.length)];

	// Get 1 quest from focus domain
	const focusQuests = await db
		.select()
		.from(schema.quests)
		.where(eq(schema.quests.domain, actualFocusDomain))
		.all();

	if (focusQuests.length > 0) {
		const randomFocusQuest = shuffleArray(focusQuests)[0];
		selectedQuestIds.push(randomFocusQuest.id);
	}

	// Get 1 quest from each other domain
	const otherDomains = PERMA_DOMAINS.filter((d) => d !== actualFocusDomain);

	for (const domain of otherDomains) {
		const domainQuests = await db
			.select()
			.from(schema.quests)
			.where(eq(schema.quests.domain, domain))
			.all();

		if (domainQuests.length > 0) {
			const randomDomainQuest = shuffleArray(domainQuests)[0];
			selectedQuestIds.push(randomDomainQuest.id);
		}
	}

	return selectedQuestIds;
}

/**
 * Get or generate daily quests for a user
 * Returns the 5 quest IDs for today
 */
export async function getDailyQuests(
	db: DrizzleD1Database,
	userId: number,
	focusDomain: string | null
): Promise<number[]> {
	const today = getTodayDate();

	// Check if we already have daily quests for today
	const existingDailyQuests = await db
		.select()
		.from(schema.dailyQuests)
		.where(and(eq(schema.dailyQuests.userId, userId), eq(schema.dailyQuests.date, today)))
		.all();

	// If we have 5 quests for today, return them
	if (existingDailyQuests.length === 5) {
		return existingDailyQuests.map((dq) => dq.questId);
	}

	// Otherwise, generate new daily quests
	const selectedQuestIds = await selectDailyQuests(db, userId, focusDomain);

	// Save to database
	for (const questId of selectedQuestIds) {
		await db
			.insert(schema.dailyQuests)
			.values({
				userId,
				questId,
				date: today
			})
			.onConflictDoNothing() // In case of race condition
			.run();
	}

	return selectedQuestIds;
}

/**
 * Clean up old daily quests (older than 7 days)
 * This prevents the table from growing indefinitely
 */
export async function cleanupOldDailyQuests(db: DrizzleD1Database): Promise<void> {
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
	const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];

	// Note: Drizzle doesn't have a direct "less than" for text comparison
	// We'll need to use raw SQL for this
	await db.run(sql`DELETE FROM daily_quests WHERE date < ${cutoffDate}`);
}
