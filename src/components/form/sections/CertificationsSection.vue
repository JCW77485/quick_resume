<template>
  <SectionCard title="Certifications">
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
        v-for="(c, idx) in resume.certifications"
        :key="c.id"
        class="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_120px_auto]"
      >
        <Field label="Name">
          <TextInput
            :model-value="c.name"
            placeholder="AWS Solutions Architect"
            @update:model-value="setItem(idx, { name: $event })"
          />
        </Field>
        <Field label="Issuer">
          <TextInput
            :model-value="c.issuer"
            placeholder="Amazon Web Services"
            @update:model-value="setItem(idx, { issuer: $event })"
          />
        </Field>
        <Field label="Date">
          <TextInput
            :model-value="c.date"
            placeholder="2023"
            @update:model-value="setItem(idx, { date: $event })"
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
      <Plus :size="14" /> Add certification
    </button>
  </SectionCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import type { CertificationItem, Resume } from '../../../types/resume';
import { uid } from '../../../lib/uid';
import Field from '../Field.vue';
import TextInput from '../TextInput.vue';
import SectionCard from '../SectionCard.vue';

export default defineComponent({
  name: 'CertificationsSection',
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
      const item: CertificationItem = { id: uid(), name: "", issuer: "", date: "" };
      this.$emit('update', (r: Resume) => ({ ...r, certifications: [...r.certifications, item] }));
    },
    setItem(idx: number, patch: Partial<CertificationItem>) {
      this.$emit('update', (r: Resume) => ({
        ...r,
        certifications: r.certifications.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
      }));
    },
    remove(idx: number) {
      this.$emit('update', (r: Resume) => ({ ...r, certifications: r.certifications.filter((_, i) => i !== idx) }));
    }
  }
});
</script>
