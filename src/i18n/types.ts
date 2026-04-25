export type Messages = Record<string, string>;

export const SUPPORTED_LANGS = ['en', 'ko', 'ja'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export function detectBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  const langs = navigator.languages ?? [navigator.language];
  for (const l of langs) {
    const code = l.toLowerCase().split('-')[0];
    if (code === 'ko') return 'ko';
    if (code === 'ja') return 'ja';
  }
  return 'en';
}
