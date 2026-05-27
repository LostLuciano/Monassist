// src/utils/theme.ts

export type ThemeType = 'light' | 'dark' | 'liquid-glass' | 'auto';

export const applyTheme = (theme: ThemeType) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark', 'liquid-glass');

  let activeTheme = theme;
  if (theme === 'auto') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    activeTheme = systemPrefersDark ? 'dark' : 'light';
  }

  root.classList.add(activeTheme);

  // Set meta theme-color for browser chrome
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    if (activeTheme === 'light') {
      metaThemeColor.setAttribute('content', '#f8fafc'); // slate-50
    } else if (activeTheme === 'liquid-glass') {
      metaThemeColor.setAttribute('content', '#0b0f19'); // Liquid Glass base dark
    } else {
      metaThemeColor.setAttribute('content', '#020617'); // slate-950
    }
  }
};
