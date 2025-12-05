<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';

	interface Props {
		completionDates?: string[];
	}

	let { completionDates = [] }: Props = $props();

	// Get current month info
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth();
	const currentDay = now.getDate();

	// Get first day of month and total days
	const firstDay = new Date(currentYear, currentMonth, 1).getDay();
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

	// Generate array of days
	const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

	// Check if a date is completed
	function isCompleted(day: number): boolean {
		// Format date as YYYY-MM-DD without timezone issues
		const year = currentYear;
		const month = String(currentMonth + 1).padStart(2, '0');
		const dayStr = String(day).padStart(2, '0');
		const dateStr = `${year}-${month}-${dayStr}`;
		return completionDates.includes(dateStr);
	}

	// Check if day is today
	function isToday(day: number): boolean {
		return day === currentDay;
	}

	// Month names
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'];

	const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<Card>
	<div class="space-y-4">
		<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
			{monthNames[currentMonth]} {currentYear}
		</h2>

		<div class="grid grid-cols-7 gap-2">
			<!-- Day headers -->
			{#each dayHeaders as dayName}
				<div class="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2">
					{dayName}
				</div>
			{/each}

			<!-- Empty cells for days before month starts -->
			{#each Array(firstDay) as _}
				<div class="aspect-square"></div>
			{/each}

			<!-- Actual days -->
			{#each days as day}
				<div
					class="aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
						{isCompleted(day)
							? 'bg-primary text-white shadow-md font-bold'
							: isToday(day)
								? 'bg-primary/20 dark:bg-primary/30 text-gray-900 dark:text-gray-100 ring-2 ring-primary font-bold'
								: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
						}"
				>
					{day}
				</div>
			{/each}
		</div>

		<div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
			<div class="flex items-center gap-2">
				<div class="w-4 h-4 rounded bg-primary"></div>
				<span>Completed</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 ring-2 ring-primary"></div>
				<span>Today</span>
			</div>
		</div>
	</div>
</Card>
