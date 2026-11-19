import { createContext, useCallback, useContext, useEffect, type ReactNode } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { TH } from './th';

export type Lang = 'th' | 'en';

type Vars = Record<string, string | number>;
type T = (text: string, vars?: Vars) => string;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
}

const Ctx = createContext<I18nCtx | null>(null);

// Dev-only: collect English strings that have no Thai entry yet (inspect with window.__missingTh).
const missing = new Set<string>();
if (import.meta.env.DEV) (window as unknown as { __missingTh: Set<string> }).__missingTh = missing;

function interpolate(s: string, vars?: Vars) {
  return vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s;
}

/**
 * English is the source text everywhere (data files + components). In Thai mode each string is
 * looked up in the TH dictionary; anything without an entry (product copy, code, Shopify labels)
 * falls back to the English text unchanged.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = usePersistedState<Lang>('sdp-lang', 'th');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback<T>(
    (text, vars) => {
      if (lang === 'en') return interpolate(text, vars);
      const hit = TH[text];
      if (hit === undefined && import.meta.env.DEV) missing.add(text);
      return interpolate(hit ?? text, vars);
    },
    [lang],
  );

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

/** Shorthand when only the translate function is needed. */
export function useT() {
  return useI18n().t;
}
