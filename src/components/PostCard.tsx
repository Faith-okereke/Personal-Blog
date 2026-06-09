import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Code2 } from "lucide-react";

export interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  coverImage?: string;
  status: string;
  datePublished: string;
  readTime: string;
}

export default function PostCard({ post }: { post: Post; key?: any }) {
  // Extract a clean 150-character excerpt by stripping raw HTML tags
  const cleanExcerpt = (html: string) => {
    const text = html.replace(/<[^>]*>/g, " "); // Replace tags with space
    const truncated = text.trim().substring(0, 150).trim();
    return truncated.length >= 150 ? truncated + "..." : truncated;
  };

  return (
    <article 
      id={`post-card-${post.id}`} 
      className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-primary/50 dark:hover:border-zinc-700 hover:shadow-md hover:shadow-primary/5 dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300"
    >
      {/* Cover Image/Fallback */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 select-none">
            <Code2 className="w-8 h-8 text-primary/30 dark:text-primary/20 mb-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
              &lt;cms-placeholder /&gt;
            </span>
          </div>
        )}
      </div>

      {/* Content wrapper */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div className="space-y-3.5">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500 font-mono">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span>{post.datePublished || "Draft"}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span>{post.readTime || "1 min read"}</span>
            </span>
          </div>

          {/* Heading */}
          <h3 className="font-sans text-lg font-bold leading-snug text-zinc-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
            <Link to={`/blog/${post.id}`} className="hover:underline focus:outline-none cursor-pointer">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
            {cleanExcerpt(post.body) || "No content summary available."}
          </p>
        </div>

        {/* Read more button link */}
        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center">
          <Link
            to={`/blog/${post.id}`}
            className="inline-flex items-center text-xs font-mono font-bold text-primary hover:text-primary-hover space-x-1 cursor-pointer"
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
