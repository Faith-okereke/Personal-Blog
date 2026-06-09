import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, ShieldAlert, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    // Check search params for informational codes redirecting from standard gates
    const code = searchParams.get("error");
    if (code === "session_expired") {
      setInfo("Your administrator authentication token is expired. Please re-authenticate.");
    } else if (code === "login_required") {
      setInfo("Please pass authentication checks to log under admin CMS terminal dashboards.");
    }

    // If token already exists, redirect directly
    if (localStorage.getItem("token")) {
      navigate("/admin/posts");
    }
  }, [searchParams, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username and Password credentials are mandatory properties.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setInfo(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login validation failed.");
      }

      // Valid token received, save under key "token"
      localStorage.setItem("token", data.token);
      navigate("/admin/posts");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Contact server administrator.");
    } finally {
      setLoading(false);
    }
  };

  // One-click bypass for instant sandbox testing
  const handleAutoBypass = () => {
    localStorage.setItem("token", "developer_cms_super_secret_token");
    navigate("/admin/posts");
  };

  return (
    <div id="admin-login-page" className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4 sm:px-6 py-12 transition-colors">
      
      {/* Dynamic ambient graphic backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm space-y-8 relative z-10 animate-fade-in">
        
        {/* Banner header logo */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-primary shadow-md shadow-primary/10">
            <KeyRound className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              CMS Entry Code
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 font-mono">
              Authenticate Bearer token key for NneBlog
            </p>
          </div>
        </div>

        {/* Informational Alerts */}
        {info && (
          <div className="p-3.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary font-mono flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
            <span>{info}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-xs text-red-650 dark:text-red-450 font-mono flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md dark:shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-zinc-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                ID Account Name
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-primary font-mono transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-zinc-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                CMS Access Code
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-primary font-mono transition-all"
              />
            </div>

            {/* Standard Login Trigger */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center space-x-2 bg-primary hover:opacity-95 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 font-sans shadow-md shadow-primary/10"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span>Validate Account &rarr;</span>
              )}
            </button>
          </form>

          {/* Quick Sandbox Bypass */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center space-y-3">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              Demo Sandbox Testing option
            </span>
            <button
              onClick={handleAutoBypass}
              className="w-full flex items-center justify-center space-x-1.5 bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20 border border-primary/20 dark:border-primary/20 text-primary text-xs font-mono py-2 rounded-xl transition-all cursor-pointer font-bold"
            >
              <KeyRound className="w-3.5 h-3.5 text-primary" />
              <span>Developer Auto-Bypass</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Little help text footer */}
        <p className="text-[10px] font-mono text-center text-zinc-400 dark:text-zinc-700 select-none">
          Demo Credentials: <span className="text-zinc-600 dark:text-zinc-500">admin / password123</span>
        </p>
      </div>
    </div>
  );
}
