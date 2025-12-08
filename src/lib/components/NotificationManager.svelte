<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// VAPID public key - this is safe to expose in frontend
	const VAPID_PUBLIC_KEY = 'BIo04EZh--89kR4IWH4b4GfG-hVSy-j1w_yxakIAc7XQuOzyQkgSgCcDWnSJlLasvcP6VIVsDA8HORn8Ysvtqbs';

	let permissionStatus = $state<'loading' | 'default' | 'granted' | 'denied'>('loading');
	let isSubscribed = $state(false);
	let isProcessing = $state(false);
	let errorMessage = $state<string | null>(null);

	onMount(async () => {
		if (!browser || !('serviceWorker' in navigator)) {
			permissionStatus = 'denied';
			errorMessage = 'Push notifications are not supported in this browser';
			return;
		}

		// Register service worker if not already registered
		try {
			await navigator.serviceWorker.register('/service-worker.js');
		} catch (error) {
			console.error('Service worker registration failed:', error);
		}

		// Check current permission status
		permissionStatus = Notification.permission;

		// Check if already subscribed
		if (permissionStatus === 'granted') {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			isSubscribed = !!subscription;
		}
	});

	function urlBase64ToUint8Array(base64String: string) {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);
		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}

	async function subscribe() {
		if (!browser || isProcessing) return;

		isProcessing = true;
		errorMessage = null;

		try {
			// Wait for service worker to be ready
			const registration = await navigator.serviceWorker.ready;

			// Subscribe to push notifications
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
			});

			// Send subscription to backend
			const response = await fetch('/api/notifications/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(subscription)
			});

			if (!response.ok) {
				throw new Error('Failed to save subscription');
			}

			isSubscribed = true;
			permissionStatus = 'granted';
		} catch (error) {
			console.error('Subscription failed:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to enable notifications';
		} finally {
			isProcessing = false;
		}
	}

	async function unsubscribe() {
		if (!browser || isProcessing) return;

		isProcessing = true;
		errorMessage = null;

		try {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();

			if (subscription) {
				await subscription.unsubscribe();
				isSubscribed = false;
			}
		} catch (error) {
			console.error('Unsubscribe failed:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to disable notifications';
		} finally {
			isProcessing = false;
		}
	}
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
	<div class="flex items-start gap-3 mb-4">
		<div class="text-2xl">🔔</div>
		<div class="flex-1">
			<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
				Push Notifications
			</h3>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Get reminded to complete your daily quests
			</p>
		</div>
	</div>

	{#if errorMessage}
		<div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
			<p class="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
		</div>
	{/if}

	{#if permissionStatus === 'loading'}
		<p class="text-sm text-gray-500">Loading...</p>
	{:else if permissionStatus === 'denied'}
		<div class="space-y-2">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Notifications are blocked. Please enable them in your browser settings.
			</p>
		</div>
	{:else if permissionStatus === 'granted' && isSubscribed}
		<div class="space-y-3">
			<div class="flex items-center gap-2">
				<div class="w-2 h-2 bg-green-500 rounded-full"></div>
				<p class="text-sm text-gray-700 dark:text-gray-300 font-medium">Notifications are enabled</p>
			</div>
			<button
				onclick={unsubscribe}
				disabled={isProcessing}
				class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isProcessing ? 'Processing...' : 'Disable Notifications'}
			</button>
		</div>
	{:else}
		<button
			onclick={subscribe}
			disabled={isProcessing}
			class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{isProcessing ? 'Processing...' : 'Enable Notifications'}
		</button>
	{/if}

	<div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
		<p class="text-xs text-blue-800 dark:text-blue-200">
			<strong>iOS users:</strong> You must "Add to Home Screen" first before enabling notifications.
		</p>
	</div>
</div>
