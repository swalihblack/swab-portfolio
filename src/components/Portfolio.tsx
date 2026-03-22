import { useGitHubPortfolio, type Project } from '@/hooks/useGitHubPortfolio';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ExternalLink, Loader2 } from 'lucide-react';

/**
 * CONFIGURATION
 * Replace these with your actual GitHub username and repository name.
 * The repo should have a /projects folder with subfolders for each project.
 *
 * To avoid rate limits, you can pass a GitHub PAT:
 *   token: 'ghp_xxxxxxxxxxxx'
 *
 * See useGitHubPortfolio hook for full documentation.
 */
const GITHUB_OWNER = 'swalih-ab';
const GITHUB_REPO = 'portfolio';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div
      className="bg-card rounded elevation-1 hover:elevation-3 transition-shadow duration-300 overflow-hidden group"
      style={{ animationDelay: `${index * 100}ms` }}
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
        <h3 className="font-display text-lg font-semibold text-card-foreground mb-1.5">
          {project.title}
        </h3>

        {project.description && (
          <p
            className="font-body text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2"
            style={{ textWrap: 'pretty' } as React.CSSProperties}
          >
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

        <a
          href={project.folderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-accent hover:text-accent/80 active:scale-[0.97] transition-all duration-150"
        >
          View Details
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const { ref, isVisible } = useScrollReveal();
  const { projects, loading, error } = useGitHubPortfolio({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
  });

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-secondary/40">
      <div ref={ref} className="container">
        <h2
          className={`font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4 ${
            isVisible ? 'animate-fade-up' : 'opacity-0'
          }`}
        >
          Portfolio
        </h2>

        <div className={`w-12 h-0.5 bg-accent mx-auto mb-12 ${isVisible ? 'animate-fade-up [animation-delay:100ms]' : 'opacity-0'}`} />

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={28} className="animate-spin text-accent" />
            <p className="font-body text-sm text-muted-foreground">Loading projects...</p>
          </div>
        )}

        {error && !loading && (
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

        {!loading && !error && projects.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
              isVisible ? 'animate-fade-up [animation-delay:200ms]' : 'opacity-0'
            }`}
          >
            {projects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
