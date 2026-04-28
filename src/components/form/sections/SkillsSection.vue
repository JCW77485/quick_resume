<template>
  <SectionCard
    title="Skills"
    subtitle="Group related skills by category"
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

    <div class="space-y-2">
      <div
        v-for="(s, idx) in resume.skills"
        :key="s.id"
        class="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[140px_1fr_auto]"
      >
        <Field label="Category">
          <TextInput
            :model-value="s.category"
            placeholder="Languages"
            @update:model-value="setItem(idx, { category: $event })"
          />
        </Field>
        <Field
          label="Skills"
          hint="Comma-separated"
        >
          <TextInput
            :model-value="s.items"
            placeholder="TypeScript, JavaScript, Python"
            @update:model-value="setItem(idx, { items: $event })"
          />
        </Field>
        <button
          type="button"
          class="self-end rounded-md border border-slate-200 bg-white p-2 text-slate-400 hover:text-red-600"
          title="Remove"
          @click="remove(idx)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
    <button
      type="button"
      class="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700"
      @click="add"
    >
      <Plus :size="14" /> Add skill group
    </button>
  </SectionCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import type { Resume, SkillGroup } from '../../../types/resume';
import { uid } from '../../../lib/uid';
import Field from '../Field.vue';
import TextInput from '../TextInput.vue';
import SectionCard from '../SectionCard.vue';

export default defineComponent({
  name: 'SkillsSection',
  components: {
    Plus,
    Trash2,
    Field,
    TextInput,
    SectionCard
  },
  props: {
    resume: { type: Object as () => Resume, required: true },
    hasRemove: { type: Boolean, default: false }
  },
  emits: ['update', 'remove-section'],
  methods: {
    add() {
      const item: SkillGroup = { id: uid(), category: "", items: "" };
      this.$emit('update', (r: Resume) => ({ ...r, skills: [...r.skills, item] }));
    },
    setItem(idx: number, patch: Partial<SkillGroup>) {
      this.$emit('update', (r: Resume) => ({
        ...r,
        skills: r.skills.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
      }));
    },
    remove(idx: number) {
      this.$emit('update', (r: Resume) => ({ ...r, skills: r.skills.filter((_, i) => i !== idx) }));
    }
  }
});
</script>
