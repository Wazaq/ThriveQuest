<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		selectedDomain: string;
		onDomainChange: (domain: string) => void;
		totalQuestCounts?: Record<string, number>;
		incompleteQuestCounts?: Record<string, number>;
	}

	let { selectedDomain, onDomainChange, totalQuestCounts = {}, incompleteQuestCounts = {} }: Props = $props();

	const domains = [
		{ id: 'Positive Emotion', letter: 'P', color: 'positive', label: 'Positive Emotion' },
		{ id: 'Engagement', letter: 'E', color: 'engagement', label: 'Engagement' },
		{ id: 'Relationships', letter: 'R', color: 'relationships', label: 'Relationships' },
		{ id: 'Meaning', letter: 'M', color: 'meaning', label: 'Meaning' },
		{ id: 'Accomplishment', letter: 'A', color: 'accomplishment', label: 'Accomplishment' }
	];

	const colorMap: Record<string, string> = {
		positive: 'bg-positive',
		engagement: 'bg-engagement',
		relationships: 'bg-relationships',
		meaning: 'bg-meaning',
		accomplishment: 'bg-accomplishment'
	};

	function selectDomain(domain: string) {
		selectedDomain = domain;
		onDomainChange(domain);
		if (browser) {
			localStorage.setItem('selectedDomain', domain);
		}
	}
</script>

<div class="flex gap-2 mb-4">
	{#each domains as domain}
		{@const isSelected = selectedDomain === domain.id}
		{@const totalQuests = totalQuestCounts[domain.id] || 0}
		{@const incompleteQuests = incompleteQuestCounts[domain.id] || 0}
		{@const hasQuests = totalQuests > 0}

		<button
			onclick={() => selectDomain(domain.id)}
			disabled={!hasQuests}
			class="relative flex-1 h-16 rounded-t-lg transition-all duration-300 {colorMap[domain.color]}
				{isSelected
					? 'opacity-100'
					: hasQuests
						? 'opacity-40 hover:opacity-60'
						: 'opacity-20 cursor-not-allowed'
				}
				{!isSelected && hasQuests ? 'border-b-4 border-gray-900 dark:border-gray-950' : ''}
			"
			aria-label="{domain.label} domain"
		>
			<!-- Letter badge or lock icon -->
			<div class="flex items-center justify-center h-full">
				{#if hasQuests}
					<span class="text-2xl font-bold text-white drop-shadow-md">
						{domain.letter}
					</span>
				{:else}
					<svg class="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
					</svg>
				{/if}
			</div>

			<!-- Quest count badge (show incomplete count) -->
			{#if hasQuests && incompleteQuests > 0}
				<div class="absolute top-1 right-1 bg-gray-900 dark:bg-gray-950 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
					{incompleteQuests}
				</div>
			{/if}
		</button>
	{/each}
</div>
