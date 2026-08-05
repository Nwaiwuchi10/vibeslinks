import { store } from '@/store';
import { clearCredentials } from '@/store/slices/authSlice';
import { startLoading, stopLoading } from '@/store/slices/loadingSlice';
import { showToast } from '@/store/slices/toastSlice';
import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// Extend Axios config so callers can pass `{ silent: true }` to suppress error toasts
declare module 'axios' {
  interface AxiosRequestConfig {
    silent?: boolean;
  }
}


const BASE_URL = "http://192.168.0.106:3000"
// const BASE_URL = 'https://vibezlink-app-on-god-backend-production.up.railway.app';
const TOKEN_KEY = 'vibezlink_access_token';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 120000, // 2 minutes default timeout for all requests
});

// Request Interceptor: Inject Auth Token & Increment Loading Count
apiClient.interceptors.request.use(
  async (config) => {
    // If request contains FormData (video / image upload), increase timeout to 5 minutes (300,000ms)
    if (config.data instanceof FormData || config.headers?.['Content-Type'] === 'multipart/form-data') {
      config.timeout = 300000;
    }

    // Log request details and payload
    console.log(`[apiClient] >>> SEND REQUEST: ${config.method?.toUpperCase()} ${config.url} [Timeout ${config.timeout || 120000}ms]`);
    if (config.data) {
      console.log('[apiClient] Request Payload (Body):', JSON.stringify(config.data, null, 2));
    }
    if (config.params) {
      console.log('[apiClient] Request Params:', JSON.stringify(config.params, null, 2));
    }

    // 1. Show global spinner for write/sensitive methods (POST, PATCH, DELETE, PUT)
    // or keep it selective to avoid spinner on page refresh.
    // Let's show spinner for all mutations or custom settings.
    const isMutation = ['post', 'put', 'patch', 'delete'].includes(config.method || '');
    if (isMutation) {
      store.dispatch(startLoading());
    }

    // 2. Fetch JWT from Redux store first (fast & synchronous), fallback to SecureStore
    try {
      const state = store.getState();
      const token = state.auth?.token || await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;

        // Print it nicely so the user can easily find it
        console.log('\n\n======================================================');
        console.log('✨ YOUR CURRENT ACCESS TOKEN (Copy below this line):');
        console.log(token);
        console.log('======================================================\n\n');
      }
    } catch (err) {
      console.error('Error fetching token:', err);
    }

    return config;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

// Response Interceptor: Decrement Loading Count & Catch Errors Globally
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`[apiClient] <<< RESPONSE SUCCESS: ${response.config.method?.toUpperCase()} ${response.config.url} [Status ${response.status}]`);
    console.log('[apiClient] Response Data:', JSON.stringify(response.data, null, 2));

    const config = response.config as any;
    const isMutation = ['post', 'put', 'patch', 'delete'].includes(response.config.method || '');
    if (isMutation) {
      store.dispatch(stopLoading());
    }
    return response;
  },
  (error) => {
    store.dispatch(stopLoading());

    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || error.message || 'An unexpected error occurred';

    // Log error response
    console.error(`[apiClient] <<< RESPONSE ERROR: ${error.config?.method?.toUpperCase()} ${error.config?.url} [Status ${status || 'No Status'}]`);
    console.error('[apiClient] Error Response Data:', JSON.stringify(data || error.message, null, 2));

    // Disregard status 401 handling if checking authentication state
    if (status === 401) {
      // Auto logout on token expiration
      const authState = store.getState().auth;
      if (authState.isAuthenticated) {
        store.dispatch(clearCredentials());
        store.dispatch(
          showToast({
            type: 'warning',
            message: 'Session expired. Please sign in again.',
          })
        );
        // Force redirect to login screen
        router.replace('/(auth)/login');
      } else {
        // Even if Redux doesn't think we're authenticated (e.g. initial load), force redirect anyway
        router.replace('/(auth)/login');
      }
    } else {
      // Skip toast when caller opts out via { silent: true } in request config
      const isSilent = (error.config as any)?.silent === true;
      if (!isSilent) {
        store.dispatch(
          showToast({
            type: 'error',
            message: typeof message === 'string' ? message : JSON.stringify(message),
          })
        );
      }
    }

    return Promise.reject(error);
  }
);

export const resolveImageUrl = (url?: string | null) => {
  if (!url) return null;
  // Replace backend dev localhost/127.0.0.1 URLs with remote BASE_URL for Android device access
  if (url.includes('localhost:') || url.includes('127.0.0.1:')) {
    const relativePath = url.replace(/^https?:\/\/[^\/]+/, '');
    return relativePath.startsWith('/') ? `${BASE_URL}${relativePath}` : `${BASE_URL}/${relativePath}`;
  }
  // Standardize http:// URLs to https:// if pointing to remote backend or Cloudinary
  if (url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    url = url.replace('http://', 'https://');
  }
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('file://') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  return url.startsWith('/') ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`;
};
