import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Briefcase, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGitHubPortfolio } from '@/hooks/useGitHubPortfolio';
import { useGitHubBlog } from '@/hooks/useGitHubBlog';

const GITHUB_OWNER = 'swalihblack';
const GITHUB_REPO = 'swab-portfolio';

interface SearchResult {
  type: 'project' | 'blog' | 'page';
  title: string;
  subtitle: string;
  url: string;
}

const PAGES: SearchResult[] = [
  { type: 'page', title: 'Home', subtitle: 'Main page', url: '/' },
  { type: 'page', title: 'Projects', subtitle: 'All projects', url: '/projects' },
  { type: 'page', title: 'Blog', subtitle: 'All blog posts', url: '/blog' },
  { type: 'page', title: 'About', subtitle: 'About Swalih Abdullah', url: '/about' },
  { type: 'page', title: 'Contact', subtitle: 'Get in touch', url: '/contact' },
];

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { projects } = useGitHubPortfolio({ owner: GITHUB_OWNER, repo: GITHUB_REPO });
  const { posts } = useGitHubBlog({ owner: GITHUB_OWNER, repo: GITHUB_REPO });

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) setQuery('');
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return PAGES;

    const matches: SearchResult[] = [];

    // Search pages
    PAGES.forEach((p) => {
      if (p.title.toLowerCase().includes(q)) matches.push(p);
    });

    // Search projects
    projects.forEach((p) => {
      const searchable = `${p.title} ${p.subtitle} ${p.description} ${p.tools.join(' ')} ${p.client}`.toLowerCase();
      if (searchable.includes(q)) {
        matches.push({
          type: 'project',
          title: p.title,
          subtitle: p.subtitle || p.client || '',
          url: `/projects`,
        });
      }
    });

    // Search blog posts
    posts.forEach((p) => {
      const searchable = `${p.title} ${p.excerpt} ${p.tags.join(' ')}`.toLowerCase();
      if (searchable.includes(q)) {
        matches.push({
          type: 'blog',
          title: p.title,
          subtitle: p.excerpt.slice(0, 80) + '...',
          url: `/blog/${p.slug}`,
        });
      }
    });

    return matches;
  }, [query, projects, posts]);

  const goTo = useCallback((url: string) => {
    setOpen(false);
    navigate(url);
  }, [navigate]);

  const iconFor = (type: string) => {
    if (type === 'project') return <Briefcase size={16} className="text-primary shrink-0" />;
    if (type === 'blog') return <FileText size={16} className="text-primary shrink-0" />;
    return <ArrowRight size={16} className="text-muted-foreground shrink-0" />;
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-primary-foreground/80 hover:text-accent active:scale-95 transition-all"
        aria-label="Search"
      >
        <Search size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
            onClick={() => setOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-card rounded-lg shadow-2xl border border-border overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={18} className="text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, blog posts, pages..."
                  className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto py-2">
                {results.length === 0 && (
                  <p className="font-body text-sm text-muted-foreground text-center py-8">
                    No results found.
                  </p>
                )}

                {results.map((result, i) => (
                  <button
                    key={`${result.type}-${result.url}-${i}`}
                    onClick={() => goTo(result.url)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    {iconFor(result.type)}
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm font-medium text-foreground truncate">
                        {result.title}
                      </p>
                      <p className="font-body text-xs text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider shrink-0">
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-border flex items-center justify-end gap-2">
                <kbd className="text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                  ESC
                </kbd>
                <span className="text-[10px] font-body text-muted-foreground">to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
