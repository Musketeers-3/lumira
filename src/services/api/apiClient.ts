import axios, { type AxiosInstance, type AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
console.log("[API Client] Using API URL:", API_URL);
const TOKEN_KEY = "lumira_auth_token";

/**
 * API Client
 * Axios instance with JWT token handling
 * All API calls go through this client
 */

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 second timeout
});

/**
 * Get JWT token from storage
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set JWT token in storage
 */
export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove JWT token from storage
 */
export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Request interceptor - attach JWT token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor - handle errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeToken();
      // Optionally redirect to login
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        // Could dispatch auth state change here
        console.warn("Authentication required");
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
