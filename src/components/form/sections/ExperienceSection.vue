<template>
  <SectionCard
    title="Work experience"
    subtitle="Roles, companies, and achievements"
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
      <ItemCard
        v-for="(e, idx) in resume.experience"
        :key="e.id"
        :title="e.role || 'New role'"
        :subtitle="e.company"
        :default-open="!e.role && !e.company"
        :has-move-up="idx > 0"
        :has-move-down="idx < resume.experience.length - 1"
        :has-delete="true"
        @move-up="move(idx, -1)"
        @move-down="move(idx, 1)"
        @delete="remove(idx)"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <Field label="Role">
            <TextInput
              :model-value="e.role"
              placeholder="Senior Software Engineer"
              @update:model-value="setItem(idx, { role: $event })"
            />
          </Field>
          <Field label="Company">
            <TextInput
              :model-value="e.company"
              placeholder="Northwind Labs"
              @update:model-value="setItem(idx, { company: $event })"
            />
          </Field>
          <Field label="Location">
            <TextInput
              :model-value="e.location"
              placeholder="Remote"
              @update:model-value="setItem(idx, { location: $event })"
            />
          </Field>
          <div class="flex items-end gap-2">
            <Field
              label="Start"
              class="flex-1"
            >
              <TextInput
                :model-value="e.startDate"
                placeholder="Mar 2022"
                @update:model-value="setItem(idx, { startDate: $event })"
              />
            </Field>
            <Field
              label="End"
              class="flex-1"
            >
              <TextInput
                :model-value="e.endDate"
                placeholder="Present"
                :disabled="e.current"
                @update:model-value="setItem(idx, { endDate: $event })"
              />
            </Field>
          </div>
        </div>
        <label class="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            :checked="e.current"
            @change="toggleCurrent(idx, ($event.target as HTMLInputElement).checked)"
          >
          I currently work here
        </label>
        <div>
          <div class="mb-1 text-xs font-medium text-slate-600">
            Highlights
          </div>
          <div class="space-y-2">
            <div
              v-for="(b, bi) in e.bullets"
              :key="bi"
              class="flex gap-2"
            >
              <TextArea
                :model-value="b"
                placeholder="Started with an action verb..."
                :rows="2"
                @update:model-value="updateBullet(idx, bi, $event)"
              />
              <button
                type="button"
                class="self-start rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                @click="removeBullet(idx, bi)"
              >
                Remove
              </button>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline"
              @click="addBullet(idx)"
            >
              <Plus :size="12" /> Add bullet
            </button>
          </div>
        </div>
      </ItemCard>
    </div>

    <button
      type="button"
      class="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700"
      @click="add"
    >
      <Plus :size="14" /> Add experience
    </button>
  </SectionCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { ExperienceItem, Resume } from '../../../types/resume';
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
  name: 'ExperienceSection',
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
      const item: ExperienceItem = {
        id: uid(),
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        bullets: [""],
      };
      this.$emit('update', (r: Resume) => ({ ...r, experience: [...r.experience, item] }));
    },
    setItem(idx: number, patch: Partial<ExperienceItem>) {
      this.$emit('update', (r: Resume) => ({
        ...r,
        experience: r.experience.map((e, i) => (i === idx ? { ...e, ...patch } : e)),
      }));
    },
    remove(idx: number) {
      this.$emit('update', (r: Resume) => ({ ...r, experience: r.experience.filter((_, i) => i !== idx) }));
    },
    move(idx: number, delta: number) {
      this.$emit('update', (r: Resume) => ({ ...r, experience: moveItem(r.experience, idx, idx + delta) }));
    },
    toggleCurrent(idx: number, checked: boolean) {
      const item = this.resume.experience[idx];
      this.setItem(idx, { current: checked, endDate: checked ? "" : item.endDate });
    },
    updateBullet(idx: number, bi: number, val: string) {
      const bullets = [...this.resume.experience[idx].bullets];
      bullets[bi] = val;
      this.setItem(idx, { bullets });
    },
    removeBullet(idx: number, bi: number) {
      const bullets = this.resume.experience[idx].bullets.filter((_, i) => i !== bi);
      this.setItem(idx, { bullets });
    },
    addBullet(idx: number) {
      const bullets = [...this.resume.experience[idx].bullets, ""];
      this.setItem(idx, { bullets });
    }
  }
});
</script>
