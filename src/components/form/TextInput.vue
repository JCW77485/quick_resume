<template>
  <input
    v-bind="$attrs"
    :value="modelValue"
    class="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TextInput',
<<<<<<< Updated upstream
  props: {
    modelValue: { type: String, default: '' }
  },
=======
  props: ['modelValue'],
>>>>>>> Stashed changes
  emits: ['update:modelValue']
});
</script>
