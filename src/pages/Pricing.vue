<template>
  <div class="flex min-h-full flex-col bg-slate-50">
    <Navbar />
    <main class="mx-auto w-full max-w-4xl flex-1 px-4 py-16">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p class="mt-4 text-xl text-slate-600">
          Choose the plan that's right for your career.
        </p>
      </div>

      <div class="mt-16 grid gap-8 md:grid-cols-2">
        <!-- Free Plan -->
        <div class="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 class="text-2xl font-bold text-slate-900">
            Free
          </h2>
          <p class="mt-2 text-slate-600">
            Get started with building your resume.
          </p>
          <div class="mt-4 flex items-baseline">
            <span class="text-4xl font-bold text-slate-900">$0</span>
            <span class="ml-1 text-slate-500">/forever</span>
          </div>
          <ul class="mt-8 flex-1 space-y-4">
            <li class="flex items-center gap-3 text-slate-700">
              <Check
                class="text-emerald-500"
                :size="18"
              />
              Manage unlimited resumes
            </li>
            <li class="flex items-center gap-3 text-slate-700">
              <Check
                class="text-emerald-500"
                :size="18"
              />
              Access to all 10 templates
            </li>
            <li class="flex items-center gap-3 text-slate-400">
              <X :size="18" />
              Download as PDF
            </li>
          </ul>
          <button
            type="button"
            class="mt-8 w-full rounded-md border border-slate-300 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            @click="$router.push('/builder')"
          >
            Current Plan
          </button>
        </div>

        <!-- Pro Plan -->
        <div class="relative flex flex-col rounded-2xl border-2 border-brand-600 bg-white p-8 shadow-md">
          <div class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
            Most Popular
          </div>
          <h2 class="text-2xl font-bold text-slate-900">
            Pro
          </h2>
          <p class="mt-2 text-slate-600">
            Perfect for serious job seekers.
          </p>
          <div class="mt-4 flex items-baseline">
            <span class="text-4xl font-bold text-slate-900">$10</span>
            <span class="ml-1 text-slate-500">/one-time</span>
          </div>
          <ul class="mt-8 flex-1 space-y-4">
            <li class="flex items-center gap-3 text-slate-700">
              <Check
                class="text-emerald-500"
                :size="18"
              />
              Everything in Free
            </li>
            <li class="flex items-center gap-3 text-slate-700">
              <Check
                class="text-emerald-500"
                :size="18"
              />
              Unlimited PDF downloads
            </li>
            <li class="flex items-center gap-3 text-slate-700">
              <Check
                class="text-emerald-500"
                :size="18"
              />
              Priority support
            </li>
          </ul>
          <button
            type="button"
            :disabled="loading || auth.isPro"
            class="mt-8 w-full rounded-md bg-brand-600 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            @click="handleSubscribe"
          >
            {{ auth.isPro ? 'Already Pro' : (loading ? 'Redirecting...' : 'Upgrade now') }}
          </button>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Check, X } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import AppFooter from '../components/AppFooter.vue';
import { useAuth } from '../store/auth';
import { loadStripe } from '@stripe/stripe-js';

export default defineComponent({
  name: 'Pricing',
  components: {
    Navbar,
    AppFooter,
    Check,
    X
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    auth() { return useAuth(); }
  },
  methods: {
    async handleSubscribe() {
      if (!this.auth.user) {
        this.$router.push('/login');
        return;
      }

      this.loading = true;
      try {
        // This is a placeholder for actual Stripe Checkout integration.
        // In a real SaaS, you'd call your backend to create a Checkout Session.
        console.log("Redirecting to Stripe...");
        await loadStripe('your-publishable-key');

        // Simulating success for this demo:
        // Normally, Stripe redirects back to a success URL where you'd update the DB.
        alert("In a real app, this would redirect to Stripe Checkout. For this demonstration, please use Firebase Console to set 'isPro: true' in your user document.");

      } catch (error) {
        console.error("Stripe error:", error);
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>
