import { defineStore } from "pinia";
import axios from "axios";

interface User {
  id: string;
  email: string;
  is_pro: boolean;
  is_admin: boolean;
}

interface AuthState {
  user: User | null;
  isPro: boolean;
  isAdmin: boolean;
  loading: boolean;
  initialized: boolean;
}

const API_URL = '/api/index.php';

export const useAuth = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isPro: false,
    isAdmin: false,
    loading: true,
    initialized: false,
  }),

  actions: {
    async init() {
      if (this.initialized) return;
      const savedUser = localStorage.getItem('qr_user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
        this.isPro = !!this.user?.is_pro;
        this.isAdmin = !!this.user?.is_admin;
      }
      this.loading = false;
      this.initialized = true;
    },

    async login(email: string, pass: string) {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password: pass });
      if (res.data.success) {
        this.user = res.data.user;
        this.isPro = !!this.user?.is_pro;
        this.isAdmin = !!this.user?.is_admin;
        localStorage.setItem('qr_user', JSON.stringify(this.user));
        return true;
      }
      throw new Error(res.data.error || 'Login failed');
    },

    async signup(email: string, pass: string) {
        const res = await axios.post(`${API_URL}/auth/signup`, { email, password: pass });
        if (res.data.success) {
            return this.login(email, pass);
        }
        throw new Error(res.data.error || 'Signup failed');
    },

    async logout() {
      this.user = null;
      this.isPro = false;
      this.isAdmin = false;
      localStorage.removeItem('qr_user');
    }
  },
});
