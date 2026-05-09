<template>
  <label :class="['flex flex-col gap-1', $attrs.class]">
    <span class="text-xs font-medium text-slate-600">{{ label }}</span>
    <slot />
    <span
      v-if="hint"
      class="text-xs text-slate-400"
    >{{ hint }}</span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Field',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    hint: { type: String, default: '' }
  }
});
</script>
