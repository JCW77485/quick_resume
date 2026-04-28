<template>
  <SectionCard title="Projects">
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
        v-for="(p, idx) in resume.projects"
        :key="p.id"
        :title="p.name || 'New project'"
        :subtitle="p.link"
        :default-open="!p.name"
        :has-delete="true"
        @delete="remove(idx)"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <TextInput
              :model-value="p.name"
              placeholder="Open Pricing Table"
              @update:model-value="setItem(idx, { name: $event })"
            />
          </Field>
          <Field label="Link">
            <TextInput
              :model-value="p.link"
              placeholder="github.com/you/project"
              @update:model-value="setItem(idx, { link: $event })"
            />
          </Field>
        </div>
        <Field label="Description">
          <TextArea
            :model-value="p.description"
            placeholder="What it does and why it matters."
            :rows="2"
            @update:model-value="setItem(idx, { description: $event })"
          />
        </Field>
        <div>
          <div class="mb-1 text-xs font-medium text-slate-600">
            Highlights
          </div>
          <div class="space-y-2">
            <div
              v-for="(b, bi) in p.bullets"
              :key="bi"
              class="flex gap-2"
            >
              <TextArea
                :model-value="b"
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
      <Plus :size="14" /> Add project
    </button>
  </SectionCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { ProjectItem, Resume } from '../../../types/resume';
import { uid } from '../../../lib/uid';
import Field from '../Field.vue';
import TextInput from '../TextInput.vue';
import TextArea from '../TextArea.vue';
import SectionCard from '../SectionCard.vue';
import ItemCard from '../ItemCard.vue';

export default defineComponent({
  name: 'ProjectsSection',
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
      const item: ProjectItem = {
        id: uid(),
        name: "",
        link: "",
        description: "",
        bullets: [],
      };
      this.$emit('update', (r: Resume) => ({ ...r, projects: [...r.projects, item] }));
    },
    setItem(idx: number, patch: Partial<ProjectItem>) {
      this.$emit('update', (r: Resume) => ({
        ...r,
        projects: r.projects.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
      }));
    },
    remove(idx: number) {
      this.$emit('update', (r: Resume) => ({ ...r, projects: r.projects.filter((_, i) => i !== idx) }));
    },
    updateBullet(idx: number, bi: number, val: string) {
      const bullets = [...this.resume.projects[idx].bullets];
      bullets[bi] = val;
      this.setItem(idx, { bullets });
    },
    removeBullet(idx: number, bi: number) {
      const bullets = this.resume.projects[idx].bullets.filter((_, i) => i !== bi);
      this.setItem(idx, { bullets });
    },
    addBullet(idx: number) {
      const bullets = [...this.resume.projects[idx].bullets, ""];
      this.setItem(idx, { bullets });
    }
  }
});
</script>
