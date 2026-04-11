import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { LANGUAGES } from '@/i18n';
import { AnimatePresence, motion } from 'framer-motion';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  // Update document direction for RTL languages
  useEffect(() => {
    const lang = LANGUAGES.find(l => l.code === i18n.language);
    document.documentElement.dir = lang?.dir || 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex items-center gap-1.5 p-2 text-primary-foreground/80 hover:text-accent active:scale-95 transition-all"
        aria-label="Change language"
        title={currentLang.nativeName}
      >
        <Globe size={18} />
        <span className="text-xs font-medium uppercase hidden md:inline">{currentLang.code}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors text-left ${
                  i18n.language === lang.code ? 'bg-muted' : ''
                }`}
              >
                <div>
                  <span className="text-sm font-medium text-foreground">{lang.nativeName}</span>
                  <span className="block text-xs text-muted-foreground">{lang.name}</span>
                </div>
                {i18n.language === lang.code && <Check size={14} className="text-accent" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
