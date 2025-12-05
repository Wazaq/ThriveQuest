<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let journalEntry = $state('');
	let lastSaved = $state('');
	let cloudSynced = $state(false);
	let saving = $state(false);
	let showPrompts = $state(false);

	// Get today's date in YYYY-MM-DD format
	const todayDate = new Date().toISOString().split('T')[0];
	const todayFormatted = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	onMount(async () => {
		// Load today's entry from DB first
		try {
			const response = await fetch(`/api/journal?date=${todayDate}`);
			if (response.ok) {
				const data = await response.json();
				if (data.content) {
					journalEntry = data.content;
					cloudSynced = true;
					if (data.updatedAt) {
						lastSaved = new Date(data.updatedAt * 1000).toLocaleString();
					}
				}
			}
		} catch (err) {
			console.error('Failed to load journal from cloud:', err);
		}

		// If no cloud entry, check localStorage
		if (!journalEntry && browser) {
			const localKey = `journal_${todayDate}`;
			journalEntry = localStorage.getItem(localKey) || '';
		}

		// Check for yesterday's entry in localStorage that needs syncing
		if (browser) {
			await syncYesterdaysEntry();
		}
	});

	async function syncYesterdaysEntry() {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayDate = yesterday.toISOString().split('T')[0];
		const yesterdayKey = `journal_${yesterdayDate}`;
		const yesterdayContent = localStorage.getItem(yesterdayKey);

		if (yesterdayContent) {
			// Check if it's already in DB
			const response = await fetch(`/api/journal?date=${yesterdayDate}`);
			const data = await response.json();

			// Sync if DB is empty OR if localStorage is different from DB
			if (!data.content || data.content !== yesterdayContent) {
				// Save/update in DB
				await fetch('/api/journal', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ date: yesterdayDate, content: yesterdayContent })
				});
			}
			// Always clean up localStorage after syncing
			localStorage.removeItem(yesterdayKey);
		}
	}

	function saveToLocalStorage() {
		if (browser) {
			const localKey = `journal_${todayDate}`;
			localStorage.setItem(localKey, journalEntry);
			localStorage.setItem('journalLastSaved', new Date().toISOString());
			lastSaved = new Date().toLocaleString();
			cloudSynced = false;
		}
	}

	async function saveToCloud() {
		if (saving) return;

		saving = true;
		try {
			const response = await fetch('/api/journal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ date: todayDate, content: journalEntry })
			});

			if (response.ok) {
				cloudSynced = true;
				lastSaved = new Date().toLocaleString();
				// Clear localStorage since it's now in cloud
				if (browser) {
					const localKey = `journal_${todayDate}`;
					localStorage.removeItem(localKey);
				}
			}
		} catch (err) {
			console.error('Failed to save to cloud:', err);
		} finally {
			saving = false;
		}
	}
</script>

<div class="space-y-6 max-w-4xl">
	<div>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
			My Journal
		</h1>
		<p class="text-gray-600 dark:text-gray-400">
			{todayFormatted}
		</p>
	</div>

	<Card>
		<div class="space-y-4">
			<div class="flex items-center justify-between flex-wrap gap-3">
				<div class="flex items-center gap-2">
					<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
						Today's Reflections
					</h2>
					<button
						onclick={() => showPrompts = !showPrompts}
						class="p-1.5 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						aria-label="Show journal prompts"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
						</svg>
					</button>
				</div>
				<div class="flex items-center gap-3">
					{#if cloudSynced}
						<span class="flex items-center gap-1 text-xs text-primary">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
								<path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
							</svg>
							Synced to cloud
						</span>
					{:else}
						<span class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
							</svg>
							Saved locally
						</span>
					{/if}
					<Button variant="primary" size="sm" onclick={saveToCloud} disabled={saving || cloudSynced}>
						{saving ? 'Saving...' : 'Save to Cloud'}
					</Button>
				</div>
			</div>

			<textarea
				bind:value={journalEntry}
				oninput={saveToLocalStorage}
				placeholder="What's on your mind today? Reflect on your progress, thoughts, feelings, or anything else you'd like to remember..."
				rows="15"
				class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-y"
			></textarea>

			<div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>Entries save locally as you type. Click "Save to Cloud" to sync across devices.</span>
			</div>
		</div>
	</Card>

	<!-- Prompts Overlay -->
	{#if showPrompts}
		<div
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
			onclick={() => showPrompts = false}
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
				onclick={(e) => e.stopPropagation()}
			>
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
						<svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
							<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
						</svg>
						Journaling Prompts
					</h3>
					<button
						onclick={() => showPrompts = false}
						class="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
						aria-label="Close prompts"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
					<p>• What am I grateful for today?</p>
					<p>• What progress did I make toward my goals?</p>
					<p>• What challenged me today, and what did I learn?</p>
					<p>• How did I show up for myself or others?</p>
					<p>• What do I want to focus on tomorrow?</p>
				</div>
			</div>
		</div>
	{/if}
</div>