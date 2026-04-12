import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/hooks/useGitHubBlog';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex gap-4 p-4 rounded-lg bg-card hover:elevation-2 transition-all duration-200 border border-border/50"
    >
      {post.coverUrl && (
        <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded overflow-hidden bg-muted">
          <img src={post.coverUrl} alt={post.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-base font-semibold text-card-foreground group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
        {post.date && (
          <span className="flex items-center gap-1 font-body text-xs text-muted-foreground mt-1">
            <Calendar size={12} />
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        )}
        <p className="font-body text-xs text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
        <span className="inline-flex items-center gap-1 font-body text-xs font-medium text-accent mt-2 group-hover:gap-2 transition-all">
          {t('blog.readMore')} <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
