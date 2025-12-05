// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import { getDB, schema } from '$lib/db';
import { eq, and, gte } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const db = getDB(platform!.env.DB);

    // Fetch quests
    const quests = await db
        .select()
        .from(schema.quests)
        .where(eq(schema.quests.domain, 'Accomplishment'))
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

    const completions = await db
        .select()
        .from(schema.questCompletions)
        .where(
            and(
                eq(schema.questCompletions.userId, locals.user.id),
                gte(schema.questCompletions.date, today)
            )
        )
        .all();

    return { quests, completions, completionDates: [...new Set(completionDates)] };
};