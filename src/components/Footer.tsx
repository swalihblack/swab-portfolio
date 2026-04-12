import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/i18n';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-primary py-10">
      <div className="container flex flex-col items-center gap-5">
        <a href="#" className="font-display text-xl font-bold text-primary-foreground tracking-tight">
          swab
        </a>

        <div className="flex items-center gap-6">
          {[
            { label: 'GitHub', href: 'https://github.com/swalih-ab' },
            { label: 'Behance', href: '#' },
            { label: 'LinkedIn', href: '#' },
          ].map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-primary-foreground/60 hover:text-accent transition-colors duration-200">
              {link.label}
            </a>
          ))}
        </div>

        {/* Language list */}
        <div className="w-full max-w-2xl text-center">
          <p className="font-body text-xs text-primary-foreground/40 mb-3">{t('footer.languages')}</p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`font-body text-xs transition-colors duration-200 ${
                  i18n.language === lang.code
                    ? 'text-accent font-semibold'
                    : 'text-primary-foreground/50 hover:text-accent'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>

        <p className="font-body text-xs text-primary-foreground/40">
          {t('footer.rights', { year })}
        </p>
      </div>
    </footer>
  );
}
