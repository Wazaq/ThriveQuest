<script lang="ts">
	import './layout.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import PWAInstallPrompt from '$lib/components/PWAInstallPrompt.svelte';
	import ReloadPrompt from '$lib/components/ReloadPrompt.svelte';
	import DevBadge from '$lib/components/DevBadge.svelte';

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
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-gray-50"
>
	{#if !isAuthPage && data?.user}
		<!-- Header -->
		<header
			class="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between">
					<!-- Logo / Brand -->
					<a href="/" class="flex items-center gap-2">
						<span class="text-2xl">🌱</span>
						<span class="text-primary text-xl font-bold">ThriveQuest</span>
						<DevBadge />
					</a>

					<!-- Navigation -->
					<nav class="hidden items-center gap-6 md:flex">
						<a
							href="/"
							class="hover:text-primary font-medium text-gray-900 transition-colors dark:text-gray-100"
							>Dashboard</a
						>
						<a
							href="/journal"
							class="hover:text-primary font-medium text-gray-900 transition-colors dark:text-gray-100"
							>Journal</a
						>
						<a
							href="/settings"
							class="hover:text-primary font-medium text-gray-900 transition-colors dark:text-gray-100"
							>Settings</a
						>
						<a
							href="/about"
							class="hover:text-primary font-medium text-gray-900 transition-colors dark:text-gray-100"
							>About</a
						>
					</nav>

					<!-- Actions -->
					<div class="flex items-center">
						<!-- Logout Icon -->
						<button
							onclick={handleLogout}
							class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-gray-700"
							aria-label="Logout"
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Mobile Navigation -->
				<nav class="flex gap-4 overflow-x-auto pb-3 md:hidden">
					<a
						href="/"
						class="hover:text-primary text-sm whitespace-nowrap text-gray-700 transition-colors dark:text-gray-300"
						>Dashboard</a
					>
					<a
						href="/journal"
						class="hover:text-primary text-sm whitespace-nowrap text-gray-700 transition-colors dark:text-gray-300"
						>Journal</a
					>
					<a
						href="/settings"
						class="hover:text-primary text-sm whitespace-nowrap text-gray-700 transition-colors dark:text-gray-300"
						>Settings</a
					>
					<a
						href="/about"
						class="hover:text-primary text-sm whitespace-nowrap text-gray-700 transition-colors dark:text-gray-300"
						>About</a
					>
				</nav>
			</div>
		</header>
	{/if}

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
		{@render children()}
	</main>

	{#if !isAuthPage && data?.user}
		<!-- Footer -->
		<footer class="mt-12 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
			<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				<div class="flex flex-col items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
					<p>ThriveQuest - Your daily wellness companion</p>
					<div class="flex gap-4">
						<a
							href="https://forms.gle/8jFDRrrZNcvjS3tZ7"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-primary flex items-center gap-1 transition-colors"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
								/>
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

	<!-- PWA Update Prompt (available for all users) -->
	<ReloadPrompt />
</div>
