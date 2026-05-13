<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          {{ isSignup ? 'Create your account' : 'Sign in to your account' }}
        </h2>
        <p class="mt-2 text-sm text-slate-600">
          Build and manage your professional resumes
        </p>
      </div>

      <!-- Google Login Section -->
      <div class="mt-8">
        <div
          ref="googleBtn"
          class="flex justify-center"
        />
        <div class="relative mt-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-2 text-slate-500">Or continue with email</span>
          </div>
        </div>
      </div>

      <form
        class="mt-6 space-y-6"
        @submit.prevent="handleSubmit"
      >
        <div class="space-y-4 rounded-md shadow-sm">
          <div>
            <label
              for="email-address"
              class="block text-sm font-medium text-slate-700"
            >Email address</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm"
              placeholder="you@example.com"
            >
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-slate-700"
            >Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm"
              placeholder="••••••••"
            >
          </div>
        </div>

        <div
          v-if="error"
          class="text-center text-sm font-medium text-red-600"
        >
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ loading ? 'Processing...' : (isSignup ? 'Sign up' : 'Sign in') }}
          </button>
        </div>
      </form>

      <div class="text-center">
        <button
          type="button"
          class="text-sm font-medium text-brand-600 hover:text-brand-500"
          @click="isSignup = !isSignup"
        >
          {{ isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from '../store/auth';

/**
 * Types for Google Identity Services.
 */
interface GoogleAuthResponse {
    credential: string;
}

declare const google: {
    accounts: {
        id: {
            initialize: (config: { client_id: string; callback: (resp: GoogleAuthResponse) => void }) => void;
            renderButton: (el: HTMLElement, options: { theme: string; size: string; width: string }) => void;
        }
    }
};

export default defineComponent({
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      isSignup: false,
      loading: false,
      error: ''
    };
  },
  mounted() {
    this.initGoogleAuth();
  },
  methods: {
    initGoogleAuth() {
        if (typeof google === 'undefined') {
            setTimeout(() => this.initGoogleAuth(), 500);
            return;
        }

        google.accounts.id.initialize({
            client_id: 'your-client-id-here.apps.googleusercontent.com',
            callback: this.handleGoogleCallback
        });

        google.accounts.id.renderButton(
            this.$refs.googleBtn as HTMLElement,
            { theme: "outline", size: "large", width: "100%" }
        );
    },

    async handleGoogleCallback(response: GoogleAuthResponse) {
        this.loading = true;
        this.error = '';
        const auth = useAuth();
        try {
            await auth.loginWithGoogle(response.credential);
            this.$router.push('/builder');
        } catch (e: unknown) {
            this.error = (e as Error).message || 'Google authentication failed';
        } finally {
            this.loading = false;
        }
    },

    async handleSubmit() {
      this.loading = true;
      this.error = '';
      const auth = useAuth();
      try {
        if (this.isSignup) {
          await auth.signup(this.email, this.password);
        } else {
          await auth.login(this.email, this.password);
        }
        this.$router.push('/builder');
      } catch (e: unknown) {
        this.error = (e as Error).message || 'An error occurred during authentication';
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>
