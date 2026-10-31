/** Zustand theme store — light/dark management with localStorage persistence. */
import { create } from 'zustand';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'veyra-theme';

/** Read the saved theme from localStorage, fall back to 'light'. */
function getSavedTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    /* localStorage unavailable */
  }
  return 'light';
}

/** Apply the theme classes to <html>. */
function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Remove all theme classes first
  root.classList.remove('dark', 'ambient');

  if (theme === 'dark') {
    root.classList.add('dark');
  }
  // light is the base — no class needed

  // Persist
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* localStorage unavailable */
  }
}

// Apply saved theme immediately on store creation (before first render)
const initialTheme = getSavedTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
