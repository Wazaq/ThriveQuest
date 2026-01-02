<script lang="ts">
	import QuestItem from './QuestItem.svelte';

	interface Props {
		quests: Array<{
			id: number;
			title: string;
			description: string;
			domain: string;
		}>;
		completions: Array<{ questId: number }>;
		onComplete: (questId: number) => void;
	}

	let { quests, completions, onComplete }: Props = $props();

	function isCompleted(questId: number): boolean {
		return completions.some((c) => c.questId === questId);
	}
</script>

<div class="space-y-3">
	{#if quests.length === 0}
		<p class="py-8 text-center text-gray-600 dark:text-quest-muted">
			No quests available yet. Check back soon!
		</p>
	{:else}
		{#each quests as quest (quest.id)}
			<QuestItem {quest} isCompleted={isCompleted(quest.id)} {onComplete} />
		{/each}
	{/if}
</div>
