import { json } from '@sveltejs/kit';
import { getDB, schema } from '$lib/db';
import type { RequestHandler } from './$types';

// POST /api/notifications/subscribe - Save push subscription
export const POST: RequestHandler = async ({ request, platform, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const subscription = await request.json();
	const db = getDB(platform!.env.DB);

	try {
		// Store the subscription as JSON string
		await db
			.insert(schema.pushSubscriptions)
			.values({
				userId: locals.user.id,
				subscriptionJson: JSON.stringify(subscription)
			})
			.onConflictDoNothing()
			.run();

		return json({ success: true }, { status: 201 });
	} catch (error) {
		console.error('Failed to save push subscription:', error);
		return json({ error: 'Failed to save subscription' }, { status: 500 });
	}
};
