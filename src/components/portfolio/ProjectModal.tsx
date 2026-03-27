import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, ExternalLink, User, X } from 'lucide-react';
import type { Project } from '@/hooks/useGitHubPortfolio';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const allImages = [project.coverUrl, ...project.photos];
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-card elevation-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] bg-muted">
          <img
            src={allImages[currentImage]}
            alt={`${project.title} — image ${currentImage + 1}`}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />

          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((p) => (p === 0 ? allImages.length - 1 : p - 1))}
                className="absolute left-2 top-1/2 rounded-full bg-foreground/60 p-1.5 text-background transition-all hover:bg-foreground/80 active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentImage((p) => (p === allImages.length - 1 ? 0 : p + 1))}
                className="absolute right-2 top-1/2 rounded-full bg-foreground/60 p-1.5 text-background transition-all hover:bg-foreground/80 active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentImage ? 'bg-background' : 'bg-background/40'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-foreground/60 p-1.5 text-background transition-all hover:bg-foreground/80 active:scale-95"
            aria-label="Close project details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="mb-1 font-display text-2xl font-bold text-card-foreground">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="mb-3 font-body text-sm font-medium text-accent">{project.subtitle}</p>
          )}

          {(project.year || project.client) && (
            <div className="mb-4 flex flex-wrap items-center gap-4">
              {project.year && (
                <span className="flex items-center gap-1.5 font-body text-sm text-muted-foreground">
                  <Calendar size={14} />
                  {project.year}
                </span>
              )}
              {project.client && (
                <span className="flex items-center gap-1.5 font-body text-sm text-muted-foreground">
                  <User size={14} />
                  {project.client}
                </span>
              )}
            </div>
          )}

          {project.description && (
            <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          )}

          {project.tools.length > 0 && (
            <div className="mb-4">
              <p className="font-body text-xs font-medium text-foreground mb-2 uppercase tracking-wide">Services</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-sm bg-secondary px-2.5 py-1 font-body text-xs text-secondary-foreground"
                  >
                    {tool}
                  </span>
                ))}
              </div>
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
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-accent transition-all duration-150 hover:text-accent/80 active:scale-[0.97]"
                >
                  {link.label}
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
