import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Project } from '@/hooks/useGitHubPortfolio';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [56, 0, 0, -18]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0.35, 1, 1, 0.75]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.96, 1, 1, 0.98]);

  return (
    <motion.button
      ref={cardRef}
      style={{ y, opacity, scale }}
      onClick={onOpen}
      className="group w-full overflow-hidden rounded bg-card text-left elevation-1 transition-shadow duration-300 hover:elevation-3"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
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

      <div className="space-y-1 p-4">
        <h3 className="font-display text-base font-semibold text-card-foreground md:text-lg">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="font-body text-sm text-accent">{project.subtitle}</p>
        )}
      </div>
    </motion.button>
  );
}