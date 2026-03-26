import { useState, useEffect, useCallback } from 'react';

/**
 * GitHub Portfolio Hook
 * 
 * EXPECTED REPO STRUCTURE:
 * /projects
 *   /ProjectName
 *     cover.jpg      — Project cover image
 *     details.json   — Project metadata JSON:
 *       {
 *         "title": "Project Title",
 *         "subtitle": "Short tagline",
 *         "description": "Full description",
 *         "year": "2024",
 *         "client": "Client Name",
 *         "tools": ["Photoshop", "Illustrator"],
 *         "links": [{ "label": "Behance", "url": "https://..." }]
 *       }
 *     photo1.jpg     — Additional project photos (optional)
 */

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  client: string;
  tools: string[];
  links: ProjectLink[];
  coverUrl: string;
  photos: string[];
  folderUrl: string;
}

interface UseGitHubPortfolioOptions {
  owner: string;
  repo: string;
  path?: string;
  branch?: string;
  token?: string;
}

export function useGitHubPortfolio({
  owner,
  repo,
  path = 'projects',
  branch = 'main',
  token,
}: UseGitHubPortfolioOptions) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dirRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        { headers }
      );

      if (!dirRes.ok) {
        throw new Error(`GitHub API returned ${dirRes.status}`);
      }

      const dirContents = await dirRes.json();
      const folders = dirContents.filter(
        (item: { type: string }) => item.type === 'dir'
      );

      const projectPromises = folders.map(
        async (folder: { name: string; path: string; html_url: string }) => {
          try {
            const folderRes = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/contents/${folder.path}`,
              { headers }
            );

            if (!folderRes.ok) return null;
            const folderContents = await folderRes.json();

            let title = folder.name;
            let subtitle = '';
            let description = '';
            let year = '';
            let client = '';
            let tools: string[] = [];
            let links: ProjectLink[] = [];

            const detailsFile = folderContents.find(
              (f: { name: string }) => f.name === 'details.json'
            );

            if (detailsFile) {
              const detailsRes = await fetch(detailsFile.download_url);
              if (detailsRes.ok) {
                const data = await detailsRes.json();
                title = data.title || folder.name;
                subtitle = data.subtitle || '';
                description = data.description || '';
                year = data.year || '';
                client = data.client || '';
                tools = data.tools || [];
                links = data.links || [];
              }
            }

            const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;
            const coverFile = folderContents.find(
              (f: { name: string }) =>
                f.name.toLowerCase().startsWith('cover') &&
                /\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff|tif|avif|ico)$/i.test(f.name)
            );
            const coverUrl = coverFile
              ? `${rawBase}/${folder.path}/${coverFile.name}`
              : '/placeholder.svg';

            const imageExtensions = /\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff|tif|avif|ico)$/i;
            const photos = folderContents
              .filter(
                (f: { name: string; type: string }) =>
                  f.type === 'file' &&
                  imageExtensions.test(f.name) &&
                  !f.name.toLowerCase().startsWith('cover')
              )
              .map(
                (f: { name: string }) =>
                  `${rawBase}/${folder.path}/${f.name}`
              );

            return {
              name: folder.name,
              title,
              subtitle,
              description,
              year,
              client,
              tools,
              links,
              coverUrl,
              photos,
              folderUrl: folder.html_url,
            } as Project;
          } catch {
            return null;
          }
        }
      );

      const results = await Promise.all(projectPromises);
      setProjects(results.filter(Boolean) as Project[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load projects'
      );
    } finally {
      setLoading(false);
    }
  }, [owner, repo, path, branch, token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}
