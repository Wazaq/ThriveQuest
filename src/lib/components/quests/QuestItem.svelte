<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		quest: {
			id: number;
			title: string;
			description: string;
		};
		isCompleted: boolean;
		onComplete: (questId: number) => void;
	}

	let { quest, isCompleted, onComplete }: Props = $props();
</script>

<div class="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
	<div class="flex-1 min-w-0">
		<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
			{quest.title}
		</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400">
			{quest.description}
		</p>
	</div>

	<div class="flex-shrink-0">
		{#if isCompleted}
			<Button variant="secondary" size="sm" disabled={true}>
				<span class="flex items-center gap-1">
					<svg class="w-4 h-4 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
					</svg>
					Completed
				</span>
			</Button>
		{:else}
			<Button variant="primary" size="sm" onclick={() => onComplete(quest.id)}>
				Complete
			</Button>
		{/if}
	</div>
</div>
