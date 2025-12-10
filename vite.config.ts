import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.ts',
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
			injectManifest: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}']
			},
			devOptions: {
				enabled: false
			}
		})
	]
});
