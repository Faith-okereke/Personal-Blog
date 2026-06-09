import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import RichTextEditor from "../../components/RichTextEditor";
import { generateSlug, calculateReadTime } from "../../utils/helpers";
import { 
  ArrowLeft, Save, Eye, CheckCircle2, AlertCircle, FileText, 
  Image as ImageIcon, Loader2, Send, Globe
} from "lucide-react";

export default function PostEditor() {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");

  // App UI state indicators
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authenticate user & load existing post data on EDIT mode
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login?error=login_required");
      return;
    }
  }, [navigate]);

  // Handle auto-slug updates when title is typed
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto sync slug if user hasn't explicitly edited it directly
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value;
    setSlug(newSlug);
    setIsSlugManuallyEdited(newSlug.trim().length > 0);
  };

  // Submission worker
  const handleSubmit = async (overrideStatus?: "Draft" | "Published") => {
    if (!title.trim()) {
      setError("Article title cannot be left blank.");
      return;
    }
    if (!body.trim() || body === "<p><br></p>") {
      setError("Please compose some content in the rich text body.");
      return;
    }

    const currentStatus = overrideStatus || status;

    const payload = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      coverImage: coverImage.trim(),
      body: body,      // Keep legacy for safety
      content: body,   // Map to content for backend compatibility
      status: currentStatus,
    };

    try {
      setLoading(true);
      setError(null);

      await api.post("/blog/create", payload);

      // Success, route back to dashboards
      navigate("/admin/posts");
    } catch (err: any) {
      setError(err.message || "Transmission error. Check server constraints.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="post-editor-page" className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300 pb-20 transition-colors">
      
      {/* Editor Header */}
      <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 py-6 px-4 sm:px-8 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/admin/posts"
            className="flex items-center space-x-2 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>exit editor</span>
          </Link>

          <span className="text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-md">
            mode: <span className="text-primary font-bold">"CREATE_NEW_POST"</span>
          </span>
        </div>
      </header>

      {/* Editor Main Canvas Form */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start space-x-3 text-sm text-red-650 dark:text-red-400 mb-6 font-mono shadow-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
            <div>{error}</div>
          </div>
        )}

        {/* CMS Configuration Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl transition-colors">
          
          {/* Post Title input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold">
              Article Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Demystifying CSS Container Queries"
              value={title}
              onChange={handleTitleChange}
              required
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans text-base sm:text-lg font-bold"
            />
          </div>

          {/* Core metadata rows: Slug & cover image url */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
            {/* Slug input */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold flex justify-between">
                <span>Post Slug (URL route)</span>
                {isSlugManuallyEdited && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlugManuallyEdited(false);
                      setSlug(generateSlug(title));
                    }}
                    className="text-[10px] text-primary hover:underline font-bold"
                    title="Generate slug from active title string"
                  >
                    Auto-Generate
                  </button>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-450 dark:text-zinc-600">
                  /blog/
                </span>
                <input
                  type="text"
                  placeholder="demystifying-css-queries"
                  value={slug}
                  onChange={handleSlugChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-16 pr-4 py-2.5 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-700 font-mono text-xs focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Cover Image URL input */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold">
                Cover Image URL (Optional)
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-700 font-mono text-xs focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold">
              Body Workspace *
            </label>
            <RichTextEditor value={body} onChange={setBody} />
          </div>

          {/* Status Settings */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold">
                Publication Status:
              </span>
              <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setStatus("Draft")}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    status === "Draft"
                      ? "bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-sm border border-zinc-200 dark:border-zinc-700"
                      : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("Published")}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    status === "Published"
                      ? "bg-primary/20 text-primary border border-primary/20 dark:border-primary/20"
                      : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  Published
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleSubmit("Draft")}
                disabled={loading}
                className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-700 dark:text-zinc-300 rounded-xl transition-all cursor-pointer disabled:opacity-50 font-bold"
              >
                <Save className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                <span>Save Draft</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleSubmit("Published")}
                disabled={loading}
                className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-primary hover:opacity-95 text-white font-bold text-xs font-sans rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-primary/10"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Globe className="w-3.5 h-3.5" />
                )}
                <span>Publish Post</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
