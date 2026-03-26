export default function Footer() {
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

        <p className="font-body text-xs text-primary-foreground/40">
          © {year} Swalih Abdullah. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
