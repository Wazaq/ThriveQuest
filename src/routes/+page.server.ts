// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const load = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const quests = await prisma.quest.findMany({
        where: { domain: 'Accomplishment' }
    });

    // Fetch today's completions
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completions = await prisma.questCompletion.findMany({
        where: {
            userId: locals.user.id,
            date: today
        }
    });

    return { quests, completions };
};