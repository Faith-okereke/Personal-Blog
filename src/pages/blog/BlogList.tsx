import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostCard, { Post } from "../../components/PostCard";
import api from "../../utils/api";
import { BookOpen, Feather, Sparkles, WifiOff, FileText, Loader2 } from "lucide-react";

export default function BlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login?error=login_required");
      return;
    }

    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/blog/all");
        const data = Array.isArray(response) ? response : (response?.data || []);
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "Could not retrieve stories. Please verify server connection.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [navigate]);

  return (
    <div id="blog-list-page" className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300 pb-16 transition-colors">
      
      {/* Editorial/Hero Header */}
      <header className="relative py-20 sm:py-24 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 bg-blend-multiply">
        {/* Workspace background representation of Blogbag.jpg with smart high-quality Unsplash flatlay fallback */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.35] dark:opacity-[0.16] pointer-events-none select-none contrast-95 brightness-105"
          style={{ 
            backgroundImage: `url('/Blogbag.jpg'), url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80')` 
          }}
        />
        {/* Soft frosted blur glass layer for perfect content readability and high contrast */}
        <div className="absolute inset-0 bg-white/70 dark:bg-zinc-950/85 backdrop-blur-[2px] pointer-events-none" />
        
        {/* Precise non-glowing sleek grid pattern lines on top of background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 dark:opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-white/80 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded font-mono text-[10px] tracking-widest text-zinc-500 dark:text-zinc-400 uppercase select-none">
            <Feather className="w-3 h-3 text-primary" />
            <span>Dev Journal & Engineering Log</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Mind Share <span className="text-zinc-400 dark:text-zinc-700">&amp;&amp;</span> Compiled Logic.
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Articles on system architecture, fluid animations, Tailwind optimization, and real-time dashboard engineering.
          </p>
        </div>
      </header>

      {/* Main Blog Stories Grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 mt-12">
        {loading ? (
          /* Loading skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="blog-loading-skeleton">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 animate-pulse">
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-950 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-950 rounded w-1/3"></div>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-950 rounded w-5/6"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-900 rounded"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-900 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error Banner */
          <div className="max-w-md mx-auto p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-center space-y-4">
            <WifiOff className="w-10 h-10 text-red-500 dark:text-red-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-zinc-900 dark:text-white font-medium">Failed to connect</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{error}</p>
            </div>
            <button
               onClick={() => window.location.reload()}
              className="px-4 py-1.5 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : posts.length === 0 ? (
          /* Empty state */
          <div className="max-w-md mx-auto py-16 text-center space-y-4" id="blog-empty-state">
            <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-lg flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-800">
              <FileText className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-zinc-800 dark:text-white font-medium">No posts published yet</h3>
              <p className="text-sm text-zinc-500">Check back soon! The administrator is busy compiling some logic.</p>
            </div>
          </div>
        ) : (
          /* Card Grid output */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8" id="blog-posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
