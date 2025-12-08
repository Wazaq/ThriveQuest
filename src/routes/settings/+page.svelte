<script lang="ts">
	import NotificationManager from '$lib/components/NotificationManager.svelte';
	import DevBadge from '$lib/components/DevBadge.svelte';
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<div class="max-w-2xl mx-auto px-4 py-8">
		<DevBadge />

		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
			<p class="text-gray-600 dark:text-gray-400">Manage your ThriveQuest preferences</p>
		</div>

		<!-- Back to Dashboard -->
		<a
			href="/"
			class="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			Back to Dashboard
		</a>

		<!-- Notification Settings -->
		<div class="space-y-6">
			<NotificationManager />
		</div>
	</div>
</div>
