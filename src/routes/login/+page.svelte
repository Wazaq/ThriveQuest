<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleSubmit() {
		error = '';
		loading = true;

		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		loading = false;

		if (response.ok) {
			await goto('/');
		} else {
			const data = await response.json();
			error = data.error || 'Login failed';
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center px-4">
	<div class="w-full max-w-md space-y-6">
		<!-- Logo/Header -->
		<div class="text-center space-y-2">
			<div class="text-5xl mb-4">🌱</div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
				Welcome to ThriveQuest
			</h1>
			<p class="text-gray-600 dark:text-gray-400">
				Sign in to continue your wellness journey
			</p>
		</div>

		<!-- Login Form -->
		<Card>
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Email
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
						class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="••••••••"
						required
						class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
					/>
				</div>

				{#if error}
					<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
						<p class="text-sm text-red-600 dark:text-red-400">
							{error}
						</p>
					</div>
				{/if}

				<Button type="submit" variant="primary" size="lg" disabled={loading}>
					<span class="w-full">
						{loading ? 'Signing in...' : 'Sign In'}
					</span>
				</Button>
			</form>
		</Card>

		<!-- Sign up link -->
		<div class="text-center">
			<p class="text-gray-600 dark:text-gray-400">
				Don't have an account?
				<a href="/signup" class="text-primary hover:text-primary-hover font-medium transition-colors">
					Sign up
				</a>
			</p>
		</div>
	</div>
</div>