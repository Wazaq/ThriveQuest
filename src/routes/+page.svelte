<!-- src/routes/+page.svelte-->
 <script lang="ts">
    import ProgressCalendar from '$lib/components/ProgressCalendar.svelte';

    export let data;

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

    // Check if a quest is completed today
    function isCompleted(questId: number){
        return data.completions.some(c => c.questId === questId);
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
 </script>

 <h1>ThriveQuest Dashboard</h1>

 <div class="weekly-progress">
    <p><strong>Your weekly goal:</strong> {completedThisWeek} / 5 days</p>
    {#if completedThisWeek >= 5}
        <p style="color: green;">✓ Weekly goal achieved!</p>
    {/if}
 </div>

 <ProgressCalendar completionDates={data.completionDates} />

  <h2>Accomplishment Quests</h2>
  <ul>
    {#each data.quests as quest}
      <li>
        <strong>{quest.title}</strong> - {quest.description}
        {#if isCompleted(quest.id)}
          <button disabled>Completed</button>
        {:else}
          <button on:click={() =>
  handleComplete(quest.id)}>Complete</button>
        {/if}
      </li>
    {/each}
  </ul>