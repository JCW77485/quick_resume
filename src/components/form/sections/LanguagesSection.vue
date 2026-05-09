<template>
  <SectionCard title="Languages">
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
        v-for="(l, idx) in resume.languages"
        :key="l.id"
        class="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]"
      >
        <Field label="Language">
          <TextInput
            :model-value="l.name"
            placeholder="Spanish"
            @update:model-value="setItem(idx, { name: $event })"
          />
        </Field>
        <Field label="Proficiency">
          <input
            type="range"
            min="0"
            :max="levels.length - 1"
            step="1"
            :value="levels.indexOf(l.level) >= 0 ? levels.indexOf(l.level) : 2"
            @input="updateLevel(idx, ($event.target as HTMLInputElement).value)"
          >
          <div style="margin-top: 6px">
            {{ l.level || "Advanced" }}
          </div>
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
      <Plus :size="14" /> Add language
    </button>
  </SectionCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import type { LanguageItem, Resume } from '../../../types/resume';
import { uid } from '../../../lib/uid';
import Field from '../Field.vue';
import TextInput from '../TextInput.vue';
import SectionCard from '../SectionCard.vue';

export default defineComponent({
  name: 'LanguagesSection',
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
  data() {
    return {
      levels: ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"]
    };
  },
  methods: {
    add() {
      const item: LanguageItem = { id: uid(), name: "", level: "" };
      this.$emit('update', (r: Resume) => ({ ...r, languages: [...r.languages, item] }));
    },
    setItem(idx: number, patch: Partial<LanguageItem>) {
      this.$emit('update', (r: Resume) => ({
        ...r,
        languages: r.languages.map((l, i) => (i === idx ? { ...l, ...patch } : l)),
      }));
    },
    remove(idx: number) {
      this.$emit('update', (r: Resume) => ({ ...r, languages: r.languages.filter((_, i) => i !== idx) }));
    },
    updateLevel(idx: number, val: string) {
      this.setItem(idx, { level: this.levels[Number(val)] });
    }
  }
});
</script>
