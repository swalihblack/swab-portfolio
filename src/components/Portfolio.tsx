import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGitHubPortfolio, type Project } from '@/hooks/useGitHubPortfolio';
import { ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ProjectModal } from '@/components/portfolio/ProjectModal';
import { PortfolioViewToggle } from '@/components/portfolio/PortfolioViewToggle';

const GITHUB_OWNER = 'swalihblack';
const GITHUB_REPO = 'swab-portfolio';

interface PortfolioProps {
  maxProjects?: number;
  showViewAll?: boolean;
}

export default function Portfolio({ maxProjects, showViewAll }: PortfolioProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3, 1], [60, 0, -20]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);

  const { projects: ghProjects, loading, error, refetch } = useGitHubPortfolio({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
  });
  const [gridMode, setGridMode] = useState<'single' | 'double'>('double');

  const allProjects = ghProjects;
  const projects = maxProjects ? allProjects.slice(0, maxProjects) : allProjects;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section ref={sectionRef} id="portfolio" className="py-20 md:py-28 bg-secondary/40 overflow-hidden">
      <div className="container">
        <motion.h2
          style={{ y: headingY, opacity: headingOpacity }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
        >
          Portfolio
        </motion.h2>
        <motion.div
          style={{
            opacity: headingOpacity,
            scaleX: useTransform(scrollYProgress, [0, 0.2], [0, 1]),
          }}
          className="w-12 h-0.5 bg-accent mx-auto mb-12 origin-center"
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={28} className="animate-spin text-accent" />
            <p className="font-body text-sm text-muted-foreground">Loading projects...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="font-body text-muted-foreground">Couldn't load projects. Please try again later.</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] transition-all duration-200"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="font-body text-center text-muted-foreground py-16">No projects found yet. Stay tuned!</p>
        )}

        {!loading && projects.length > 0 && (
          <>
            <PortfolioViewToggle value={gridMode} onValueChange={setGridMode} />
            <div className={`grid gap-6 items-stretch ${gridMode === 'single' ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {projects.map((project) => (
                <ProjectCard key={project.name} project={project} onOpen={() => setSelectedProject(project)} />
              ))}
            </div>

            {showViewAll && allProjects.length > (maxProjects || 0) && (
              <div className="text-center pt-10">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] transition-all duration-200"
                >
                  View All Projects
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
