<!-- 歌曲信息组件 -->
<script setup lang="ts">
const props = defineProps<{
  cover: string
  title: string
  artist: string
}>()
</script>

<template>
  <div class="flex items-center gap-3 min-w-[220px] z-10">
    <img
        :src="props.cover"
        alt=""
        class="w-12 h-12 rounded object-cover bg-bg-light"
    />
    <div class="truncate">
      <div class="font-semibold text-white truncate">{{ props.title }}</div>
      <div class="text-xs text-gray-200 truncate">{{ props.artist }}</div>
    </div>
  </div>
</template>
