import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useGitHubBlog } from '@/hooks/useGitHubBlog';
import { fallbackBlogPosts } from '@/data/fallbackBlogPosts';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogPostView } from '@/components/blog/BlogPostView';
import { Loader2 } from 'lucide-react';

const GITHUB_OWNER = 'swalihblack';
const GITHUB_REPO = 'swab-portfolio';

export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const { posts, loading, error } = useGitHubBlog({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
  });

  const allPosts = posts.length > 0 ? posts : fallbackBlogPosts;
  const selectedPost = slug ? allPosts.find((p) => p.slug === slug) : null;

  return (
    <div className="min-h-screen pt-14">
      <Header />
      <div className="py-20 md:py-28">
        <div className="container max-w-3xl">
          {!slug && (
            <>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4">Blog</h1>
              <div className="w-12 h-0.5 bg-accent mx-auto mb-12" />

              {loading && (
                <div className="flex flex-col items-center py-16 gap-3">
                  <Loader2 size={28} className="animate-spin text-accent" />
                  <p className="font-body text-sm text-muted-foreground">Loading posts...</p>
                </div>
              )}

              {!loading && allPosts.length === 0 && (
                <p className="font-body text-center text-muted-foreground py-16">
                  Blog posts coming soon. Stay tuned!
                </p>
              )}

              {!loading && posts.length > 0 && (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}

          {slug && loading && (
            <div className="flex flex-col items-center py-16 gap-3">
              <Loader2 size={28} className="animate-spin text-accent" />
            </div>
          )}

          {slug && !loading && !selectedPost && (
            <p className="font-body text-center text-muted-foreground py-16">Post not found.</p>
          )}

          {selectedPost && <BlogPostView post={selectedPost} />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
