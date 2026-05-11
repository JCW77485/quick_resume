import axios from "axios";

// Configure axios to include credentials (cookies) for all requests
axios.defaults.withCredentials = true;

import { defineStore } from "pinia";

/**
 * User interface representing the data structure returned from the PHP backend.
 */
interface User {
  id: string;
  email: string;
  is_pro: boolean;
  is_admin: boolean;
}

/**
 * AuthState interface for Pinia store.
 */
interface AuthState {
  user: User | null;
  isPro: boolean;
  isAdmin: boolean;
  loading: boolean;
  initialized: boolean;
}

// Relative path to the PHP API to support various hosting environments (e.g. subfolders)
const API_URL = './api/index.php';

/**
 * Authentication Store
 * Handles user login, signup, session persistence, and Pro status verification.
 */
export const useAuth = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isPro: false,
    isAdmin: false,
    loading: true,
    initialized: false,
  }),

  actions: {
    /**
     * Initializes the auth state by checking for an active session on the server.
     */
    async init() {
      if (this.initialized) return;
      try {
        const res = await axios.get(`${API_URL}/auth/user`);
        if (res.data && !res.data.error) {
          this.user = res.data;
          this.isPro = !!this.user?.is_pro;
          this.isAdmin = !!this.user?.is_admin;
        }
      } catch {
        // Not logged in or server error
        this.user = null;
      }
      this.loading = false;
      this.initialized = true;
    },

    /**
     * Fetches the latest user data from the database.
     */
    async refreshUser() {
      try {
        const res = await axios.get(`${API_URL}/auth/user`);
        if (res.data && !res.data.error) {
          this.user = res.data;
          this.isPro = !!this.user?.is_pro;
          this.isAdmin = !!this.user?.is_admin;
        }
      } catch (e) {
        console.error("Failed to refresh user", e);
      }
    },

    /**
     * Authenticates a user with email and password.
     */
    async login(email: string, pass: string) {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password: pass });
      if (res.data.success) {
        this.user = res.data.user;
        this.isPro = !!this.user?.is_pro;
        this.isAdmin = !!this.user?.is_admin;
        return true;
      }
      throw new Error(res.data.error || 'Login failed');
    },

    /**
     * Creates a new user account and automatically logs them in.
     */
    async signup(email: string, pass: string) {
        const res = await axios.post(`${API_URL}/auth/signup`, { email, password: pass });
        if (res.data.success) {
            return this.login(email, pass);
        }
        throw new Error(res.data.error || 'Signup failed');
    },

    /**
     * Verifies a Stripe Checkout session ID with the backend.
     */
    async verifyPayment(sessionId: string) {
        const res = await axios.post(`${API_URL}/verify-payment`, { session_id: sessionId });
        if (res.data.success) {
            await this.refreshUser();
            return true;
        }
        return false;
    },

    /**
     * Clears user session data and logs out.
     */
    async logout() {
      await axios.post(`${API_URL}/auth/logout`);
      this.user = null;
      this.isPro = false;
      this.isAdmin = false;
    }
  },
});
