<template>
  <div
    :data-print-target="printable ? 'true' : undefined"
    :class="['bg-white shadow-md', className]"
    :style="{
      width: '8.5in',
      minHeight: printable ? 'auto' : '11in',
      margin: '0 auto',
      boxSizing: 'border-box',
      overflow: printable ? 'visible' : 'hidden',
    }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ResumePage',
  props: {
    className: { type: String, default: '' },
    printable: { type: Boolean, default: false }
  }
});
</script>
