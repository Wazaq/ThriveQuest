<!-- src/routes/+page.svelte-->
 <script lang="ts">
    export let data;
 </script>

 <h1>  ThriveQuest Dashboard </h1>

 <h2> Accomplishment Quests </h2>

<ul>
    {#each data.quests as quest}
    <li>
        <strong>{quest.title}</strong> - {quest.description}
    </li>
{/each}
</ul>