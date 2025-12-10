<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Check if we're on dev environment
	let isDev =
		browser &&
		(window.location.hostname === 'dev.thrivequest.app' ||
			window.location.hostname.includes('dev.'));

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegistered(r) {
			if (!r) return;

			// In production, check for updates when tab becomes visible
			// In dev, don't auto-check (too many deployments cause confusion)
			if (!isDev) {
				document.addEventListener('visibilitychange', () => {
					if (document.visibilityState === 'visible') {
						r.update();
					}
				});
			}
		},
		onRegisterError(error) {
			console.error('SW registration error', error);
		}
	});

	const handleUpdate = () => {
		// This function's only job is to tell the service worker to update.
		// The 'controllerchange' listener below will handle the reload.
		if ($needRefresh) {
			updateServiceWorker(true);
		}
	};

	onMount(() => {
		// This listener is the key. It waits for the new service worker to take control.
		// Once it does, we can safely reload the page to get the new content.
		// We only need to register this listener once.
		const onControllerChange = () => {
			window.location.reload();
		};

		if (navigator.serviceWorker) {
			navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
		}

		// Cleanup the listener when the component is destroyed
		return () => {
			if (navigator.serviceWorker) {
				navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
			}
		};
	});
</script>

{#if $needRefresh}
	<div
		class="bg-primary fixed right-4 bottom-4 left-4 z-50 flex items-center justify-between gap-3 rounded-lg p-4 text-white shadow-lg sm:right-4 sm:left-auto sm:max-w-md"
		role="alert"
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
				onclick={() => needRefresh.set(false)}
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
		role="alert"
	>
		<div class="flex-1">
			<p class="font-medium">App ready for offline use</p>
		</div>
		<button
			onclick={() => offlineReady.set(false)}
			class="rounded-md border border-white/30 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
		>
			OK
		</button>
	</div>
{/if}
