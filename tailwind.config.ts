import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'class', // Enable dark mode with class strategy

	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#10b981', // emerald-500
					hover: '#059669', // emerald-600
					light: '#34d399', // emerald-400
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
			}
		}
	},

	plugins: []
} as Config;
