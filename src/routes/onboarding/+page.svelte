<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { form }: { form: ActionData } = $props();

	let currentStep = $state(1);
	let selectedDomain = $state('');

	// Handle domain selection form submission
	function handleDomainSelect() {
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			if (form?.success) {
				currentStep = 3;
			}
		};
	}

	const domains = [
		{
			name: 'Positive Emotions',
			color: 'bg-yellow-500',
			icon: '😊',
			description: 'Cultivate joy, gratitude, and mindfulness'
		},
		{
			name: 'Engagement',
			color: 'bg-blue-500',
			icon: '🎯',
			description: 'Enter flow states and build meaningful skills'
		},
		{
			name: 'Relationships',
			color: 'bg-green-500',
			icon: '🤝',
			description: 'Strengthen connections and build community'
		},
		{
			name: 'Meaning',
			color: 'bg-purple-500',
			icon: '🌟',
			description: 'Discover purpose and align with your values'
		},
		{
			name: 'Accomplishment',
			color: 'bg-amber-500',
			icon: '🏆',
			description: 'Achieve goals and master new abilities'
		}
	];
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-4 dark:from-gray-900 dark:to-gray-800"
>
	<div class="w-full max-w-2xl">
		<!-- Step 1: Welcome -->
		{#if currentStep === 1}
			<Card class="text-center">
				<div class="space-y-6">
					<div class="text-6xl">🌱</div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome to ThriveQuest!</h1>
					<p class="text-lg text-gray-600 dark:text-gray-300">
						Your journey to holistic wellness starts here. ThriveQuest uses the evidence-based PERMA
						framework to help you grow across five key areas of well-being.
					</p>

					<div class="mx-auto max-w-md space-y-4 text-left">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							The PERMA Framework:
						</h2>
						{#each domains as domain (domain.name)}
							<div class="flex items-start gap-3">
								<span class="text-2xl">{domain.icon}</span>
								<div>
									<div class="font-medium text-gray-900 dark:text-white">{domain.name}</div>
									<div class="text-sm text-gray-600 dark:text-gray-400">{domain.description}</div>
								</div>
							</div>
						{/each}
					</div>

					<Button onclick={() => (currentStep = 2)} class="mt-6">Get Started</Button>
				</div>
			</Card>
		{/if}

		<!-- Step 2: Choose Focus Domain -->
		{#if currentStep === 2}
			<Card>
				<div class="space-y-6">
					<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Choose Your Focus Domain</h2>
					<p class="text-gray-600 dark:text-gray-300">
						While you can explore all five domains, choosing a primary focus helps us personalize
						your experience. You can always change this later in settings.
					</p>

					<form method="POST" action="?/selectDomain" use:enhance={handleDomainSelect}>
						<div class="space-y-3">
							{#each domains as domain (domain.name)}
								<label
									class="flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all hover:border-emerald-500 {selectedDomain ===
									domain.name
										? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
										: 'border-gray-200 dark:border-gray-700'}"
								>
									<input
										type="radio"
										name="focusDomain"
										value={domain.name}
										bind:group={selectedDomain}
										class="h-5 w-5 text-emerald-600"
									/>
									<span class="text-2xl">{domain.icon}</span>
									<div class="flex-1">
										<div class="font-medium text-gray-900 dark:text-white">{domain.name}</div>
										<div class="text-sm text-gray-600 dark:text-gray-400">
											{domain.description}
										</div>
									</div>
								</label>
							{/each}
						</div>

						<div class="mt-6 flex gap-3">
							<Button type="button" variant="secondary" onclick={() => (currentStep = 1)}>
								Back
							</Button>
							<Button type="submit" disabled={!selectedDomain}>Continue</Button>
						</div>
					</form>
				</div>
			</Card>
		{/if}

		<!-- Step 3: Dashboard Tour -->
		{#if currentStep === 3}
			<Card>
				<div class="space-y-6">
					<div class="text-center">
						<div class="text-5xl">✨</div>
						<h2 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">You're All Set!</h2>
					</div>

					<div class="space-y-4 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
						<h3 class="font-semibold text-gray-900 dark:text-white">Here's what you can do:</h3>
						<ul class="space-y-3 text-gray-700 dark:text-gray-300">
							<li class="flex gap-3">
								<span>📋</span>
								<span
									><strong>Complete Quests:</strong> Choose from curated daily activities across all five
									PERMA domains</span
								>
							</li>
							<li class="flex gap-3">
								<span>📅</span>
								<span
									><strong>Track Progress:</strong> View your completion calendar and build healthy streaks</span
								>
							</li>
							<li class="flex gap-3">
								<span>📝</span>
								<span
									><strong>Reflect Daily:</strong> Use the journal feature to capture thoughts and insights</span
								>
							</li>
							<li class="flex gap-3">
								<span>🔔</span>
								<span
									><strong>Stay Motivated:</strong> Enable push notifications for daily reminders</span
								>
							</li>
						</ul>
					</div>

					<form method="POST" action="?/completeOnboarding" use:enhance>
						<div class="flex gap-3">
							<Button type="button" variant="secondary" onclick={() => (currentStep = 2)}>
								Back
							</Button>
							<Button type="submit">Start Your Journey</Button>
						</div>
					</form>
				</div>
			</Card>
		{/if}

		<!-- Progress indicator -->
		<div class="mt-6 flex justify-center gap-2">
			<div
				class="h-2 w-2 rounded-full {currentStep >= 1
					? 'bg-emerald-500'
					: 'bg-gray-300 dark:bg-gray-700'}"
			></div>
			<div
				class="h-2 w-2 rounded-full {currentStep >= 2
					? 'bg-emerald-500'
					: 'bg-gray-300 dark:bg-gray-700'}"
			></div>
			<div
				class="h-2 w-2 rounded-full {currentStep >= 3
					? 'bg-emerald-500'
					: 'bg-gray-300 dark:bg-gray-700'}"
			></div>
		</div>
	</div>
</div>
