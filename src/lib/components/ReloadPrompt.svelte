<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { onMount, onDestroy } from 'svelte';

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegistered(r) {
			if (!r) return;
			// Visibility change handler will be set up in onMount with proper cleanup
		},
		onRegisterError(error) {
			console.error('SW registration error', error);
		}
	});

	// Track if user clicked reload (vs dismiss)
	let userWantsUpdate = false;

	const handleUpdate = () => {
		if ($needRefresh) {
			userWantsUpdate = true;
			updateServiceWorker(true);
		}
	};

	// Event listeners with proper cleanup to prevent leaks
	let controllerChangeHandler: (() => void) | null = null;
	let visibilityChangeHandler: (() => void) | null = null;
	let registration: ServiceWorkerRegistration | null = null;

	onMount(async () => {
		if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;

		// Set up controllerchange listener
		controllerChangeHandler = () => {
			if (userWantsUpdate) {
				window.location.reload();
			}
		};
		navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);

		// Get service worker registration for visibility change updates
		try {
			registration = await navigator.serviceWorker.ready;

			visibilityChangeHandler = () => {
				if (document.visibilityState === 'visible' && registration) {
					registration.update();
				}
			};
			document.addEventListener('visibilitychange', visibilityChangeHandler);
		} catch (error) {
			console.error('Failed to get service worker registration:', error);
		}
	});

	onDestroy(() => {
		// Clean up event listeners to prevent leaks
		if (controllerChangeHandler && typeof navigator !== 'undefined' && navigator.serviceWorker) {
			navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler);
		}
		if (visibilityChangeHandler) {
			document.removeEventListener('visibilitychange', visibilityChangeHandler);
		}
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
