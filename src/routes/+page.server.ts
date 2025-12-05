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

    // You will fetch completions here later
    return { quests };
};