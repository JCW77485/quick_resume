<template>
  <div class="flex min-h-full flex-col bg-slate-50">
    <Navbar />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
          Resume Templates
        </h1>
        <p class="mt-2 text-slate-600">
          Ten carefully designed layouts, all ATS-friendly. Click “Use this” to start editing.
        </p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <div
          v-for="t in TEMPLATES"
          :key="t.id"
          class="overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
          <div class="bg-slate-100 p-4">
            <div style="width: 100%; aspect-ratio: 8.5 / 11; overflow: hidden">
              <div
                style="transform-origin: top left; transform: scale(0.42); width: 8.5in"
              >
                <ResumePreview
                  :resume="getSample(t.id)"
                  :scale="1"
                  :interactive="false"
                />
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between gap-3 border-t border-slate-200 p-4">
            <div>
              <div class="font-semibold text-slate-900">
                {{ t.name }}
              </div>
              <div class="mt-0.5 text-sm text-slate-500">
                {{ t.description }}
              </div>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
              @click="useTemplate(t.id, t.name)"
            >
              Use this
            </button>
          </div>
        </div>
      </div>
      <div class="mt-10 text-center">
        <router-link
          to="/builder"
          class="text-sm font-medium text-brand-700 hover:underline"
        >
          Go to my resumes →
        </router-link>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import AppFooter from '../components/AppFooter.vue';
import { TEMPLATES } from '../templates';
import ResumePreview from '../components/ResumePreview.vue';
import { sampleResume } from '../lib/defaults';
import type { TemplateId } from '../types/resume';
import { useResumes } from '../store/resumes';

export default defineComponent({
  name: 'Templates',
  components: {
    Navbar,
    AppFooter,
    ResumePreview
  },
  data() {
    return {
      TEMPLATES
    };
  },
  methods: {
    getSample(id: TemplateId) {
      const r = sampleResume();
      r.design.template = id;
      return r;
    },
    useTemplate(id: TemplateId, name: string) {
      const store = useResumes();
      const newId = store.createResume(`Resume — ${name}`, id);
      this.$router.push(`/builder/${newId}`);
    }
  }
});
</script>
