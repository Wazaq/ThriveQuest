<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let journalEntry = '';
	let lastSaved = '';

	onMount(() => {
		journalEntry = localStorage.getItem('journalEntry') || '';
		const saved = localStorage.getItem('journalLastSaved');
		if (saved) {
			lastSaved = new Date(saved).toLocaleString();
		}
	});

	function saveEntry() {
		localStorage.setItem('journalEntry', journalEntry);
		localStorage.setItem('journalLastSaved', new Date().toISOString());
		lastSaved = new Date().toLocaleString();
	}

	// Get today's date formatted nicely
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<div class="space-y-6 max-w-4xl">
	<div>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
			My Journal
		</h1>
		<p class="text-gray-600 dark:text-gray-400">
			{today}
		</p>
	</div>

	<Card>
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					Today's Reflections
				</h2>
				{#if lastSaved}
					<span class="text-xs text-gray-500 dark:text-gray-400">
						Saved {lastSaved}
					</span>
				{/if}
			</div>

			<textarea
				bind:value={journalEntry}
				on:input={saveEntry}
				placeholder="What's on your mind today? Reflect on your progress, thoughts, feelings, or anything else you'd like to remember..."
				rows="15"
				class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-y"
			></textarea>

			<div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>Your entries are currently saved locally in your browser</span>
			</div>
		</div>
	</Card>

	<Card padding="sm">
		<details class="group">
			<summary class="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 list-none flex items-center justify-between">
				<span>Journaling Prompts</span>
				<svg class="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</summary>
			<div class="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
				<p>• What am I grateful for today?</p>
				<p>• What progress did I make toward my goals?</p>
				<p>• What challenged me today, and what did I learn?</p>
				<p>• How did I show up for myself or others?</p>
				<p>• What do I want to focus on tomorrow?</p>
			</div>
		</details>
	</Card>
</div>