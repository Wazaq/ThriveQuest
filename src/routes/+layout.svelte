<script lang="ts">
	import './layout.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children, data } = $props();

	// Determine if we're on an auth page (no header/footer needed)
	$: isAuthPage = $page.url.pathname === '/login' || $page.url.pathname === '/signup';

	async function handleLogout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		goto('/login');
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 transition-colors">
	{#if !isAuthPage && data?.user}
		<!-- Header -->
		<header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center h-16">
					<!-- Logo / Brand -->
					<a href="/" class="flex items-center gap-2">
						<span class="text-2xl">🌱</span>
						<span class="font-bold text-xl text-primary">ThriveQuest</span>
					</a>

					<!-- Navigation -->
					<nav class="hidden md:flex items-center gap-6">
						<a href="/" class="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">Dashboard</a>
						<a href="/journal" class="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">Journal</a>
						<a href="/about" class="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">About</a>
					</nav>

					<!-- Actions -->
					<div class="flex items-center gap-3">
						<!-- Theme Toggle -->
						<button
							onclick={() => themeStore.toggle()}
							class="p-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
							aria-label="Toggle theme"
						>
							{#if themeStore.theme === 'dark'}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
								</svg>
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
								</svg>
							{/if}
						</button>

						<!-- Logout -->
						<button
							onclick={handleLogout}
							class="hidden md:block text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
						>
							Logout
						</button>
					</div>
				</div>

				<!-- Mobile Navigation -->
				<nav class="md:hidden flex gap-4 pb-3 overflow-x-auto">
					<a href="/" class="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors whitespace-nowrap">Dashboard</a>
					<a href="/journal" class="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors whitespace-nowrap">Journal</a>
					<a href="/about" class="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors whitespace-nowrap">About</a>
					<button onclick={handleLogout} class="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors whitespace-nowrap">Logout</button>
				</nav>
			</div>
		</header>
	{/if}

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
		{@render children()}
	</main>

	{#if !isAuthPage && data?.user}
		<!-- Footer -->
		<footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div class="text-center text-sm text-gray-600 dark:text-gray-400">
					<p>ThriveQuest - Your daily wellness companion</p>
				</div>
			</div>
		</footer>
	{/if}
</div>
