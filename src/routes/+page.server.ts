// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import { getDB, schema } from '$lib/db';
import { eq, and, gte, lt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform, url }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const db = getDB(platform!.env.DB);

    // Get selected domain from query param or default to Accomplishment
    const selectedDomain = url.searchParams.get('domain') || 'Accomplishment';

    // Fetch quests for selected domain
    const quests = await db
        .select()
        .from(schema.quests)
        .where(eq(schema.quests.domain, selectedDomain))
        .all();

    // Fetch ALL completions for calendar
    const allCompletions = await db
        .select({ date: schema.questCompletions.date })
        .from(schema.questCompletions)
        .where(eq(schema.questCompletions.userId, locals.user.id))
        .all();

    // Pass dates as strings to avoid serialization issues
    const completionDates = allCompletions.map(c => {
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

    // Get incomplete quest counts per domain for badges
    const allQuests = await db
        .select()
        .from(schema.quests)
        .all();

    // Get completed quest IDs for today
    const completedQuestIds = new Set(completions.map(c => c.questId));

    // Count only incomplete quests per domain
    const questCounts = allQuests.reduce((acc, quest) => {
        if (!completedQuestIds.has(quest.id)) {
            acc[quest.domain] = (acc[quest.domain] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return {
        quests,
        completions,
        completionDates: [...new Set(completionDates)],
        selectedDomain,
        questCounts
    };
};