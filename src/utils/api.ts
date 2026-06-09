/**
 * API fetch wrapper with automatic JWT headers and response intercepting.
 * Authenticated requests retrieve token from localStorage 'token' key.
 * Triggers redirect to /admin/login upon receiving a 401 response status.
 */

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

  try {
    const response = await fetch(endpoint, options);

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
