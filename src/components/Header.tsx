import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const isHome = location.pathname === '/';

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (isHome) {
      // Show header only after scrolling past the viewport height (hero)
      setVisible(latest > window.innerHeight - 60);
    }
  });

  useEffect(() => {
    // On non-home pages, always show header
    if (!isHome) {
      setVisible(true);
    } else {
      setVisible(window.scrollY > window.innerHeight - 60);
    }
  }, [isHome, location]);

  return (
    <motion.header
      initial={false}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm elevation-2"
    >
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link
          to="/"
          className="font-display text-2xl md:text-3xl font-bold tracking-tight text-primary-foreground"
        >
          swab
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${
                location.pathname === link.to
                  ? 'text-accent'
                  : 'text-primary-foreground/80 hover:text-accent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-primary-foreground p-2 active:scale-95 transition-transform"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-primary border-t border-primary-foreground/10 animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`font-body text-base font-medium py-2 transition-colors ${
                  location.pathname === link.to
                    ? 'text-accent'
                    : 'text-primary-foreground/80 hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </motion.header>
  );
}
