<script setup lang="ts">
defineProps<{
  label: string
  description?: string
}>()
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 hover:bg-bg-light">
    <div class="text-sm text-text">
      <div class="font-medium">{{ label }}</div>
      <div class="text-xs" v-if="description">{{ description }}</div>
    </div>

    <slot name="control" />
  </div>
</template>
