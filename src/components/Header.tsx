import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SearchDialog from '@/components/SearchDialog';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const isHome = location.pathname === '/';

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.projects'), to: '/projects' },
    { label: t('nav.blog'), to: '/blog' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.contact'), to: '/contact' },
  ];

  const toolLinks = [
    { label: t('nav.swabLab'), to: '/tools/swab-colours', desc: t('nav.swabLabDesc') },
    { label: t('nav.swabLibrary'), to: '/tools/swab-colours/library', desc: t('nav.swabLibraryDesc') },
  ];

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (isHome) setVisible(latest > window.innerHeight - 60);
  });

  useEffect(() => {
    if (!isHome) setVisible(true);
    else setVisible(window.scrollY > window.innerHeight - 60);
  }, [isHome, location]);

  useEffect(() => {
    const handleClick = () => setToolsOpen(false);
    if (toolsOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [toolsOpen]);

  const isToolsActive = location.pathname.startsWith('/tools');

  return (
    <motion.header
      initial={false}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm elevation-2"
    >
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-primary-foreground">swab</Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={`font-body text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${location.pathname === link.to ? 'text-accent' : 'text-primary-foreground/80 hover:text-accent'}`}>
              {link.label}
            </Link>
          ))}

          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setToolsOpen(!toolsOpen); }} className={`font-body text-sm font-medium tracking-wide uppercase transition-colors duration-200 flex items-center gap-1 ${isToolsActive ? 'text-accent' : 'text-primary-foreground/80 hover:text-accent'}`}>
              {t('nav.tools')}
              <ChevronDown size={14} className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {toolsOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50" onClick={(e) => e.stopPropagation()}>
                  {toolLinks.map((tool) => (
                    <Link key={tool.to} to={tool.to} onClick={() => setToolsOpen(false)} className={`block px-4 py-3 hover:bg-muted transition-colors ${location.pathname === tool.to ? 'bg-muted' : ''}`}>
                      <span className="text-sm font-semibold text-foreground">{tool.label}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{tool.desc}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <LanguageSwitcher />
          <SearchDialog />
        </nav>

        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher />
          <SearchDialog />
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-primary-foreground p-2 active:scale-95 transition-transform" aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-primary border-t border-primary-foreground/10 animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={`font-body text-base font-medium py-2 transition-colors ${location.pathname === link.to ? 'text-accent' : 'text-primary-foreground/80 hover:text-accent'}`}>
                {link.label}
              </Link>
            ))}
            <button onClick={() => setMobileToolsOpen(!mobileToolsOpen)} className={`font-body text-base font-medium py-2 transition-colors flex items-center gap-1 ${isToolsActive ? 'text-accent' : 'text-primary-foreground/80'}`}>
              {t('nav.tools')}
              <ChevronDown size={16} className={`transition-transform duration-200 ${mobileToolsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileToolsOpen && (
              <div className="pl-4 flex flex-col gap-2">
                {toolLinks.map((tool) => (
                  <Link key={tool.to} to={tool.to} onClick={() => { setMenuOpen(false); setMobileToolsOpen(false); }} className={`font-body text-sm py-1.5 transition-colors ${location.pathname === tool.to ? 'text-accent' : 'text-primary-foreground/70 hover:text-accent'}`}>
                    {tool.label}
                    <span className="block text-xs text-primary-foreground/40">{tool.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      )}
    </motion.header>
  );
}
