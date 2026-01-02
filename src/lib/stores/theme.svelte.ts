// Theme store using Svelte 5 runes
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

class ThemeStore {
	theme = $state<Theme>('dark'); // Default to dark mode for cosmic design

	constructor() {
		if (browser) {
			// Load saved theme or default to dark
			const saved = localStorage.getItem('theme') as Theme;

			this.theme = saved || 'dark'; // Always default to dark mode
			this.applyTheme();
		}
	}

	toggle() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
		this.applyTheme();
		if (browser) {
			localStorage.setItem('theme', this.theme);
		}
	}

	private applyTheme() {
		if (browser) {
			document.documentElement.classList.toggle('dark', this.theme === 'dark');
		}
	}
}

export const themeStore = new ThemeStore();
