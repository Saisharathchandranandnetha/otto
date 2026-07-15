// Lightweight i18n helper for Otto
// Reads locale from cookie/localStorage. Defaults to 'en'.
// Uses simple object property lookup for translations.

export type Locale = 'en' | 'hi' | 'te';

// Import JSON dictionaries (these will be created in the next steps)
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import te from '../locales/te.json';

const DICTIONARIES = { en, hi, te };

export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  
  const saved = localStorage.getItem('otto_locale') as Locale;
  if (saved && Object.keys(DICTIONARIES).includes(saved)) {
    return saved;
  }
  
  // Default to English
  return 'en';
}

export function setLocale(locale: Locale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('otto_locale', locale);
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    // Force reload to apply changes globally
    window.location.reload();
  }
}

export function t(key: string, locale?: Locale): string {
  const currentLocale = locale || getLocale();
  const dict = DICTIONARIES[currentLocale] || DICTIONARIES['en'];
  
  // Basic dot notation support (e.g. 'feed.approvals')
  const keys = key.split('.');
  let value: any = dict;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key missing in translation
      if (currentLocale !== 'en') {
        return t(key, 'en');
      }
      return key; // Fallback to key itself
    }
  }
  
  return String(value);
}

// Ensure currency is always formatted with Indian number grouping
export function formatCurrency(amount: number, locale?: Locale): string {
  // We use 'en-IN' regardless of UI language to ensure proper lakh/crore formatting,
  // but we could switch to 'hi-IN' or 'te-IN' if we want localized digits.
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
