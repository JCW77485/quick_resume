<template>
  <div class="flex min-h-full flex-col bg-slate-50">
    <Navbar />
    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:py-12">
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Choose Your Template
        </h1>
        <p class="mt-2 text-slate-600">
          Select from ten professional, ATS-optimized layouts.
        </p>
      </div>

      <!-- Grid: 1 col on mobile, 2 on tablet/ipad (md), 3 on desktop (lg), 4 on xl -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="t in TEMPLATES"
          :key="t.id"
          class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-brand-400 hover:shadow-md"
        >
          <!-- Thumbnail area with dynamic scaling -->
          <div class="relative bg-slate-100 p-4">
            <div
              ref="thumbContainers"
              class="relative mx-auto overflow-hidden shadow-sm"
              style="width: 100%; aspect-ratio: 8.5 / 11;"
            >
              <div
                :style="{
                  transformOrigin: 'top left',
                  transform: `scale(${scales[t.id] || 0.4})`,
                  width: '8.5in'
                }"
              >
                <ResumePreview
                  :resume="getSample(t.id)"
                  :scale="1"
                  :interactive="false"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-1 flex-col p-5">
            <div class="mb-4">
              <div class="font-bold text-slate-900">
                {{ t.name }}
              </div>
              <div class="mt-1 text-xs text-slate-500 line-clamp-2">
                {{ t.description }}
              </div>
            </div>
            <button
              type="button"
              class="mt-auto w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]"
              @click="useTemplate(t.id, t.name)"
            >
              Use this layout
            </button>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <router-link
          to="/builder"
          class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          View my current resumes <span aria-hidden="true">→</span>
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
      TEMPLATES,
      scales: {} as Record<string, number>,
      resizeObserver: null as ResizeObserver | null
    };
  },
  mounted() {
    this.calculateScales();
    this.resizeObserver = new ResizeObserver(() => {
        this.calculateScales();
    });

    const containers = this.$refs.thumbContainers as HTMLElement[];
    if (containers && containers.length > 0) {
        containers.forEach(c => this.resizeObserver?.observe(c));
    }
  },
  beforeUnmount() {
    this.resizeObserver?.disconnect();
  },
  methods: {
    calculateScales() {
        const containers = this.$refs.thumbContainers as HTMLElement[];
        if (!containers) return;

        const newScales: Record<string, number> = {};
        containers.forEach((container, idx) => {
            const templateId = this.TEMPLATES[idx].id;
            const w = container.clientWidth;
            // 8.5 inches at 96dpi is 816px
            newScales[templateId] = w / 816;
        });
        this.scales = newScales;
    },
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
