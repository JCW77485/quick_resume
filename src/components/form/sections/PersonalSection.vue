<template>
  <SectionCard
    title="Personal details"
    subtitle="Your name, title, and contact info"
    :default-open="true"
  >
<<<<<<< HEAD
    <div class="mb-6 flex items-center gap-4">
      <div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
        <img
          v-if="p.avatar"
          :src="p.avatar"
          class="h-full w-full object-cover"
        >
        <div
          v-else
          class="flex h-full w-full items-center justify-center text-slate-400"
        >
          <Camera :size="24" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="cursor-pointer rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
          Upload photo
          <input
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleAvatarUpload"
          >
        </label>
        <button
          v-if="p.avatar"
          type="button"
          class="text-left text-xs font-medium text-red-600 hover:text-red-500"
          @click="set('avatar', '')"
        >
          Remove photo
        </button>
        <p class="text-[10px] text-slate-400">
          JPG, PNG or WebP. Max 1MB.
        </p>
      </div>
    </div>

=======
>>>>>>> origin/main
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
<<<<<<< HEAD
import { Camera } from 'lucide-vue-next';
=======
>>>>>>> origin/main
import type { Resume } from '../../../types/resume';
import Field from '../Field.vue';
import TextInput from '../TextInput.vue';
import SectionCard from '../SectionCard.vue';

export default defineComponent({
  name: 'PersonalSection',
  components: {
    Field,
    TextInput,
<<<<<<< HEAD
    SectionCard,
    Camera
=======
    SectionCard
>>>>>>> origin/main
  },
  props: {
    resume: { type: Object as () => Resume, required: true }
  },
  emits: ['update'],
  computed: {
    p() { return this.resume.personal; }
  },
  methods: {
<<<<<<< HEAD
    set(key: keyof Resume['personal'], value: string) {
=======
    set(key: string, value: string) {
>>>>>>> origin/main
      this.$emit('update', (r: Resume) => ({
        ...r,
        personal: { ...r.personal, [key]: value }
      }));
<<<<<<< HEAD
    },
    handleAvatarUpload(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      if (file.size > 1024 * 1024) {
        alert("Image is too large. Please upload an image smaller than 1MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.set("avatar", result);
      };
      reader.readAsDataURL(file);
=======
>>>>>>> origin/main
    }
  }
});
</script>
