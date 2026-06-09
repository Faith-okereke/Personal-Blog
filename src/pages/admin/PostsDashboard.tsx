import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { 
  Plus, Trash2, Eye, LayoutDashboard, Calendar, 
  Clock, PlusCircle, Loader2, AlertCircle
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  coverImage?: string;
  status: string;
  datePublished: string;
  dateCreated: string;
  readTime: string;
}

export default function PostsDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authenticate user before rendering dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login?error=login_required");
      return;
    }

    async function fetchAllPosts() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/blog/all");
        const data = Array.isArray(response) ? response : (response?.data || []);
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard posts. Please retry.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllPosts();
  }, [navigate]);

  // Handler for post deletion
  const handleDeletePost = async (id: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete this post?\n\n"${title}"\n\nThis action is irreversible.`);
    if (!confirmed) return;

    try {
      await api.delete(`/blog/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Could not delete this story.");
    }
  };

  const totalPosts = posts.length;
  const drafts = posts.filter(p => p.status !== "Published").length;
  const published = posts.filter(p => p.status === "Published").length;
  const mockReads = totalPosts > 0 ? `${(totalPosts * 1.2 + 0.4).toFixed(1)}K` : "0";

  return (
    <div id="admin-dashboard-page" className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300 pb-20 transition-colors">
      
      {/* Dashboard Sub Header */}
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-4 sm:px-8 transition-colors">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-zinc-500">Admin</span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-zinc-800 dark:text-zinc-200">Posts Dashboard</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            to="/admin/posts/new"
            className="flex items-center gap-2 bg-primary hover:opacity-95 text-white px-4 py-2 rounded-md text-sm font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </Link>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        
        {loading ? (
          /* Loading Dashboard indicator */
          <div className="py-24 text-center space-y-3" id="dash-loading">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">Querying portfolio logs database...</p>
          </div>
        ) : error ? (
          /* Error Banner */
          <div className="max-w-md mx-auto p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mx-auto" />
            <div>
              <h3 className="text-zinc-950 dark:text-white font-medium">Dashboard Error</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer"
            >
              Reload Dashboard
            </button>
          </div>
        ) : posts.length === 0 ? (
          /* Empty Dashboard state */
          <div className="max-w-lg mx-auto py-20 text-center space-y-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 p-10 shadow-sm" id="dash-empty">
            <PlusCircle className="w-12 h-12 text-zinc-400 dark:text-zinc-700 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-zinc-900 dark:text-white font-medium">Zero posts configured</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">No draft or published essays discovered in files. Start fresh by launching your first editor template!</p>
            </div>
            <Link
              to="/admin/posts/new"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary hover:opacity-95 border border-primary/30 rounded-lg text-xs font-mono text-white font-bold cursor-pointer"
            >
              <span>Initialize first post template</span>
              <span>&rarr;</span>
            </Link>
          </div>
        ) : (
          /* Sleek Interface Content */
          <div className="space-y-8 animate-fade-in">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm transition-colors">
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1 font-mono font-bold">Total Posts</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white font-sans">{totalPosts}</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm transition-colors">
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1 font-mono font-bold">Drafts</div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-500 font-sans">{drafts}</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm transition-colors">
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1 font-mono font-bold">Published</div>
                <div className="text-2xl font-bold text-primary focus:text-primary-hover font-sans">{published}</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm transition-colors">
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1 font-mono font-bold">Simulated Reads</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white font-sans">{mockReads}</div>
              </div>
            </div>

            {/* Grid/Table layout list or tabular posts rows */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-[1rem_1.5fr_0.8fr_0.8fr_0.80fr] gap-4 px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 w-full text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold">
                <span></span>
                <span>Title & Slug</span>
                <span>Status</span>
                <span>Date Created</span>
                <span className="text-right w-full block">Actions</span>
              </div>

              {/* Table Rows list */}
              <div className="divide-y divide-zinc-150 dark:divide-zinc-800" id="dash-posts-list">
                {posts.map((post, idx) => (
                  <div
                    key={post.id}
                    id={`dash-post-row-${post.id}`}
                    className="grid grid-cols-1 sm:grid-cols-[1rem_1.5fr_0.8fr_0.8fr_0.80fr] gap-3 sm:gap-4 px-6 py-5 sm:py-4 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* index count */}
                    <span className="hidden sm:inline font-mono text-[10px] text-zinc-400 dark:text-zinc-600">{idx + 1}</span>

                    {/* Title & responsive details */}
                    <div className="space-y-1">
                      <span className="font-bold text-zinc-900 dark:text-white tracking-tight break-words text-sm sm:text-base">
                        {post.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 font-mono sm:hidden mt-2">
                        <span>Status:</span>
                        <span className={post.status === "Published" ? "text-primary" : "text-amber-600"}>
                          {post.status}
                        </span>
                        <span>&bull;</span>
                        <span>{new Date(post.dateCreated || post.datePublished || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <div className="hidden sm:block text-xs text-zinc-400 dark:text-zinc-500 font-mono font-semibold tracking-tight">
                        slug: <span className="text-zinc-600 dark:text-zinc-400">/{post.slug || post.id}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="hidden sm:block">
                      {post.status === "Published" ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                          Published
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-650 border border-amber-500/20">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Date Created */}
                    <div className="hidden sm:block font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                        <span>{new Date(post.dateCreated || post.datePublished || Date.now()).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}</span>
                      </div>
                    </div>

                    {/* Actions column */}
                    <div className="flex items-center justify-end space-x-2.5 sm:space-x-3 pt-3 sm:pt-0 border-t border-zinc-150 dark:border-zinc-800 sm:border-t-0 mt-3 sm:mt-0">
                      {/* View post button */}
                      <Link
                        to={`/blog/${post.id}`}
                        className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 rounded transition-all cursor-pointer"
                        title="View active article"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Delete post button */}
                      <button
                        onClick={() => handleDeletePost(post.id, post.title)}
                        className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-200 dark:hover:border-red-900/30 rounded transition-all cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
