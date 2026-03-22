import { useState, useEffect, useCallback } from 'react';

/**
 * GitHub Portfolio Hook
 * 
 * Fetches project data from a GitHub repository's /projects directory.
 * 
 * EXPECTED REPO STRUCTURE:
 * /projects
 *   /Project1
 *     cover.jpg    — Project cover image
 *     details.txt  — Project metadata (line 1: Title, line 2: Description, line 3: Tools comma-separated)
 *   /Project2
 *     cover.jpg
 *     details.txt
 * 
 * RATE LIMITING:
 * GitHub API allows 60 requests/hour for unauthenticated requests.
 * To increase this to 5,000/hour, add a Personal Access Token (PAT):
 * 1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
 * 2. Create a token with "Contents" read access for your repo
 * 3. Pass it as the `token` parameter to useGitHubPortfolio
 */

export interface Project {
  name: string;
  title: string;
  description: string;
  tools: string[];
  coverUrl: string;
  folderUrl: string;
}

interface UseGitHubPortfolioOptions {
  owner: string;
  repo: string;
  path?: string;
  token?: string; // Optional GitHub PAT for higher rate limits
}

export function useGitHubPortfolio({
  owner,
  repo,
  path = 'projects',
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
      // Step 1: Fetch the /projects directory listing
      const dirRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        { headers }
      );

      if (!dirRes.ok) {
        throw new Error(`GitHub API returned ${dirRes.status}`);
      }

      const dirContents = await dirRes.json();

      // Filter only directories (type === 'dir')
      const folders = dirContents.filter(
        (item: { type: string }) => item.type === 'dir'
      );

      // Step 2: For each project folder, fetch details.txt and determine cover image URL
      const projectPromises = folders.map(
        async (folder: { name: string; path: string; html_url: string }) => {
          try {
            // Fetch details.txt content
            const detailsRes = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/contents/${folder.path}/details.txt`,
              { headers }
            );

            let title = folder.name;
            let description = '';
            let tools: string[] = [];

            if (detailsRes.ok) {
              const detailsData = await detailsRes.json();
              // Content is base64 encoded
              const content = atob(detailsData.content.replace(/\n/g, ''));
              const lines = content.split('\n').map((l: string) => l.trim());
              title = lines[0] || folder.name;
              description = lines[1] || '';
              tools = lines[2]
                ? lines[2].split(',').map((t: string) => t.trim())
                : [];
            }

            // Cover image — use raw GitHub URL
            const coverUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${folder.path}/cover.jpg`;

            return {
              name: folder.name,
              title,
              description,
              tools,
              coverUrl,
              folderUrl: folder.html_url,
            } as Project;
          } catch {
            // If a single project fails, skip it gracefully
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
  }, [owner, repo, path, token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}
