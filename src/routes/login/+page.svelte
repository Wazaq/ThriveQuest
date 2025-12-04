<!-- src/routes/signup/+page.svelte -->
    <script lang="ts">
      import { goto } from '$app/navigation';
      let email = '';
      let password = '';
      let error = '';

      async function handleSubmit() {
        error = '';
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          await goto('/');
        } else {
          const data = await response.json();
          error = data.error || 'Login failed';
        }
      }
    </script>

    <h1>Login Foo</h1>
    <form on:submit|preventDefault={handleSubmit}>
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="password" bind:value={password} placeholder="Password" required />
      <button type="submit">Login</button>
      {#if error}
        <p style="color: red;">{error}</p>
      {/if}
    </form>