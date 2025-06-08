<template>
  <div
      class="px-4 py-1.5 hover:bg-gray-700 cursor-pointer flex items-center gap-x-2 text-sm"
      @click="handleClick"
  >
    <img :src="icon" :alt="label" class="w-4 h-4" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  emit('click')
}
</script>
