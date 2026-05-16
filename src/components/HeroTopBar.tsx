import { Link } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';

/**
 * Non-sticky transparent header rendered inside the hero so the language
 * switcher (and logo) are reachable at the top of the page without
 * scrolling to reveal the sticky header.
 */
export default function HeroTopBar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="container flex items-center justify-between h-14 md:h-16 pointer-events-auto">
        <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-accent-foreground">
          swab
        </Link>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}