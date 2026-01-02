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

	// Domain color mapping - using PERMA colors from app.css
	const domainColors: Record<string, string> = {
		'Positive Emotions': 'bg-yellow-100 text-yellow-800 dark:bg-positive/20 dark:text-positive',
		Engagement: 'bg-blue-100 text-blue-800 dark:bg-engagement/20 dark:text-engagement',
		Relationships: 'bg-pink-100 text-pink-800 dark:bg-relationships/20 dark:text-relationships',
		Meaning: 'bg-purple-100 text-purple-800 dark:bg-meaning/20 dark:text-meaning',
		Accomplishment: 'bg-emerald-100 text-emerald-800 dark:bg-accomplishment/20 dark:text-accomplishment'
	};
</script>

<div
	class="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-slate-800 dark:bg-quest-slate/80 {isCompleted ? 'dark:shadow-glow-gold' : 'hover:dark:border-quest-teal/30'}"
>
	<div class="min-w-0 flex-1">
		<div class="mb-2 flex items-center gap-2">
			<span class="rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase {domainColors[quest.domain]}">
				{quest.domain}
			</span>
		</div>
		<h3 class="mb-1 font-bold tracking-wide text-gray-900 dark:text-quest-text">
			{quest.title}
		</h3>
		<p class="text-sm leading-relaxed text-gray-600 dark:text-quest-muted">
			{quest.description}
		</p>
	</div>

	<div class="flex-shrink-0">
		{#if isCompleted}
			<div class="flex items-center gap-1.5 rounded-lg bg-quest-gold/20 px-3 py-2 text-quest-gold">
				<svg class="h-5 w-5 drop-shadow-glow-gold" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="text-sm font-semibold">Completed</span>
			</div>
		{:else}
			<Button variant="primary" size="sm" onclick={() => onComplete(quest.id)}>Complete</Button>
		{/if}
	</div>
</div>
