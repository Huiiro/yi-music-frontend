<script setup lang="ts">
defineProps<{
  label: string
  description?: string
}>()
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3">
    <div class="text-sm">
      <div class="font-medium">{{ label }}</div>
      <div class="text-xs text-gray-400" v-if="description">{{ description }}</div>
    </div>

    <slot name="control" />
  </div>
</template>
