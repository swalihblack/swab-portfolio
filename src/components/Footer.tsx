import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Footer() {
  const { ref, isVisible } = useScrollReveal();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary py-10">
      <div ref={ref} className="container flex flex-col items-center gap-5">
        <a
          href="#"
          className={`font-display text-xl font-bold text-primary-foreground tracking-tight ${
            isVisible ? 'animate-fade-up' : 'opacity-0'
          }`}
        >
          swab
        </a>

        <div
          className={`flex items-center gap-6 ${
            isVisible ? 'animate-fade-up [animation-delay:100ms]' : 'opacity-0'
          }`}
        >
          {[
            { label: 'GitHub', href: 'https://github.com/swalih-ab' },
            { label: 'Behance', href: '#' },
            { label: 'LinkedIn', href: '#' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-primary-foreground/60 hover:text-accent transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p
          className={`font-body text-xs text-primary-foreground/40 ${
            isVisible ? 'animate-fade-up [animation-delay:200ms]' : 'opacity-0'
          }`}
        >
          © {year} Swalih Abdullah. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
