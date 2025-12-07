<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	// Check if we're on the dev environment
	let isDev = $derived(
		browser && (
			window.location.hostname === 'dev.thrivequest.app' ||
			window.location.hostname.includes('dev.')
		)
	);
</script>

{#if isDev}
	<div class="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">
		<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
		</svg>
		DEV
	</div>
{/if}
