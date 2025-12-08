import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/db';
import * as schema from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const db = getDB(platform!.env.DB);

	// If already onboarded, redirect to dashboard
	const user = await db
		.select()
		.from(schema.users)
		.where(eq(schema.users.id, locals.user.id))
		.get();

	if (user?.onboardingComplete) {
		throw redirect(303, '/');
	}

	// Fetch a sample quest from each domain for the tour
	const sampleQuests = await db
		.select()
		.from(schema.quests)
		.limit(5) // One from each domain ideally
		.all();

	return {
		user,
		sampleQuests
	};
};

export const actions: Actions = {
	selectDomain: async ({ request, locals, platform }) => {
		if (!locals.user) {
			return { success: false, error: 'Not authenticated' };
		}

		const formData = await request.formData();
		const focusDomain = formData.get('focusDomain') as string;

		if (!focusDomain) {
			return { success: false, error: 'Please select a domain' };
		}

		const db = getDB(platform!.env.DB);

		// Update user with focus domain
		await db
			.update(schema.users)
			.set({ focusDomain })
			.where(eq(schema.users.id, locals.user.id))
			.run();

		return { success: true, step: 'domain-selected' };
	},

	completeOnboarding: async ({ locals, platform }) => {
		if (!locals.user) {
			return { success: false, error: 'Not authenticated' };
		}

		const db = getDB(platform!.env.DB);

		// Mark onboarding as complete
		await db
			.update(schema.users)
			.set({ onboardingComplete: true })
			.where(eq(schema.users.id, locals.user.id))
			.run();

		throw redirect(303, '/');
	}
};
