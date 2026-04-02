import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import type { BlogPost } from '@/hooks/useGitHubBlog';

interface BlogPostViewProps {
  post: BlogPost;
}

export function BlogPostView({ post }: BlogPostViewProps) {
  return (
    <article>
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 font-body text-sm text-accent hover:text-accent/80 mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      {post.coverUrl && (
        <div className="rounded-lg overflow-hidden mb-8 bg-muted">
          <img
            src={post.coverUrl}
            alt={post.title}
            className="w-full h-auto max-h-96 object-cover"
          />
        </div>
      )}

      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        {post.date && (
          <span className="flex items-center gap-1.5 font-body text-sm text-muted-foreground">
            <Calendar size={14} />
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        )}
        <span className="flex items-center gap-1.5 font-body text-sm text-muted-foreground">
          <User size={14} />
          Swalih Abdullah
        </span>
      </div>

      <div className="prose-blog">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {post.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-10 pt-6 border-t border-border">
          <Tag size={14} className="text-muted-foreground" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-secondary px-2 py-0.5 font-body text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
