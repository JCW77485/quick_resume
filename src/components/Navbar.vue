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
      <router-link
        to="/builder"
        class="hidden rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 md:inline-flex"
      >
        Get started
      </router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FileText } from 'lucide-vue-next';

export default defineComponent({
  name: 'Navbar',
  components: {
    FileText
  },
  methods: {
    linkClass(isActive: boolean) {
      return "text-sm font-medium transition-colors cursor-pointer " +
        (isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-900");
    }
  }
});
</script>
