import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useGitHubBlog } from '@/hooks/useGitHubBlog';
import { fallbackBlogPosts } from '@/data/fallbackBlogPosts';
import { BlogCard } from '@/components/blog/BlogCard';

const GITHUB_OWNER = 'swalihblack';
const GITHUB_REPO = 'swab-portfolio';

export default function BlogPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3, 1], [60, 0, -20]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);

  const { posts, loading, error } = useGitHubBlog({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
  });
  const allPosts = posts.length > 0 ? posts : fallbackBlogPosts;
  const latestPosts = allPosts.slice(0, 5);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container max-w-3xl">
        <motion.h2
          style={{ y: headingY, opacity: headingOpacity }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
        >
          Blog
        </motion.h2>
        <motion.div
          style={{
            opacity: headingOpacity,
            scaleX: useTransform(scrollYProgress, [0, 0.2], [0, 1]),
          }}
          className="w-12 h-0.5 bg-accent mx-auto mb-12 origin-center"
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 size={28} className="animate-spin text-accent" />
            <p className="font-body text-sm text-muted-foreground">Loading posts...</p>
          </div>
        )}

        {!loading && (error || latestPosts.length === 0) && (
          <p className="font-body text-center text-muted-foreground py-12">
            Blog posts coming soon. Stay tuned!
          </p>
        )}

        {!loading && latestPosts.length > 0 && (
          <div className="space-y-3">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}

            {posts.length > 5 && (
              <div className="text-center pt-6">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] transition-all duration-200"
                >
                  View All Posts
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
