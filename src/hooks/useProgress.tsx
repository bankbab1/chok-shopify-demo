import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { usePersistedState } from './usePersistedState';
import { useT } from '../i18n';

/** Bump when the content structure changes in a way that makes old progress meaningless. */
const WORKSHOP_ID = 'novastep';
const SCHEMA_VERSION = 1;
const KEY = `sdp-progress:${WORKSHOP_ID}:v${SCHEMA_VERSION}`;

interface Stored {
  done: Record<string, boolean>;
  last?: string;
  updatedAt?: string;
}

interface ProgressCtx {
  done: Record<string, boolean>;
  last?: string;
  toggle: (path: string) => void;
  visit: (path: string) => void;
  reset: () => void;
}

const Ctx = createContext<ProgressCtx | null>(null);

/** Self-reported, per-browser workshop progress (spec FR-07). Not a verification of the Shopify store. */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const t = useT();
  const [state, setState] = usePersistedState<Stored>(KEY, { done: {} });
  const now = () => new Date().toISOString();
  const toggle = useCallback(
    (path: string) => setState((s) => ({ ...s, done: { ...s.done, [path]: !s.done[path] }, updatedAt: now() })),
    [setState],
  );
  const visit = useCallback((path: string) => setState((s) => (s.last === path ? s : { ...s, last: path, updatedAt: now() })), [setState]);
  const reset = useCallback(() => {
    if (window.confirm(t('Reset your workshop progress in this browser?'))) setState({ done: {} });
  }, [setState, t]);
  return <Ctx.Provider value={{ done: state.done ?? {}, last: state.last, toggle, visit, reset }}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
