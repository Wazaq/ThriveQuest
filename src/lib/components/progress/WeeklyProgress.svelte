<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';

	interface Props {
		completedDays: number;
		currentDayOfWeek: number; // 0-6 (Sunday-Saturday)
		completionDates: string[];
	}

	let { completedDays, currentDayOfWeek, completionDates }: Props = $props();

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// Calculate which days this week are completed
	function isDayCompleted(dayIndex: number): boolean {
		if (dayIndex > currentDayOfWeek) return false; // Future days

		const today = new Date();
		const weekStart = new Date(today);
		weekStart.setDate(today.getDate() - currentDayOfWeek);
		weekStart.setHours(0, 0, 0, 0);

		const checkDate = new Date(weekStart);
		checkDate.setDate(weekStart.getDate() + dayIndex);
		const dateStr = checkDate.toISOString().split('T')[0];

		return completionDates.includes(dateStr);
	}

	$: goalMet = completedDays >= 5;
</script>

<Card>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
				Weekly Progress
			</h2>
			<span class="text-2xl font-bold {goalMet ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}">
				{completedDays} / 5
			</span>
		</div>

		<!-- Visual week representation -->
		<div class="flex justify-between gap-2">
			{#each dayNames as day, index}
				<div class="flex flex-col items-center gap-2 flex-1">
					<div
						class="w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all
							{isDayCompleted(index)
								? 'bg-primary text-white shadow-md'
								: index <= currentDayOfWeek
									? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
									: 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
							}"
					>
						{#if isDayCompleted(index)}
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						{:else}
							{day.charAt(0)}
						{/if}
					</div>
					<span class="text-xs text-gray-500 dark:text-gray-400">
						{day}
					</span>
				</div>
			{/each}
		</div>

		{#if goalMet}
			<div class="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
				<p class="text-sm font-medium text-primary flex items-center justify-center gap-2">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
					Weekly goal achieved! Great work!
				</p>
			</div>
		{/if}
	</div>
</Card>
