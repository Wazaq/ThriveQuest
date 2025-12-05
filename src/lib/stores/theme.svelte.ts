// Theme store using Svelte 5 runes
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

class ThemeStore {
	theme = $state<Theme>('light');

	constructor() {
		if (browser) {
			// Load saved theme or detect system preference
			const saved = localStorage.getItem('theme') as Theme;
			const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

			this.theme = saved || (systemPrefersDark ? 'dark' : 'light');
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
