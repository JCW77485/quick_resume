<template>
  <div class="rounded-lg border border-slate-200 bg-white">
    <div class="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
      <button
        type="button"
        class="flex flex-1 items-center gap-2 text-left"
        @click="open = !open"
      >
        <component
          :is="open ? 'ChevronUp' : 'ChevronDown'"
          :size="16"
          class="text-slate-400"
        />
        <div>
          <div class="text-sm font-semibold text-slate-900">
            {{ title }}
          </div>
          <div
            v-if="subtitle"
            class="text-xs text-slate-500"
          >
            {{ subtitle }}
          </div>
        </div>
      </button>
      <div
        v-if="$slots.actions"
        class="flex items-center gap-1"
      >
        <slot name="actions" />
      </div>
    </div>
    <div
      v-if="open"
      class="space-y-3 px-4 py-4"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ChevronDown, ChevronUp } from 'lucide-vue-next';

export default defineComponent({
  name: 'SectionCard',
  components: {
    ChevronDown,
    ChevronUp
  },
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    defaultOpen: { type: Boolean, default: true }
  },
  data() {
    return {
      open: this.defaultOpen
    };
  }
});
</script>
