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

      <form
        class="mt-8 space-y-6"
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
  methods: {
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
