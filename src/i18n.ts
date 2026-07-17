import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

const supportedLngs = ['en', 'pt', 'es', 'fr', 'de'];

function detectLanguage(): string {
  // 1. Check URL parameter ?lang=xx (for SEO hreflang links)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && supportedLngs.includes(urlLang.toLowerCase())) {
    return urlLang.toLowerCase();
  }

  // 2. Check browser language
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  const short = browserLang.split('-')[0].toLowerCase();
  if (supportedLngs.includes(short)) return short;

  // 3. Fallback
  return 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
    },
    lng: detectLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Update the HTML lang attribute when language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
});

// Set initial lang attribute
document.documentElement.setAttribute('lang', i18n.language);

export default i18n;
