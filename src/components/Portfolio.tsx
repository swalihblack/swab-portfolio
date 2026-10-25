import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGitHubPortfolio, type Project } from '@/hooks/useGitHubPortfolio';
import { ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ProjectModal } from '@/components/portfolio/ProjectModal';
import { PortfolioViewToggle } from '@/components/portfolio/PortfolioViewToggle';
import { ProjectsToolbar, type ProjectViewMode } from '@/components/portfolio/ProjectsToolbar';
import { ProjectListItem } from '@/components/portfolio/ProjectListItem';
import { sortProjects, type ProjectSortKey } from '@/lib/projectSort';

const GITHUB_OWNER = 'swalihblack';
const GITHUB_REPO = 'swab-portfolio';

interface PortfolioProps {
  maxProjects?: number;
  showViewAll?: boolean;
  showToolbar?: boolean;
}

export default function Portfolio({ maxProjects, showViewAll, showToolbar }: PortfolioProps) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const headingY = useTransform(scrollYProgress, [0, 0.3, 1], [60, 0, -20]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);

  const { projects: ghProjects, loading, error, refetch } = useGitHubPortfolio({ owner: GITHUB_OWNER, repo: GITHUB_REPO });
  const [view, setView] = useState<ProjectViewMode>('double');
  const [sort, setSort] = useState<ProjectSortKey>('newest');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const allProjects = ghProjects;
  const toolOptions = useMemo(
    () => [...new Set(allProjects.flatMap(p => p.tools))].sort((a, b) => a.localeCompare(b)),
    [allProjects]
  );
  const visible = useMemo(() => {
    const list = activeTool ? allProjects.filter(p => p.tools.includes(activeTool)) : allProjects;
    return sortProjects(list, sort);
  }, [allProjects, activeTool, sort]);
  const projects = maxProjects ? visible.slice(0, maxProjects) : visible;

  return (
    <section ref={sectionRef} id="portfolio" className="py-20 md:py-28 bg-secondary/40 overflow-hidden">
      <div className="container">
        <motion.h2 style={{ y: headingY, opacity: headingOpacity }} className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          {t('portfolio.title')}
        </motion.h2>
        <motion.div style={{ opacity: headingOpacity, scaleX: useTransform(scrollYProgress, [0, 0.2], [0, 1]) }} className="w-12 h-0.5 bg-accent mx-auto mb-12 origin-center" />

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={28} className="animate-spin text-accent" />
            <p className="font-body text-sm text-muted-foreground">{t('portfolio.loading')}</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="font-body text-muted-foreground">{t('portfolio.error')}</p>
            <button onClick={() => refetch()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] transition-all duration-200">
              <RefreshCw size={14} /> {t('portfolio.retry')}
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="font-body text-center text-muted-foreground py-16">{t('portfolio.empty')}</p>
        )}

        {!loading && projects.length > 0 && (
          <>
            {showToolbar ? (
              <ProjectsToolbar
                view={view}
                onViewChange={setView}
                sort={sort}
                onSortChange={setSort}
                tools={toolOptions}
                activeTool={activeTool}
                onToolChange={setActiveTool}
              />
            ) : (
              <PortfolioViewToggle
                value={view === 'list' ? 'single' : view}
                onValueChange={(next) => setView(next)}
              />
            )}
            {view === 'list' ? (
              <div className="flex flex-col gap-4">
                {projects.map((project) => (
                  <ProjectListItem key={project.name} project={project} onOpen={() => setSelectedProject(project)} />
                ))}
              </div>
            ) : (
              <div className={`grid gap-6 items-stretch ${view === 'single' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {projects.map((project) => (
                  <ProjectCard key={project.name} project={project} onOpen={() => setSelectedProject(project)} />
                ))}
              </div>
            )}
            {showViewAll && allProjects.length > (maxProjects || 0) && (
              <div className="text-center pt-10">
                <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] transition-all duration-200">
                  {t('portfolio.viewAll')} <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
}
