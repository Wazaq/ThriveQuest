<!-- src/routes/signup/+page.svelte -->
    <script lang="ts">
      import { goto } from '$app/navigation';
      let email = '';
      let password = '';
      let error = '';

      async function handleSubmit() {
        error = '';
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          await goto('/login');
        } else {
          const data = await response.json();
          error = data.error || 'Signup failed';
        }
      }
    </script>

    <h1>Sign Up</h1>
    <form on:submit|preventDefault={handleSubmit}>
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="password" bind:value={password} placeholder="Password" required />
      <button type="submit">Sign Up</button>
      {#if error}
        <p style="color: red;">{error}</p>
      {/if}
    </form>