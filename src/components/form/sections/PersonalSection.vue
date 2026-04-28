<template>
  <SectionCard
    title="Personal details"
    subtitle="Your name, title, and contact info"
    :default-open="true"
  >
    <div class="grid gap-3 sm:grid-cols-2">
      <Field label="Full name">
        <TextInput
          :model-value="p.fullName"
          placeholder="Alex Morgan"
          @update:model-value="set('fullName', $event)"
        />
      </Field>
      <Field label="Professional title">
        <TextInput
          :model-value="p.title"
          placeholder="Senior Software Engineer"
          @update:model-value="set('title', $event)"
        />
      </Field>
      <Field label="Email">
        <TextInput
          :model-value="p.email"
          placeholder="you@example.com"
          @update:model-value="set('email', $event)"
        />
      </Field>
      <Field label="Phone">
        <TextInput
          :model-value="p.phone"
          placeholder="+1 (555) 123-4567"
          @update:model-value="set('phone', $event)"
        />
      </Field>
      <Field label="Location">
        <TextInput
          :model-value="p.location"
          placeholder="San Francisco, CA"
          @update:model-value="set('location', $event)"
        />
      </Field>
      <Field label="Website">
        <TextInput
          :model-value="p.website"
          placeholder="yourname.dev"
          @update:model-value="set('website', $event)"
        />
      </Field>
      <Field label="LinkedIn">
        <TextInput
          :model-value="p.linkedin"
          placeholder="linkedin.com/in/you"
          @update:model-value="set('linkedin', $event)"
        />
      </Field>
      <Field label="GitHub">
        <TextInput
          :model-value="p.github"
          placeholder="github.com/you"
          @update:model-value="set('github', $event)"
        />
      </Field>
    </div>
  </SectionCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Resume } from '../../../types/resume';
import Field from '../Field.vue';
import TextInput from '../TextInput.vue';
import SectionCard from '../SectionCard.vue';

export default defineComponent({
  name: 'PersonalSection',
  components: {
    Field,
    TextInput,
    SectionCard
  },
  props: {
    resume: { type: Object as () => Resume, required: true }
  },
  emits: ['update'],
  computed: {
    p() { return this.resume.personal; }
  },
  methods: {
    set(key: string, value: string) {
      this.$emit('update', (r: Resume) => ({
        ...r,
        personal: { ...r.personal, [key]: value }
      }));
    }
  }
});
</script>
