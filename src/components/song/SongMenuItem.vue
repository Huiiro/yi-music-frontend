<!-- 歌曲菜单栏组件 -->
<script setup lang="ts">
defineProps<{
  icon: string
  label: string
}>()

const emit = defineEmits<{
  (e: 'click'): void,
}>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <div
      class="px-4 py-1.5 hover:bg-hover cursor-pointer flex items-center gap-x-2 text-sm"
      @click="handleClick"
  >
    <svgIcon :name="icon" class-name="w-4 h-4 icon"/>
    <span>{{ label }}</span>
  </div>
</template>
