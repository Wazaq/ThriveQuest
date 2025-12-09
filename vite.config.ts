import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'prompt',
			injectRegister: 'auto',
			manifest: {
				name: 'ThriveQuest',
				short_name: 'ThriveQuest',
				description:
					'Your daily wellness companion - Complete quests, track progress, and reflect on your journey',
				start_url: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#10b981',
				orientation: 'portrait-primary',
				icons: [
					{
						src: '/icon.svg',
						sizes: 'any',
						type: 'image/svg+xml',
						purpose: 'any maskable'
					}
				],
				categories: ['health', 'lifestyle', 'productivity']
			},
			workbox: {
				// Cache static assets
				globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
				// Runtime caching for API calls
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/.*\.cloudflare\.com\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'cloudflare-cache',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24 // 24 hours
							}
						}
					}
				]
			},
			devOptions: {
				enabled: false // Set to true if you want to test in dev mode
			}
		})
	]
});
