<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		selectedDomain: string;
		onDomainChange: (domain: string) => void;
		questCounts?: Record<string, number>;
	}

	let { selectedDomain, onDomainChange, questCounts = {} }: Props = $props();

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
		{@const questCount = questCounts[domain.id] || 0}
		{@const hasQuests = questCount > 0}

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
			<!-- Letter badge -->
			<div class="flex items-center justify-center h-full">
				<span class="text-2xl font-bold text-white drop-shadow-md">
					{domain.letter}
				</span>
			</div>

			<!-- Quest count badge -->
			{#if hasQuests && questCount > 0}
				<div class="absolute top-1 right-1 bg-gray-900 dark:bg-gray-950 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
					{questCount}
				</div>
			{/if}
		</button>
	{/each}
</div>
