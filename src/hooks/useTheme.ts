import { usePersistedState } from './usePersistedState';

export type Theme = 'light' | 'dark';

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

export function useTheme() {
  return usePersistedState<Theme>('sdp-theme', prefersDark() ? 'dark' : 'light');
}
