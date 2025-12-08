<script lang="ts">
	import QuestItem from './QuestItem.svelte';

	interface Props {
		quests: Array<{
			id: number;
			title: string;
			description: string;
		}>;
		completions: Array<{ questId: number }>;
		onComplete: (questId: number) => void;
		domainTitle: string;
		domainColor: string;
	}

	let { quests, completions, onComplete, domainTitle, domainColor }: Props = $props();

	function isCompleted(questId: number): boolean {
		return completions.some((c) => c.questId === questId);
	}

	const colorMap: Record<string, string> = {
		positive: 'border-positive',
		engagement: 'border-engagement',
		relationships: 'border-relationships',
		meaning: 'border-meaning',
		accomplishment: 'border-accomplishment'
	};
</script>

<div
	class="rounded-lg border border-t-8 border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 {colorMap[
		domainColor
	]} p-6 transition-all duration-300"
>
	<div class="space-y-3">
		<h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
			{domainTitle} Quests
		</h2>

		{#if quests.length === 0}
			<p class="py-8 text-center text-gray-600 dark:text-gray-400">
				No quests available yet. Check back soon!
			</p>
		{:else}
			<div class="space-y-3">
				{#each quests as quest (quest.id)}
					<QuestItem {quest} isCompleted={isCompleted(quest.id)} {onComplete} />
				{/each}
			</div>
		{/if}
	</div>
</div>
