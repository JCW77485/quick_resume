<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
    <div style="width: 100%; aspect-ratio: 8.5 / 11; overflow: hidden">
      <div
        style="transform-origin: top left; transform: scale(0.33); width: 8.5in"
      >
        <ResumePreview
          :resume="resume"
          :scale="1"
          :interactive="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { TemplateId } from '../types/resume';
import { sampleResume } from '../lib/defaults';
import ResumePreview from '../components/ResumePreview.vue';

export default defineComponent({
  name: 'TemplateThumb',
  components: {
    ResumePreview
  },
  props: {
    templateId: { type: String as () => TemplateId, required: true }
  },
  computed: {
    resume() {
      const r = sampleResume();
      r.design.template = this.templateId;
      return r;
    }
  }
});
</script>
