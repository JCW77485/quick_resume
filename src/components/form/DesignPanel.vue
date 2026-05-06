<template>
  <div class="space-y-3">
    <SectionCard
      title="Template"
      subtitle="Switch between layouts anytime"
    >
      <div class="grid gap-3 sm:grid-cols-2">
        <button
          v-for="t in TEMPLATES"
          :key="t.id"
          type="button"
          :class="[
            'no-print overflow-hidden rounded-lg border text-left transition',
            resume.design.template === t.id
              ? 'border-brand-500 ring-2 ring-brand-200'
              : 'border-slate-200 hover:border-slate-300'
          ]"
          @click="setDesign('template', t.id)"
        >
          <div class="bg-slate-100 p-2">
            <div style="width: 100%; aspect-ratio: 8.5 / 11; overflow: hidden">
              <div
                style="transform-origin: top left; transform: scale(0.28); width: 8.5in"
              >
                <ResumePreview
                  :resume="getPreview(t.id)"
                  :scale="1"
                  :interactive="false"
                />
              </div>
            </div>
          </div>
          <div class="p-2">
            <div class="text-sm font-semibold text-slate-900">
              {{ t.name }}
            </div>
            <div class="text-xs text-slate-500">
              {{ t.description }}
            </div>
          </div>
        </button>
      </div>
    </SectionCard>

    <SectionCard title="Accent color">
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="c in PRESET_COLORS"
          :key="c"
          type="button"
          :class="[
            'h-8 w-8 rounded-full border-2 transition',
            resume.design.accentColor === c ? 'border-slate-900' : 'border-white shadow-sm'
          ]"
          :style="{ background: c }"
          :title="c"
          @click="setDesign('accentColor', c)"
        />
        <label class="flex items-center gap-2 text-xs text-slate-500">
          Custom
          <input
            type="color"
            :value="resume.design.accentColor"
            class="h-7 w-9 cursor-pointer rounded border border-slate-300 bg-white p-0"
            @input="setDesign('accentColor', ($event.target as HTMLInputElement).value)"
          >
        </label>
      </div>
    </SectionCard>

    <SectionCard title="Typography">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-slate-600">Font family</span>
          <select
            :value="resume.design.fontFamily"
            class="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            @change="setDesign('fontFamily', ($event.target as HTMLSelectElement).value)"
          >
            <option value="sans">Sans-serif</option>
            <option value="serif">Serif</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-slate-600">Font size</span>
          <select
            :value="resume.design.fontSize"
            class="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            @change="setDesign('fontSize', ($event.target as HTMLSelectElement).value)"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-slate-600">Spacing</span>
          <select
            :value="resume.design.spacing"
            class="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            @change="setDesign('spacing', ($event.target as HTMLSelectElement).value)"
          >
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </label>
      </div>
    </SectionCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Resume, TemplateId } from '../../types/resume';
import { TEMPLATES } from '../../templates';
import ResumePreview from '../ResumePreview.vue';
import SectionCard from './SectionCard.vue';

const PRESET_COLORS = [
  "#1e6cf5", // brand blue
  "#0f766e", // teal
  "#4f46e5", // indigo
  "#9333ea", // purple
  "#db2777", // pink
  "#dc2626", // red
  "#ea580c", // orange
  "#0f172a", // slate
];

export default defineComponent({
  name: 'DesignPanel',
  components: {
    ResumePreview,
    SectionCard
  },
  props: {
    resume: { type: Object as () => Resume, required: true }
  },
  emits: ['update'],
  data() {
    return {
      TEMPLATES,
      PRESET_COLORS
    };
  },
  methods: {
    setDesign(key: keyof Resume['design'], value: string | number | boolean) {
      this.$emit('update', (r: Resume) => ({
        ...r,
        design: { ...r.design, [key]: value }
      }));
    },
    getPreview(templateId: string) {
      return { ...this.resume, design: { ...this.resume.design, template: templateId as TemplateId } };
    }
  }
});
</script>
