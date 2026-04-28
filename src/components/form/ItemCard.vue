<template>
  <div class="rounded-md border border-slate-200 bg-slate-50">
    <div class="flex items-center gap-2 px-3 py-2">
      <button
        type="button"
        class="flex flex-1 items-center gap-2 text-left"
        @click="open = !open"
      >
        <component
          :is="open ? 'ChevronUp' : 'ChevronDown'"
          :size="14"
          class="text-slate-400"
        />
        <div class="min-w-0">
          <div class="truncate text-sm font-medium text-slate-900">
            {{ title || "(untitled)" }}
          </div>
          <div
            v-if="subtitle"
            class="truncate text-xs text-slate-500"
          >
            {{ subtitle }}
          </div>
        </div>
      </button>
      <button
        v-if="hasMoveUp"
        type="button"
        title="Move up"
        class="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700"
        @click="$emit('move-up')"
      >
        <ArrowUp :size="14" />
      </button>
      <button
        v-if="hasMoveDown"
        type="button"
        title="Move down"
        class="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700"
        @click="$emit('move-down')"
      >
        <ArrowDown :size="14" />
      </button>
      <button
        v-if="hasDelete"
        type="button"
        title="Delete"
        class="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
        @click="$emit('delete')"
      >
        <Trash2 :size="14" />
      </button>
    </div>
    <div
      v-if="open"
      class="space-y-3 border-t border-slate-200 bg-white px-3 py-3"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ChevronDown, ChevronUp, Trash2, ArrowUp, ArrowDown } from 'lucide-vue-next';

export default defineComponent({
  name: 'ItemCard',
  components: {
    ChevronDown,
    ChevronUp,
    Trash2,
    ArrowUp,
    ArrowDown
  },
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    defaultOpen: { type: Boolean, default: false },
    hasMoveUp: { type: Boolean, default: false },
    hasMoveDown: { type: Boolean, default: false },
    hasDelete: { type: Boolean, default: false }
  },
  emits: ['move-up', 'move-down', 'delete'],
  data() {
    return {
      open: this.defaultOpen
    };
  }
});
</script>
