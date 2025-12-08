<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/Card.svelte';

	interface JournalEntry {
		id: number;
		date: string;
		content: string;
		createdAt: number;
		updatedAt: number;
	}

	let entries = $state<JournalEntry[]>([]);
	let loading = $state(true);
	let selectedEntry = $state<JournalEntry | null>(null);

	onMount(async () => {
		try {
			const response = await fetch('/api/journal/history');
			if (response.ok) {
				const data = await response.json();
				entries = data.entries;
			}
		} catch (err) {
			console.error('Failed to load journal history:', err);
		} finally {
			loading = false;
		}
	});

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatShortDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="max-w-4xl space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">Journal History</h1>
			<p class="text-gray-600 dark:text-gray-400">Browse your past reflections</p>
		</div>
		<a
			href="/journal"
			class="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 font-medium text-white transition-colors"
		>
			Today's Entry
		</a>
	</div>

	{#if loading}
		<Card>
			<div class="py-8 text-center text-gray-500 dark:text-gray-400">
				Loading your journal entries...
			</div>
		</Card>
	{:else if entries.length === 0}
		<Card>
			<div class="py-12 text-center">
				<svg
					class="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					/>
				</svg>
				<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
					No Journal Entries Yet
				</h3>
				<p class="mb-4 text-gray-600 dark:text-gray-400">
					Start writing in your journal to see your entries here
				</p>
				<a
					href="/journal"
					class="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Write First Entry
				</a>
			</div>
		</Card>
	{:else}
		<div class="space-y-4">
			{#each entries as entry (entry.id)}
				<Card>
					<button
						onclick={() => (selectedEntry = selectedEntry?.id === entry.id ? null : entry)}
						class="w-full text-left"
					>
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
									{formatDate(entry.date)}
								</h3>
								<p class="text-sm text-gray-500 dark:text-gray-400">
									{formatShortDate(entry.date)}
								</p>
							</div>
							<div class="flex items-center gap-2">
								<span class="text-sm text-gray-500 dark:text-gray-400">
									{entry.content.split(/\s+/).length} words
								</span>
								<svg
									class="h-5 w-5 text-gray-400 transition-transform duration-200 {selectedEntry?.id ===
									entry.id
										? 'rotate-180'
										: ''}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</div>
						</div>
					</button>

					{#if selectedEntry?.id === entry.id}
						<div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
							<div class="prose dark:prose-invert max-w-none">
								<p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
									{entry.content}
								</p>
							</div>
						</div>
					{/if}
				</Card>
			{/each}
		</div>

		{#if entries.length > 0}
			<div class="pt-4 text-center text-sm text-gray-500 dark:text-gray-400">
				{entries.length}
				{entries.length === 1 ? 'entry' : 'entries'} total
			</div>
		{/if}
	{/if}
</div>
