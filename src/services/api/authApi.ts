import apiClient, { setToken, removeToken, getToken } from './apiClient';

/**
 * Auth API
 * Authentication endpoints
 */

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    token: string;
  };
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  if (response.data.success) {
    setToken(response.data.data.token);
  }
  return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  if (response.data.success) {
    setToken(response.data.data.token);
  }
  return response.data;
};

/**
 * Logout user
 */
export const logout = (): void => {
  removeToken();
};

/**
 * Get current user
 */
export const getMe = async (): Promise<AuthUser | null> => {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await apiClient.get<{ success: boolean; data: AuthUser }>('/auth/me');
    return response.data.success ? response.data.data : null;
  } catch {
    removeToken();
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export default {
  register,
  login,
  logout,
  getMe,
  isAuthenticated
};