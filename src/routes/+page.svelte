<script lang="ts">
	import ProgressCalendar from '$lib/components/ProgressCalendar.svelte';
	import WeeklyProgress from '$lib/components/progress/WeeklyProgress.svelte';
	import QuestList from '$lib/components/quests/QuestList.svelte';

	let { data } = $props();

	// Calculate weekly progress (5 out of 7 principle)
	function getWeeklyProgress(): number {
		const today = new Date();
		const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

		// Get start of current week (Sunday)
		const weekStart = new Date(today);
		weekStart.setDate(today.getDate() - currentDay);
		weekStart.setHours(0, 0, 0, 0);

		// Count completions this week
		let completedDays = 0;
		for (let i = 0; i <= currentDay; i++) {
			const checkDate = new Date(weekStart);
			checkDate.setDate(weekStart.getDate() + i);
			const dateStr = checkDate.toISOString().split('T')[0];
			if (data.completionDates.includes(dateStr)) {
				completedDays++;
			}
		}

		return completedDays;
	}

	const completedThisWeek = getWeeklyProgress();
	const currentDayOfWeek = new Date().getDay();

	async function handleComplete(questId: number) {
		const response = await fetch('/api/completions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ questId })
		});

		if (response.ok) {
			// Reload the page to refresh completions
			window.location.reload();
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">Let's thrive today! 🚀</h1>
		<p class="text-gray-600 dark:text-gray-400">
			5 daily quests to build your wellness journey. Let's go!
		</p>
	</div>

	<!-- Weekly Progress -->
	<WeeklyProgress
		completedDays={completedThisWeek}
		{currentDayOfWeek}
		completionDates={data.completionDates}
	/>

	<!-- Daily Quests -->
	<div>
		<div class="mb-4">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Today's Quests</h2>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				5 curated quests across all PERMA domains • Refreshes daily at midnight
			</p>
		</div>
		<QuestList quests={data.quests} completions={data.completions} onComplete={handleComplete} />
	</div>

	<!-- Calendar -->
	<ProgressCalendar completionDates={data.completionDates} />
</div>
