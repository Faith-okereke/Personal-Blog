import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Feather, AppWindow, ShieldAlert, LogOut, LayoutDashboard, Rss, Layers, Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Theme management: default to light mode
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Synchronize auth state on component render and state change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Watch for login/logout events or local storage changes (if any)
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/blog");
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
      ? "text-primary dark:text-primary-light font-bold"
      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 sm:px-8 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/blog" className="flex items-center space-x-2.5 group">
          <div className="p-1.5 bg-primary border border-primary dark:border-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-primary/20 group-hover:opacity-90 transition-all">
            <Feather className="w-5 h-5 text-white" />
          </div>
          <span className="font-sans text-sm tracking-tight text-zinc-900 dark:text-white font-bold">
            NneBlog
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/blog" className={`flex items-center space-x-2 text-sm ${isActive("/blog")}`}>
            <Rss className="w-4 h-4" />
            <span>Public Blog</span>
          </Link>
          
          <Link to="/admin/posts" className={`flex items-center space-x-2 text-sm ${isActive("/admin/posts")}`}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4 border-l border-zinc-200 dark:border-zinc-800 pl-6">
              <span className="flex items-center space-x-1.5 text-xs text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full font-mono font-semibold">
                <span>admin mode</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-transparent hover:border-red-300 dark:hover:border-red-900/30 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="flex items-center space-x-1.5 text-xs text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all font-medium"
            >
              <AppWindow className="w-3.5 h-3.5 text-zinc-500" />
              <span>Admin Login</span>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Mobile Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
          >
            {theme === "light" ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Full Screen Overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 opacity-100 flex flex-col p-6 md:hidden transition-colors select-none">
          {/* Header section of fullscreen overlay */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2.5 group">
              <div className="p-1.5 bg-primary border border-primary dark:border-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
                <Feather className="w-5 h-5 text-white" />
              </div>
              <span className="font-sans text-sm tracking-tight text-zinc-900 dark:text-white font-bold">
                NneBlog
              </span>
            </Link>

            <div className="flex items-center space-x-3">
              {/* Mobile overlay Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Links Area with elegant layout and typography */}
          <div className="flex-1 flex flex-col justify-center space-y-6 max-w-sm mx-auto w-full px-4">
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-3.5 p-4 rounded-xl text-lg font-bold transition-all border border-transparent ${
                location.pathname.startsWith("/blog")
                  ? "bg-primary/5 text-primary border-primary/10 dark:bg-primary/10 dark:text-primary-light"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <Rss className="w-5 h-5 text-primary" />
              <span>Public Blog</span>
            </Link>
            
            <Link
              to="/admin/posts"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-3.5 p-4 rounded-xl text-lg font-bold transition-all border border-transparent ${
                location.pathname.startsWith("/admin/posts")
                  ? "bg-primary/5 text-primary border-primary/10 dark:bg-primary/10 dark:text-primary-light"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <span>Admin Dashboard</span>
            </Link>

            {isAuthenticated ? (
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col space-y-4">
                <span className="self-center flex items-center space-x-2 text-xs text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full font-mono font-bold">
                  <span>Admin session active</span>
                </span>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 p-3.5 text-base font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-xl w-full border border-red-200/50 dark:border-red-900/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Admin Session</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 p-4 text-base font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all"
              >
                <ShieldAlert className="w-5 h-5 text-zinc-500" />
                <span>Admin Site Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
