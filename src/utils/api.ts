/**
 * API fetch wrapper with automatic JWT headers and response intercepting.
 * Authenticated requests retrieve token from localStorage 'token' key.
 * Triggers redirect to /admin/login upon receiving a 401 response status.
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "";

async function apiRequest(method: string, endpoint: string, body?: any) {
  const token = localStorage.getItem("token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Build target URL by prepending VITE_API_BASE_URL if set and target itself is relative
  let targetUrl = endpoint;
  if (API_BASE_URL && !endpoint.startsWith("http://") && !endpoint.startsWith("https://")) {
    const base = API_BASE_URL.replace(/\/+$/, "");
    const relativePart = endpoint.replace(/^\/+/, "");
    targetUrl = `${base}/${relativePart}`;
  }

  try {
    const response = await fetch(targetUrl, options);

    if (response.status === 401) {
      localStorage.removeItem("token");
      // Check if not already on the login page to avoid infinite reloads
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login?error=session_expired";
      }
      throw new Error("Unauthorized access. Redirected to Login.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error on [${method}] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint: string) => apiRequest("GET", endpoint),
  post: (endpoint: string, data: any) => apiRequest("POST", endpoint, data),
  put: (endpoint: string, data: any) => apiRequest("PUT", endpoint, data),
  delete: (endpoint: string) => apiRequest("DELETE", endpoint),
  patch: (endpoint: string, data?: any) => apiRequest("PATCH", endpoint, data),
};
export default api;
