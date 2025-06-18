<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="mb-6 rounded-xl border border-gray-700 bg-gray-800">
    <div class="px-4 py-2 text-xs text-gray-400 bg-gray-900 rounded-t-xl">
      {{ title }}
    </div>

    <div class="divide-y divide-gray-700">
      <slot/>
    </div>
  </div>
</template>
