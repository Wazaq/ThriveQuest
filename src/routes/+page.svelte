<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import ProgressCalendar from '$lib/components/ProgressCalendar.svelte';
	import WeeklyProgress from '$lib/components/progress/WeeklyProgress.svelte';
	import QuestList from '$lib/components/quests/QuestList.svelte';
	import DomainSelector from '$lib/components/domains/DomainSelector.svelte';

	let { data } = $props();

	// Initialize selected domain from data or localStorage
	let selectedDomain = $state(data.selectedDomain);

	$effect(() => {
		// On mount, check localStorage for saved domain
		if (browser) {
			const saved = localStorage.getItem('selectedDomain');
			if (saved && saved !== selectedDomain) {
				goto(`/?domain=${encodeURIComponent(saved)}`, { replaceState: true });
			}
		}
	});

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

	function handleDomainChange(domain: string) {
		selectedDomain = domain;
		goto(`/?domain=${encodeURIComponent(domain)}`, { replaceState: true, noScroll: true });
	}

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

	// Map domain to color key
	const domainColorMap: Record<string, string> = {
		'Positive Emotion': 'positive',
		'Engagement': 'engagement',
		'Relationships': 'relationships',
		'Meaning': 'meaning',
		'Accomplishment': 'accomplishment'
	};
</script>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
			Welcome back! 🌱
		</h1>
		<p class="text-gray-600 dark:text-gray-400">
			Keep building your daily wellness habits. You're doing great!
		</p>
	</div>

	<!-- Weekly Progress -->
	<WeeklyProgress
		completedDays={completedThisWeek}
		currentDayOfWeek={currentDayOfWeek}
		completionDates={data.completionDates}
	/>

	<!-- Domain Selector & Quest List -->
	<div>
		<DomainSelector
			{selectedDomain}
			onDomainChange={handleDomainChange}
			totalQuestCounts={data.totalQuestCounts}
			incompleteQuestCounts={data.incompleteQuestCounts}
		/>
		<QuestList
			quests={data.quests}
			completions={data.completions}
			onComplete={handleComplete}
			domainTitle={selectedDomain}
			domainColor={domainColorMap[selectedDomain]}
		/>
	</div>

	<!-- Calendar -->
	<ProgressCalendar completionDates={data.completionDates} />
</div>