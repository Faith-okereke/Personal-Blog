import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { Post } from "../../components/PostCard";
import { ArrowLeft, Calendar, Clock, FolderKanban, Code2 } from "lucide-react";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login?error=login_required");
      return;
    }

    async function fetchPost() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/blog/${id}`);
        const data = response?.data ? response.data : response;
        setPost(data);
      } catch (err: any) {
        setError(err.message || "Failed to retrieve this article.");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300 flex flex-col items-center justify-center p-8 transition-colors">
        <div className="w-12 h-12 rounded-full border-2 border-zinc-200 dark:border-zinc-800 border-t-primary animate-spin mb-4"></div>
        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">Unpacking compiled markdown content...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 flex flex-col items-center justify-center p-6 text-center space-y-6 transition-colors">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl max-w-sm space-y-4 shadow-sm">
          <Code2 className="w-8 h-8 text-primary mx-auto" />
          <div>
            <h2 className="text-zinc-900 dark:text-white font-medium">Post Not Found</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{error || "The post you are trying to read does not exist."}</p>
          </div>
        </div>
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-xs font-mono text-primary hover:text-primary-hover font-bold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Index</span>
        </Link>
      </div>
    );
  }

  return (
    <div id={`blog-post-${post.id}`} className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 pb-24 font-sans transition-colors">
      {/* Decorative banner */}
      <div className="h-1 bg-gradient-to-r from-primary via-zinc-200 dark:via-zinc-800 to-primary"></div>
 
      <div className="max-w-3xl mx-auto px-6 mt-8 sm:mt-12 space-y-6 sm:space-y-8">
        {/* Back Link */}
        <div>
          <button
            onClick={() => navigate("/blog")}
            className="group inline-flex items-center space-x-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>back to stories</span>
          </button>
        </div>
 
        {/* Article Header Meta */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {post.author && (
              <span className="flex items-center space-x-1 font-semibold text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>{post.author.fullName || post.author.email}</span>
              </span>
            )}
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span>{post.dateCreated ? new Date(post.dateCreated).toLocaleDateString() : (post.datePublished || "Unpublished Draft")}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span>{post.readTime || "1 min read"}</span>
            </span>
            {post.status === "Draft" && (
              <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full font-mono uppercase tracking-wider font-semibold">
                Draft Mode
              </span>
            )}
          </div>
 
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            {post.title}
          </h1>
        </div>
 
        {/* Cover Graphic / Image */}
        {post.coverImage ? (
          <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/80 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800/60 flex flex-col items-center justify-center p-6 select-none">
            <Code2 className="w-10 h-10 text-primary/30 dark:text-primary/20 mb-1" />
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">&lt;developer-capsule /&gt;</span>
          </div>
        )}
 
        {/* Full Prose body content */}
        <div className="py-2">
          <article 
            className="prose dark:prose-invert prose-zinc max-w-none focus:outline-none 
              prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900 dark:prose-headings:text-white
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-zinc-200 dark:prose-h2:border-zinc-800 prose-h2:pb-2
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:text-base prose-p:mb-5
              prose-a:text-primary prose-a:font-bold prose-a:underline hover:prose-a:opacity-80
              prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:mb-5
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-ol:mb-5
              prose-li:text-zinc-700 dark:prose-li:text-zinc-300
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-zinc-100 dark:prose-blockquote:bg-zinc-900/40 prose-blockquote:pl-5 prose-blockquote:py-1 prose-blockquote:italic prose-blockquote:text-zinc-600 dark:prose-blockquote:text-zinc-400 prose-blockquote:rounded-r-lg prose-blockquote:mb-6
              prose-code:font-mono prose-code:text-xs prose-code:bg-zinc-100 dark:prose-code:bg-zinc-900 prose-code:text-primary dark:prose-code:text-primary-light prose-code:p-1 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: post.content || post.body || "" }}
          />
        </div>
 
        {/* Footer info banner */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <span>Logged under CMS post reference ID: {post.id}</span>
          <Link
            to="/blog"
            className="text-primary hover:text-primary-hover font-bold inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>Read other notes</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
