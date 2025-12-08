<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let deferredPrompt: any = null;
	let showPrompt = $state(false);
	let isInstalled = $state(false);

	onMount(() => {
		if (!browser) return;

		// Check if already installed
		if (window.matchMedia('(display-mode: standalone)').matches) {
			isInstalled = true;
			return;
		}

		// Listen for the beforeinstallprompt event
		const handleBeforeInstallPrompt = (e: Event) => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault();
			// Store the event so it can be triggered later
			deferredPrompt = e;
			// Show our custom install prompt
			showPrompt = true;
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		// Check if user dismissed it before
		const dismissed = localStorage.getItem('pwa-install-dismissed');
		if (dismissed) {
			const dismissedDate = new Date(dismissed);
			const daysSinceDismiss = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
			// Show again after 7 days
			if (daysSinceDismiss < 7) {
				showPrompt = false;
			}
		}

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		};
	});

	async function handleInstall() {
		if (!deferredPrompt) return;

		// Show the install prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === 'accepted') {
			console.log('User accepted the install prompt');
			isInstalled = true;
		}

		// Clear the deferredPrompt
		deferredPrompt = null;
		showPrompt = false;
	}

	function handleDismiss() {
		showPrompt = false;
		localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
	}
</script>

{#if showPrompt && !isInstalled}
	<div
		class="animate-slide-up fixed right-4 bottom-4 left-4 z-50 md:right-4 md:left-auto md:max-w-sm"
	>
		<div
			class="rounded-lg border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="flex items-start gap-3">
				<div class="flex-shrink-0 text-3xl">🌱</div>
				<div class="flex-1">
					<h3 class="mb-1 font-semibold text-gray-900 dark:text-gray-100">Install ThriveQuest</h3>
					<p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
						Add to your home screen for quick access and a native app experience
					</p>
					<div class="flex gap-2">
						<button
							onclick={handleInstall}
							class="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
						>
							Install
						</button>
						<button
							onclick={handleDismiss}
							class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Not now
						</button>
					</div>
				</div>
				<button
					onclick={handleDismiss}
					class="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
					aria-label="Close"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes slide-up {
		from {
			transform: translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-slide-up {
		animation: slide-up 0.3s ease-out;
	}
</style>
