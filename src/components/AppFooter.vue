<template>
  <footer class="mt-16 border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>© {{ year }} QuickResume. Built for you.</div>
        <div>Your resumes stay in your browser — nothing is uploaded.</div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppFooter',
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
});
</script>
