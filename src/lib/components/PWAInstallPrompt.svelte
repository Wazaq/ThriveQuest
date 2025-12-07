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
	<div class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
			<div class="flex items-start gap-3">
				<div class="flex-shrink-0 text-3xl">
					🌱
				</div>
				<div class="flex-1">
					<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
						Install ThriveQuest
					</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
						Add to your home screen for quick access and a native app experience
					</p>
					<div class="flex gap-2">
						<button
							onclick={handleInstall}
							class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
						>
							Install
						</button>
						<button
							onclick={handleDismiss}
							class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
						>
							Not now
						</button>
					</div>
				</div>
				<button
					onclick={handleDismiss}
					class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
					aria-label="Close"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
