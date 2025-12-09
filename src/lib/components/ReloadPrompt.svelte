<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

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

	function close() {
		offlineReady.set(false);
		needRefresh.set(false);
	}

	function reload() {
		updateServiceWorker(true);
	}
</script>

{#if $needRefresh}
	<div
		class="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-3 rounded-lg bg-primary p-4 text-white shadow-lg sm:left-auto sm:right-4 sm:max-w-md"
	>
		<div class="flex-1">
			<p class="font-medium">New version available</p>
			<p class="text-sm opacity-90">Click reload to update</p>
		</div>
		<div class="flex gap-2">
			<button
				onclick={reload}
				class="rounded-md bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-gray-100"
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
		class="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-3 rounded-lg bg-gray-900 p-4 text-white shadow-lg sm:left-auto sm:right-4 sm:max-w-md"
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
