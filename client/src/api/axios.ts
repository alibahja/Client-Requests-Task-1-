import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiEnvelope, ApiErrorBody } from "../types";

const TOKEN_KEY = "crd_token";

// ---------- Token storage helpers ----------
export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

// ---------- Axios instance ----------
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ---------- Request interceptor: attach token ----------
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Response interceptor: handle 401 + normalize errors ----------
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorBody>) => {
    // Token expired / invalid → clear and bounce to login
    if (error.response?.status === 401) {
      tokenStorage.clear();
      // Let the AuthContext re-sync via a reload; simpler than wiring events
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const body = error.response?.data;
    const message =
      body?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    // Reject with a normalized error object
    return Promise.reject({
      message,
      errors: body?.errors ?? [],
      status: error.response?.status ?? 0,
    });
  }
);

// ---------- Unwrap helper ----------
// Every successful call comes back as { success, message, data }.
// This pulls `data` out so callers get the payload directly.
export async function unwrap<T>(promise: Promise<AxiosResponse<ApiEnvelope<T>>>): Promise<T> {
  const res = await promise;
  return res.data.data;
}