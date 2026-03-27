import { useState, useEffect, useCallback } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  coverUrl: string;
  content: string;
  images: string[];
  folderUrl: string;
}

interface UseGitHubBlogOptions {
  owner: string;
  repo: string;
  path?: string;
  branch?: string;
}

function parseFrontmatter(raw: string): { meta: Record<string, any>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const metaBlock = match[1];
  const content = match[2];
  const meta: Record<string, any> = {};

  for (const line of metaBlock.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle arrays like [tag1, tag2]
    if (value.startsWith('[') && value.endsWith(']')) {
      meta[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''));
    } else {
      meta[key] = value.replace(/^["']|["']$/g, '');
    }
  }

  return { meta, content };
}

export function useGitHubBlog({ owner, repo, path = 'blogs', branch = 'main' }: UseGitHubBlogOptions) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dirRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        { headers }
      );

      if (!dirRes.ok) throw new Error(`GitHub API returned ${dirRes.status}`);

      const dirContents = await dirRes.json();
      const folders = dirContents.filter((item: { type: string }) => item.type === 'dir');

      const postPromises = folders.map(
        async (folder: { name: string; path: string; html_url: string }) => {
          try {
            const folderRes = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/contents/${folder.path}`,
              { headers }
            );
            if (!folderRes.ok) return null;
            const folderContents = await folderRes.json();

            const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;

            // Find content.md
            const contentFile = folderContents.find(
              (f: { name: string }) => f.name === 'content.md'
            );

            let title = folder.name;
            let date = '';
            let excerpt = '';
            let tags: string[] = [];
            let content = '';

            if (contentFile) {
              const contentRes = await fetch(contentFile.download_url);
              if (contentRes.ok) {
                const rawContent = await contentRes.text();
                const { meta, content: body } = parseFrontmatter(rawContent);
                title = meta.title || folder.name;
                date = meta.date || '';
                excerpt = meta.excerpt || body.slice(0, 160).replace(/[#*_\n]/g, '').trim() + '...';
                tags = meta.tags || [];
                content = body;
              }
            }

            const imageExtensions = /\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff|tif|avif|ico)$/i;

            const coverFile = folderContents.find(
              (f: { name: string }) =>
                f.name.toLowerCase().startsWith('cover') && imageExtensions.test(f.name)
            );
            const coverUrl = coverFile
              ? `${rawBase}/${folder.path}/${coverFile.name}`
              : '';

            const images = folderContents
              .filter(
                (f: { name: string; type: string }) =>
                  f.type === 'file' &&
                  imageExtensions.test(f.name) &&
                  !f.name.toLowerCase().startsWith('cover')
              )
              .map((f: { name: string }) => `${rawBase}/${folder.path}/${f.name}`);

            return {
              slug: folder.name,
              title,
              date,
              excerpt,
              tags,
              coverUrl,
              content,
              images,
              folderUrl: folder.html_url,
            } as BlogPost;
          } catch {
            return null;
          }
        }
      );

      const results = await Promise.all(postPromises);
      const validPosts = (results.filter(Boolean) as BlogPost[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setPosts(validPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, [owner, repo, path, branch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}
