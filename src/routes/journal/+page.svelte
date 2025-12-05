<!-- src/routes/journal/+page.svelte -->
    <script lang="ts">
      import { onMount } from 'svelte';

      let journalEntry = '';

      onMount(() => {
        journalEntry = localStorage.getItem('journalEntry') || '';
      });

      function saveEntry() {
        localStorage.setItem('journalEntry', journalEntry);
      }
    </script>

    <h1>My Journal</h1>
    <textarea bind:value={journalEntry} on:input={saveEntry} rows="10"> </textarea>