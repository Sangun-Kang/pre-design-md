import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en } from './en';
import { ko } from './ko';
import { ja } from './ja';
import { SUPPORTED_LANGS, detectBrowserLang, type Lang, type Messages } from './types';

const DICTIONARIES: Record<Lang, Messages> = { en, ko, ja };
const STORAGE_KEY = 'pdm-lang';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && (SUPPORTED_LANGS as readonly string[]).includes(v)) return v as Lang;
  } catch {
    /* ignore */
  }
  return detectBrowserLang();
}

function interpolate(template: string, vars?: Record<string, string>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k]! : `{${k}}`));
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readStoredLang());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const value = useMemo<LangContextValue>(() => {
    const dict = DICTIONARIES[lang];
    const fallback = DICTIONARIES.en;
    return {
      lang,
      setLang: setLangState,
      t: (key, vars) => {
        const raw = dict[key] ?? fallback[key] ?? key;
        return interpolate(raw, vars);
      },
    };
  }, [lang]);

  return createElement(LangContext.Provider, { value }, children);
}

export function useLang() {
  return useContext(LangContext);
}

export function useT() {
  return useContext(LangContext).t;
}

export { SUPPORTED_LANGS } from './types';
export type { Lang } from './types';
