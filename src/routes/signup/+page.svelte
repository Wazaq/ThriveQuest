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

		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		loading = false;

		if (response.ok) {
			await goto('/onboarding');
		} else {
			const data = await response.json();
			error = data.error || 'Signup failed';
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-md space-y-6">
		<!-- Logo/Header -->
		<div class="space-y-2 text-center">
			<div class="mb-4 text-5xl">🌱</div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Start Your Journey</h1>
			<p class="text-gray-600 dark:text-gray-400">
				Create an account to begin your wellness adventure
			</p>
		</div>

		<!-- Signup Form -->
		<Card>
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<div>
					<label
						for="email"
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
						class="focus:ring-primary w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-transparent focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
					/>
				</div>

				<div>
					<label
						for="password"
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="••••••••"
						required
						minlength="8"
						class="focus:ring-primary w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-transparent focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Minimum 8 characters</p>
				</div>

				{#if error}
					<div
						class="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
					>
						<p class="text-sm text-red-600 dark:text-red-400">
							{error}
						</p>
					</div>
				{/if}

				<Button type="submit" variant="primary" size="lg" disabled={loading}>
					<span class="w-full">
						{loading ? 'Creating account...' : 'Create Account'}
					</span>
				</Button>
			</form>
		</Card>

		<!-- Login link -->
		<div class="text-center">
			<p class="text-gray-600 dark:text-gray-400">
				Already have an account?
				<a
					href="/login"
					class="text-primary hover:text-primary-hover font-medium transition-colors"
				>
					Sign in
				</a>
			</p>
		</div>
	</div>
</div>
