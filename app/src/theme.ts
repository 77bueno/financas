/** Device-level theme preference (not per-account: it's about the screen, not the data). */

export type Theme = 'dark' | 'light';

const THEME_KEY = 'financas-theme';
const META_COLORS: Record<Theme, string> = { dark: '#0B0D10', light: '#F3F5F7' };

export function getTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLORS[t]);
}

export function setTheme(t: Theme) {
  localStorage.setItem(THEME_KEY, t);
  applyTheme(t);
}

export function initTheme() {
  applyTheme(getTheme());
}
