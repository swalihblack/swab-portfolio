import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';
import ml from './locales/ml.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';
import te from './locales/te.json';
import ko from './locales/ko.json';
import it from './locales/it.json';
import ms from './locales/ms.json';
import th from './locales/th.json';
import pt from './locales/pt.json';
import es from './locales/es.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ru from './locales/ru.json';
import bn from './locales/bn.json';
import id from './locales/id.json';
import tr from './locales/tr.json';
import vi from './locales/vi.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import hi from './locales/hi.json';
import fa from './locales/fa.json';

export const LANGUAGES = [
  // Arabic-related (RTL)
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl' },

  // English (default)
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },

  // Indian languages (specific order)
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr' },

  // Other international languages
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr' },

  // Other Indian languages
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', dir: 'ltr' },

  // Kanji-like languages
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },

  // Kannada (last but before Hindi)
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', dir: 'ltr' },

  // Hindi (last)
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      ur: { translation: ur },
      fa: { translation: fa },
      en: { translation: en },
      ml: { translation: ml },
      ta: { translation: ta },
      bn: { translation: bn },
      it: { translation: it },
      ms: { translation: ms },
      th: { translation: th },
      pt: { translation: pt },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      ru: { translation: ru },
      nl: { translation: nl },
      pl: { translation: pl },
      tr: { translation: tr },
      vi: { translation: vi },
      id: { translation: id },
      te: { translation: te },
      ko: { translation: ko },
      zh: { translation: zh },
      ja: { translation: ja },
      kn: { translation: kn },
      hi: { translation: hi },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;