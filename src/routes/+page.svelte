<!-- src/routes/+page.svelte-->
 <script lang="ts">
    export let data;

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