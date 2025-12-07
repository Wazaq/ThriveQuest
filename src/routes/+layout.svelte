<script lang="ts">
	import './layout.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import PWAInstallPrompt from '$lib/components/PWAInstallPrompt.svelte';

	let { children, data } = $props();

	// Determine if we're on an auth page (no header/footer needed)
	let isAuthPage = $derived($page.url.pathname === '/login' || $page.url.pathname === '/signup');

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
						<a href="/" class="text-gray-900 dark:text-gray-100 hover:text-primary font-medium transition-colors">Dashboard</a>
						<a href="/journal" class="text-gray-900 dark:text-gray-100 hover:text-primary font-medium transition-colors">Journal</a>
						<a href="/about" class="text-gray-900 dark:text-gray-100 hover:text-primary font-medium transition-colors">About</a>
					</nav>

					<!-- Actions -->
					<div class="flex items-center">
						<!-- Logout Icon -->
						<button
							onclick={handleLogout}
							class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
							aria-label="Logout"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
						</button>
					</div>
				</div>

				<!-- Mobile Navigation -->
				<nav class="md:hidden flex gap-4 pb-3 overflow-x-auto">
					<a href="/" class="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors whitespace-nowrap">Dashboard</a>
					<a href="/journal" class="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors whitespace-nowrap">Journal</a>
					<a href="/about" class="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors whitespace-nowrap">About</a>
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
				<div class="flex flex-col items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
					<p>ThriveQuest - Your daily wellness companion</p>
					<div class="flex gap-4">
						<a
							href="mailto:feedback@thrivequest.app?subject=ThriveQuest Feedback"
							class="hover:text-primary transition-colors flex items-center gap-1"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
							</svg>
							Send Feedback
						</a>
					</div>
				</div>
			</div>
		</footer>

		<!-- PWA Install Prompt (only for authenticated users) -->
		<PWAInstallPrompt />
	{/if}
</div>
