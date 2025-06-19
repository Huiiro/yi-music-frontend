<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="mb-6 rounded-xl border border-border bg-bg">
    <div class="px-4 py-2 text-xs text-text bg-bg-light rounded-t-xl">
      {{ title }}
    </div>

    <div class="divide-y divide-border">
      <slot/>
    </div>
  </div>
</template>
