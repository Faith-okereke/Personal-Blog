import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "posts.json");
const SECRET_TOKEN = "developer_cms_super_secret_token";

// Middleware to parse requests
app.use(express.json());

// Helper database functions
function readPosts(): any[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading posts db:", error);
  }
  return [];
}

function writePosts(posts: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(posts, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing posts db:", error);
  }
}

// Authentication middleware
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== SECRET_TOKEN) {
    return res.status(401).json({ error: "Unauthorized: Invalid JWT token" });
  }
  next();
};

// --- AUTHENTICATION ENDPOINT (MOCK) ---
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password123") {
    return res.json({ token: SECRET_TOKEN });
  }
  return res.status(400).json({ error: "Invalid username or password (expected: admin / password123)" });
});

// --- API ENDPOINTS ---

// GET /api/posts - Fetch all published posts
app.get("/api/posts", (req, res) => {
  const posts = readPosts();
  const published = posts.filter((p: any) => p.status === "Published");
  res.json(published);
});

// GET /api/posts/:slug - Fetch single post by slug
app.get("/api/posts/:slug", (req, res) => {
  const posts = readPosts();
  const post = posts.find((p: any) => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
});

// GET /api/admin/posts - Fetch all posts (including drafts, protected)
app.get("/api/admin/posts", requireAuth, (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// POST /api/posts - Create post (protected)
app.post("/api/posts", requireAuth, (req, res) => {
  const { title, slug, coverImage, body, status } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "Title and Body are required properties" });
  }

  const posts = readPosts();
  const targetSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  
  // Validate slug uniqueness
  if (posts.some((p: any) => p.slug === targetSlug)) {
    return res.status(400).json({ error: `A post with the slug '${targetSlug}' already exists.` });
  }

  // Calculate read time
  const wordCount = body.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200) + " min read";

  // Format datepublished
  const datePublished = status === "Published" ? new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";

  const newPost = {
    id: "post-" + Date.now(),
    title,
    slug: targetSlug,
    coverImage: coverImage || "",
    body,
    status: status || "Draft",
    datePublished,
    dateCreated: new Date().toISOString(),
    readTime
  };

  posts.push(newPost);
  writePosts(posts);
  res.status(210).json(newPost);
});

// PUT /api/posts/:id - Update post (protected)
app.put("/api/posts/:id", requireAuth, (req, res) => {
  const { title, slug, coverImage, body, status } = req.body;
  const posts = readPosts();
  const index = posts.findIndex((p: any) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  const currentPost = posts[index];
  const targetSlug = slug || currentPost.slug;

  // Validate slug uniqueness against other posts
  if (posts.some((p: any) => p.id !== currentPost.id && p.slug === targetSlug)) {
    return res.status(400).json({ error: `A post with the slug '${targetSlug}' already exists.` });
  }

  // Calculate read time
  const wordCount = (body || currentPost.body).replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200) + " min read";

  let datePublished = currentPost.datePublished;
  if (status === "Published" && (!currentPost.status || currentPost.status === "Draft")) {
    datePublished = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } else if (status === "Draft") {
    datePublished = "";
  }

  const updatedPost = {
    ...currentPost,
    title: title || currentPost.title,
    slug: targetSlug,
    coverImage: coverImage !== undefined ? coverImage : currentPost.coverImage,
    body: body || currentPost.body,
    status: status || currentPost.status,
    datePublished,
    readTime
  };

  posts[index] = updatedPost;
  writePosts(posts);
  res.json(updatedPost);
});

// PATCH /api/posts/:id/publish - Toggle publish status
app.patch("/api/posts/:id/publish", requireAuth, (req, res) => {
  const posts = readPosts();
  const index = posts.findIndex((p: any) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  const post = posts[index];
  const newStatus = post.status === "Published" ? "Draft" : "Published";
  const datePublished = newStatus === "Published" ? new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";

  post.status = newStatus;
  post.datePublished = datePublished;

  writePosts(posts);
  res.json(post);
});

// DELETE /api/posts/:id - Delete post
app.delete("/api/posts/:id", requireAuth, (req, res) => {
  const posts = readPosts();
  const filtered = posts.filter((p: any) => p.id !== req.params.id);
  if (posts.length === filtered.length) {
    return res.status(404).json({ error: "Post not found" });
  }
  writePosts(filtered);
  res.json({ success: true, message: "Post deleted successfully" });
});

// Server client app
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite as a middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
