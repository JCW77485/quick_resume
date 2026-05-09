<template>
  <div
    class="resume-preview-stage"
    :style="{
      width: width + 'px',
      height: height + 'px',
      pointerEvents: interactive ? 'auto' : 'none',
    }"
  >
    <div
      class="resume-preview-scale"
      data-print-target
      :style="{
        transform: printable ? 'none' : `scale(${scale})`,
        transformOrigin: 'top left',
        width: '8.5in',
      }"
    >
      <ResumePage :printable="printable">
        <component
          :is="templateComponent"
          :resume="resume"
        />
      </ResumePage>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResumePage from './ResumePage.vue';
import type { Resume } from '../types/resume';
import ClassicTemplate from '../templates/ClassicTemplate.vue';
import CompactTemplate from '../templates/CompactTemplate.vue';
import ModernTemplate from '../templates/ModernTemplate.vue';
import TwoColumnTemplate from '../templates/TwoColumnTemplate.vue';

export default defineComponent({
  name: 'ResumePreview',
  components: {
    ResumePage,
    ClassicTemplate,
    CompactTemplate,
    ModernTemplate,
    TwoColumnTemplate
  },
  props: {
    resume: { type: Object as () => Resume, required: true },
    scale: { type: Number, default: 1 },
    interactive: { type: Boolean, default: true },
    printable: { type: Boolean, default: false }
  },
  computed: {
    width(): number {
      return 8.5 * 96 * this.scale;
    },
    height(): number {
      return 11 * 96 * this.scale;
    },
    templateComponent(): string {
      const map: Record<string, string> = {
        classic: 'ClassicTemplate',
        compact: 'CompactTemplate',
        modern: 'ModernTemplate',
        twocol: 'TwoColumnTemplate'
      };
      return map[this.resume.design.template] || 'ClassicTemplate';
    }
  }
});
</script>
