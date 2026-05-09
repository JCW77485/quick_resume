<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
      <router-link
        to="/"
        class="flex items-center gap-2 font-semibold text-slate-900"
      >
        <span class="grid h-7 w-7 place-items-center rounded-md bg-brand-600 text-white">
          <FileText :size="16" />
        </span>
        QuickResume
      </router-link>
      <nav class="flex flex-1 items-center gap-5">
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
      </nav>
<<<<<<< HEAD
      <div class="flex items-center gap-3">
        <template v-if="auth.user">
          <router-link
            v-if="!auth.isPro"
            to="/pricing"
            class="text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            Upgrade to Pro
          </router-link>
          <button
            type="button"
            class="text-sm font-medium text-slate-600 hover:text-slate-900"
            @click="handleLogout"
          >
            Sign out
          </button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 md:inline-flex"
          >
            Get started
          </router-link>
        </template>
      </div>
=======
      <router-link
        to="/builder"
        class="hidden rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 md:inline-flex"
      >
        Get started
      </router-link>
>>>>>>> origin/main
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FileText } from 'lucide-vue-next';
<<<<<<< HEAD
import { useAuth } from '../store/auth';
=======
>>>>>>> origin/main

export default defineComponent({
  name: 'Navbar',
  components: {
    FileText
  },
<<<<<<< HEAD
  computed: {
    auth() { return useAuth(); }
  },
  methods: {
    async handleLogout() {
      await this.auth.logout();
      this.$router.push('/');
    },
=======
  methods: {
>>>>>>> origin/main
    linkClass(isActive: boolean) {
      return "text-sm font-medium transition-colors cursor-pointer " +
        (isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-900");
    }
  }
});
</script>
