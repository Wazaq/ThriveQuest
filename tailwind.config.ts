import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'class', // Enable dark mode with class strategy

	theme: {
		extend: {
			colors: {
				// Legacy emerald colors (keep for now during transition)
				primary: {
					DEFAULT: '#10b981', // emerald-500
					hover: '#059669', // emerald-600
					light: '#34d399' // emerald-400
				},
				// New cosmic palette - "The Midnight Nebula"
				quest: {
					black: '#050B10', // Deep background
					slate: '#0D1E26', // Surface/Card background
					teal: '#14F1FF', // Primary glow (neon teal)
					blue: '#2B65FF', // Secondary accent
					gold: '#FFB800', // Accent (sun/completion)
					text: '#E2E8F0', // Primary text
					muted: '#64748B' // Muted text
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
			},
			boxShadow: {
				glow: '0 0 15px -3px rgba(20, 241, 255, 0.5)', // Teal glow effect
				'glow-lg': '0 0 25px -5px rgba(20, 241, 255, 0.6)', // Larger glow
				'glow-gold': '0 0 15px -3px rgba(255, 184, 0, 0.5)' // Gold glow for completions
			},
			backgroundImage: {
				'nebula-gradient': 'radial-gradient(circle at top, #1e293b 0%, #050b10 100%)',
				'cosmic-radial': 'radial-gradient(circle at 50% 0%, rgba(20, 241, 255, 0.1) 0%, transparent 50%)'
			}
		}
	},

	plugins: []
} as Config;
