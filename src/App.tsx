import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import BlogList from "./pages/blog/BlogList";
import BlogPost from "./pages/blog/BlogPost";
import PostsDashboard from "./pages/admin/PostsDashboard";
import PostEditor from "./pages/admin/PostEditor";
import AdminLogin from "./pages/admin/AdminLogin";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 flex flex-col font-sans antialiased selection:bg-primary/20 selection:text-primary-dark">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Content Views */}
        <div className="flex-grow">
          <Routes>
            {/* Public blog views */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />

            {/* Admin controller dashboard views */}
            <Route path="/admin/posts" element={<PostsDashboard />} />
            <Route path="/admin/posts/new" element={<PostEditor />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Fail-safe redirection: Default visitors go to /blog */}
            <Route path="*" element={<Navigate to="/blog" replace />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}
