import { defineStore } from "pinia";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface AuthState {
  user: User | null;
  isPro: boolean;
  isAdmin: boolean;
  loading: boolean;
  initialized: boolean;
}

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

      return new Promise<void>((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          this.user = user;
          if (user) {
            await this.checkSubscription(user.uid);
          } else {
            this.isPro = false;
          }
          this.loading = false;
          this.initialized = true;
          resolve();
        });
      });
    },

    async checkSubscription(uid: string) {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          this.isPro = data.isPro || false;
          this.isAdmin = data.isAdmin || false;
        } else {
          this.isPro = false;
          this.isAdmin = false;
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        this.isPro = false;
        this.isAdmin = false;
      }
    },

    async logout() {
      await auth.signOut();
      this.user = null;
      this.isPro = false;
      this.isAdmin = false;
    }
  },
});
