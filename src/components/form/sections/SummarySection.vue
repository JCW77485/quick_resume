<template>
  <SectionCard
    title="Professional summary"
    subtitle="A short pitch at the top of your resume"
  >
    <template #actions>
      <button
        v-if="hasRemove"
        type="button"
        class="text-xs font-medium text-slate-400 hover:text-red-600"
        @click="$emit('remove-section')"
      >
        Remove section
      </button>
    </template>
    <Field
      label="Summary"
      hint="2–4 sentences"
    >
      <TextArea
        :model-value="resume.personal.summary"
        placeholder="Senior full-stack engineer with 7+ years of experience..."
        :rows="4"
        @update:model-value="updateSummary"
      />
    </Field>
  </SectionCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Resume } from '../../../types/resume';
import Field from '../Field.vue';
import TextArea from '../TextArea.vue';
import SectionCard from '../SectionCard.vue';

export default defineComponent({
  name: 'SummarySection',
  components: {
    Field,
    TextArea,
    SectionCard
  },
  props: {
    resume: { type: Object as () => Resume, required: true },
    hasRemove: { type: Boolean, default: false }
  },
  emits: ['update', 'remove-section'],
  methods: {
    updateSummary(val: string) {
      this.$emit('update', (r: Resume) => ({
        ...r,
        personal: { ...r.personal, summary: val }
      }));
    }
  }
});
</script>
