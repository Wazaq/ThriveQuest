// src/routes/api/completions/+server.ts
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function POST({ request, locals }) {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questId } = await request.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const completion = await prisma.questCompletion.create({
        data: {
            userId: locals.user.id,
            questId: questId,
            date: today,
        }
    });

    return json(completion, { status: 201 });
}
