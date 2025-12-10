<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { onMount } from 'svelte';

	let userClickedReload = false;
	let showBanner = $state(true);

	// Check if user recently dismissed the update banner
	onMount(() => {
		if (typeof localStorage !== 'undefined') {
			const dismissed = localStorage.getItem('pwa-update-dismissed');
			if (dismissed) {
				const dismissedTime = parseInt(dismissed);
				const oneHourAgo = Date.now() - 60 * 60 * 1000;

				// Hide banner if dismissed within the last hour
				if (dismissedTime > oneHourAgo) {
					showBanner = false;
				}
			}
		}
	});

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegistered(r) {
			console.log('Service Worker registered');
			// Check for updates every 60 seconds
			if (r) {
				setInterval(() => {
					console.log('Checking for SW updates...');
					r.update();
				}, 60000);
			}
		},
		onRegisterError(error) {
			console.error('SW registration error', error);
		}
	});

	// When user clicks "Reload", tell the new SW to take control
	const handleUpdate = () => {
		if ($needRefresh) {
			userClickedReload = true;

			// Clear dismissal flag since they're applying the update
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('pwa-update-dismissed');
			}

			updateServiceWorker(true);
		}
	};

	// The 'controllerchange' event fires when the new service worker has taken over.
	// Only reload if the user actually clicked "Reload" (not "Later")
	if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
		navigator.serviceWorker.addEventListener('controllerchange', () => {
			if (userClickedReload) {
				window.location.reload();
			}
		});
	}

	function close() {
		offlineReady.set(false);
		needRefresh.set(false);

		// Store dismissal in localStorage to prevent showing again on navigation
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('pwa-update-dismissed', Date.now().toString());
		}
	}
</script>

{#if $needRefresh && showBanner}
	<div
		class="bg-primary fixed right-4 bottom-4 left-4 z-50 flex items-center justify-between gap-3 rounded-lg p-4 text-white shadow-lg sm:right-4 sm:left-auto sm:max-w-md"
	>
		<div class="flex-1">
			<p class="font-medium">New version available</p>
			<p class="text-sm opacity-90">Click reload to update</p>
		</div>
		<div class="flex gap-2">
			<button
				onclick={handleUpdate}
				class="text-primary rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
			>
				Reload
			</button>
			<button
				onclick={close}
				class="rounded-md border border-white/30 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
			>
				Later
			</button>
		</div>
	</div>
{/if}

{#if $offlineReady}
	<div
		class="fixed right-4 bottom-4 left-4 z-50 flex items-center justify-between gap-3 rounded-lg bg-gray-900 p-4 text-white shadow-lg sm:right-4 sm:left-auto sm:max-w-md"
	>
		<div class="flex-1">
			<p class="font-medium">App ready for offline use</p>
		</div>
		<button
			onclick={close}
			class="rounded-md border border-white/30 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
		>
			OK
		</button>
	</div>
{/if}
