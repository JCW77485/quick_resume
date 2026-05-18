<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <router-link
        to="/"
        class="flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white shadow-sm shadow-brand-100">
          <FileText :size="18" />
        </span>
        <span class="text-lg font-bold tracking-tight text-slate-900">QuickResume</span>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden flex-1 items-center gap-1 px-8 md:flex">
        <router-link
          v-slot="{ isActive }"
          to="/templates"
        >
          <span :class="linkClass(isActive)">Templates</span>
        </router-link>
        <router-link
          v-slot="{ isActive }"
          to="/builder"
        >
          <span :class="linkClass(isActive)">My Resumes</span>
        </router-link>
        <router-link
          v-if="auth.isAdmin"
          v-slot="{ isActive }"
          to="/admin"
        >
          <span :class="linkClass(isActive)">Admin</span>
        </router-link>
      </nav>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <template v-if="auth.user">
          <router-link
            v-if="!auth.isPro"
            to="/pricing"
            class="hidden text-xs font-bold text-amber-600 transition hover:text-amber-700 sm:inline"
          >
            ⭐ Upgrade Pro
          </router-link>
          <button
            type="button"
            class="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            @click="handleLogout"
          >
            Sign out
          </button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-brand-100 transition hover:bg-brand-700 active:scale-[0.98]"
          >
            Sign in
          </router-link>
        </template>

        <!-- Mobile Menu Toggle -->
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-50 md:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <component :is="isMenuOpen ? 'X' : 'MenuIcon'" />
        </button>
      </div>
    </div>

    <!-- Mobile Nav -->
    <div
      v-if="isMenuOpen"
      class="border-t border-slate-100 bg-white p-4 shadow-xl md:hidden"
    >
      <nav class="flex flex-col gap-1">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-md px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
          @click="isMenuOpen = false"
        >
          {{ link.label }}
        </router-link>
        <div
          v-if="auth.user && !auth.isPro"
          class="mt-2 border-t border-slate-100 pt-2"
        >
          <router-link
            to="/pricing"
            class="block rounded-md bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700"
            @click="isMenuOpen = false"
          >
            Upgrade to Pro
          </router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FileText, Menu as MenuIcon, X } from 'lucide-vue-next';
import { useAuth } from '../store/auth';

export default defineComponent({
  name: 'Navbar',
  components: {
    FileText,
    MenuIcon,
    X
  },
  data() {
    return {
      isMenuOpen: false
    };
  },
  computed: {
    auth() { return useAuth(); },
    navLinks() {
        const links = [
            { to: '/templates', label: 'Templates' },
            { to: '/builder', label: 'My Resumes' }
        ];
        if (this.auth.isAdmin) {
            links.push({ to: '/admin', label: 'Admin Dashboard' });
        }
        return links;
    }
  },
  methods: {
    async handleLogout() {
      await this.auth.logout();
      this.$router.push('/');
    },
    linkClass(isActive: boolean) {
      return "px-3 py-2 text-sm font-semibold transition-colors rounded-md " +
        (isActive ? "text-brand-700 bg-brand-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50");
    }
  }
});
</script>
