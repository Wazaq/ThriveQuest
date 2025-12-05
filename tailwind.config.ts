import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'class', // Enable dark mode with class strategy

	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#14b8a6', // teal-500
					hover: '#0d9488', // teal-600
					light: '#2dd4bf', // teal-400
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
			}
		}
	},

	plugins: []
} as Config;
