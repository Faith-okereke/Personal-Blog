/**
 * Generates a clean URL-friendly slug from a title string.
 * e.g., "My First Post!" -> "my-first-post"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove all non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, "-")  // Replace spaces and underscores with hyphens
    .replace(/--+/g, "-")      // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, "");  // Trim hyphens from start and end
}

/**
 * Calculates estimation of reading time for a given text body.
 * Assumes average reading speed of 200 words per minute.
 */
export function calculateReadTime(htmlContent: string): string {
  const plainText = htmlContent.replace(/<[^>]*>/g, ""); // Strip HTML tags
  const words = plainText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}
