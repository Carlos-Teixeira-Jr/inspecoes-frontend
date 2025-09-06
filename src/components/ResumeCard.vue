<template>
  <div :class="['p-4 shadow rounded', bgClass]">
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <p class="text-2xl font-bold" :class="textClass">{{ value }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ResumoCard',
  props: {
    title: { type: String, required: true },
    value: { type: [Number, String], required: true },
    color: { type: String, default: 'blue' }, // 'blue', 'green', 'yellow', 'red'
  },
  computed: {
    bgClass(): string {
      return 'bg-white'; // todos os cards com bg branco, pode parametrizar se quiser
    },
    textClass(): string {
      const map: Record<string, string> = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        yellow: 'text-yellow-600',
        red: 'text-red-600'
      };
      return map[this.color] || 'text-blue-600';
    }
  }
});
</script>
