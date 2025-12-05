<script lang="ts">
	import QuestItem from './QuestItem.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	interface Props {
		quests: Array<{
			id: number;
			title: string;
			description: string;
		}>;
		completions: Array<{ questId: number }>;
		onComplete: (questId: number) => void;
	}

	let { quests, completions, onComplete }: Props = $props();

	function isCompleted(questId: number): boolean {
		return completions.some(c => c.questId === questId);
	}
</script>

<Card>
	<div class="space-y-3">
		<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
			Accomplishment Quests
		</h2>

		{#if quests.length === 0}
			<p class="text-gray-600 dark:text-gray-400 text-center py-8">
				No quests available yet. Check back soon!
			</p>
		{:else}
			<div class="space-y-3">
				{#each quests as quest (quest.id)}
					<QuestItem
						{quest}
						isCompleted={isCompleted(quest.id)}
						{onComplete}
					/>
				{/each}
			</div>
		{/if}
	</div>
</Card>
