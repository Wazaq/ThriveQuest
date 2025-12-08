<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		quest: {
			id: number;
			title: string;
			description: string;
			domain: string;
		};
		isCompleted: boolean;
		onComplete: (questId: number) => void;
	}

	let { quest, isCompleted, onComplete }: Props = $props();

	// Domain color mapping
	const domainColors: Record<string, string> = {
		'Positive Emotions': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
		Engagement: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
		Relationships: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
		Meaning: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
		Accomplishment: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
	};
</script>

<div
	class="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
>
	<div class="min-w-0 flex-1">
		<div class="mb-2 flex items-center gap-2">
			<span class="rounded-full px-2.5 py-0.5 text-xs font-medium {domainColors[quest.domain]}">
				{quest.domain}
			</span>
		</div>
		<h3 class="mb-1 font-semibold text-gray-900 dark:text-gray-100">
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
					<svg class="text-primary-light h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
					Completed
				</span>
			</Button>
		{:else}
			<Button variant="primary" size="sm" onclick={() => onComplete(quest.id)}>Complete</Button>
		{/if}
	</div>
</div>
