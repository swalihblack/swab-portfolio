import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useGitHubPortfolio, type Project } from '@/hooks/useGitHubPortfolio';
import { fallbackProjects } from '@/data/fallbackProjects';
import { ExternalLink, Loader2, X, ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';

const GITHUB_OWNER = 'swalihblack';
const GITHUB_REPO = 'swab-portfolio';

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.98]);

  return (
    <motion.button
      ref={cardRef}
      style={{ y, opacity, scale }}
      onClick={onOpen}
      className="bg-card rounded text-left elevation-1 hover:elevation-3 transition-shadow duration-300 overflow-hidden group w-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={project.coverUrl}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-card-foreground mb-0.5">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="font-body text-sm text-accent font-medium mb-2">{project.subtitle}</p>
        )}
        <div className="flex items-center gap-3 mb-2">
          {project.year && (
            <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
              <Calendar size={12} />
              {project.year}
            </span>
          )}
          {project.client && (
            <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
              <User size={12} />
              {project.client}
            </span>
          )}
        </div>
        {project.tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="font-body text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const allImages = [project.coverUrl, ...project.photos];
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto elevation-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] bg-muted">
          <img
            src={allImages[currentImage]}
            alt={`${project.title} — image ${currentImage + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((p) => (p === 0 ? allImages.length - 1 : p - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 active:scale-95 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentImage((p) => (p === allImages.length - 1 ? 0 : p + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 active:scale-95 transition-all"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentImage ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 active:scale-95 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          <h3 className="font-display text-2xl font-bold text-card-foreground mb-1">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="font-body text-sm text-accent font-medium mb-3">{project.subtitle}</p>
          )}

          {/* Year & Client */}
          {(project.year || project.client) && (
            <div className="flex items-center gap-4 mb-4">
              {project.year && (
                <span className="font-body text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar size={14} />
                  {project.year}
                </span>
              )}
              {project.client && (
                <span className="font-body text-sm text-muted-foreground flex items-center gap-1.5">
                  <User size={14} />
                  {project.client}
                </span>
              )}
            </div>
          )}

          {project.description && (
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              {project.description}
            </p>
          )}
          {project.tools.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="font-body text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-accent hover:text-accent/80 active:scale-[0.97] transition-all duration-150"
                >
                  {link.label}
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3, 1], [60, 0, -20]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);

  const { projects: ghProjects, loading, error } = useGitHubPortfolio({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
  });

  const projects = (ghProjects.length > 0 ? ghProjects : error ? fallbackProjects : ghProjects).map((project) => {
    const fallback = fallbackProjects.find((item) => item.name === project.name);

    return {
      ...fallback,
      ...project,
      year: project.year || fallback?.year || '',
      client: project.client || fallback?.client || '',
      description: project.description || fallback?.description || '',
      subtitle: project.subtitle || fallback?.subtitle || '',
      tools: project.tools.length > 0 ? project.tools : fallback?.tools || [],
      links: project.links.length > 0 ? project.links : fallback?.links || [],
      photos: project.photos.length > 0 ? project.photos : fallback?.photos || [],
    } as Project;
  });
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

        {error && !loading && projects.length === 0 && (
          <div className="text-center py-16">
            <p className="font-body text-muted-foreground mb-2">
              Projects are currently unavailable.
            </p>
            <p className="font-body text-xs text-muted-foreground/60">
              Check back soon or visit the{' '}
              <a
                href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                GitHub repository
              </a>{' '}
              directly.
            </p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="font-body text-center text-muted-foreground py-16">
            No projects found yet. Stay tuned!
          </p>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.name}
                project={project}
                index={i}
                onOpen={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
