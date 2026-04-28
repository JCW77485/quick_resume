<template>
  <SectionCard title="Education">
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
      <ItemCard
        v-for="(e, idx) in resume.education"
        :key="e.id"
        :title="e.school || 'New school'"
        :subtitle="[e.degree, e.field].filter(Boolean).join(', ')"
        :default-open="!e.school"
        :has-move-up="idx > 0"
        :has-move-down="idx < resume.education.length - 1"
        :has-delete="true"
        @move-up="move(idx, -1)"
        @move-down="move(idx, 1)"
        @delete="remove(idx)"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <Field label="School">
            <TextInput
              :model-value="e.school"
              placeholder="University of California, Berkeley"
              @update:model-value="setItem(idx, { school: $event })"
            />
          </Field>
          <Field label="Degree">
            <TextInput
              :model-value="e.degree"
              placeholder="B.S."
              @update:model-value="setItem(idx, { degree: $event })"
            />
          </Field>
          <Field label="Field of study">
            <TextInput
              :model-value="e.field"
              placeholder="Computer Science"
              @update:model-value="setItem(idx, { field: $event })"
            />
          </Field>
          <Field label="Location">
            <TextInput
              :model-value="e.location"
              placeholder="Berkeley, CA"
              @update:model-value="setItem(idx, { location: $event })"
            />
          </Field>
          <Field label="Start year">
            <TextInput
              :model-value="e.startDate"
              placeholder="2015"
              @update:model-value="setItem(idx, { startDate: $event })"
            />
          </Field>
          <Field label="End year">
            <TextInput
              :model-value="e.endDate"
              placeholder="2019"
              @update:model-value="setItem(idx, { endDate: $event })"
            />
          </Field>
        </div>
        <Field
          label="Details"
          hint="GPA, honors, relevant coursework, etc."
        >
          <TextArea
            :model-value="e.details"
            placeholder="Minor in Design. Dean's List."
            :rows="2"
            @update:model-value="setItem(idx, { details: $event })"
          />
        </Field>
      </ItemCard>
    </div>

    <button
      type="button"
      class="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700"
      @click="add"
    >
      <Plus :size="14" /> Add education
    </button>
  </SectionCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { EducationItem, Resume } from '../../../types/resume';
import { uid } from '../../../lib/uid';
import Field from '../Field.vue';
import TextInput from '../TextInput.vue';
import TextArea from '../TextArea.vue';
import SectionCard from '../SectionCard.vue';
import ItemCard from '../ItemCard.vue';

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default defineComponent({
  name: 'EducationSection',
  components: {
    Plus,
    Field,
    TextInput,
    TextArea,
    SectionCard,
    ItemCard
  },
  props: {
    resume: { type: Object as () => Resume, required: true },
    hasRemove: { type: Boolean, default: false }
  },
  emits: ['update', 'remove-section'],
  methods: {
    add() {
      const item: EducationItem = {
        id: uid(),
        school: "",
        degree: "",
        field: "",
        location: "",
        startDate: "",
        endDate: "",
        details: "",
      };
      this.$emit('update', (r: Resume) => ({ ...r, education: [...r.education, item] }));
    },
    setItem(idx: number, patch: Partial<EducationItem>) {
      this.$emit('update', (r: Resume) => ({
        ...r,
        education: r.education.map((e, i) => (i === idx ? { ...e, ...patch } : e)),
      }));
    },
    remove(idx: number) {
      this.$emit('update', (r: Resume) => ({ ...r, education: r.education.filter((_, i) => i !== idx) }));
    },
    move(idx: number, delta: number) {
      this.$emit('update', (r: Resume) => ({ ...r, education: moveItem(r.education, idx, idx + delta) }));
    }
  }
});
</script>
