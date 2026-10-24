import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Project } from '@/hooks/useGitHubPortfolio';

export function ProjectListItem({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="group flex w-full items-center gap-4 rounded bg-card p-3 text-left elevation-1 transition-shadow duration-300 hover:elevation-3 md:gap-6"
    >
      <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-sm bg-muted md:w-44">
        <img
          src={project.coverUrl}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="font-display text-base font-semibold text-card-foreground md:text-lg">
            {project.title}
          </h3>
          {project.year && (
            <span className="font-body text-xs text-muted-foreground">{project.year}</span>
          )}
        </div>
        {project.subtitle && <p className="font-body text-sm text-accent">{project.subtitle}</p>}
        {project.tools.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {project.tools.map(tool => (
              <span key={tool} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight size={18} className="hidden shrink-0 text-muted-foreground transition-colors group-hover:text-accent md:block" />
    </motion.button>
  );
}
