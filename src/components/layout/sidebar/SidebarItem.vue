<!-- 侧边栏组件 -->
<script setup lang="ts">
import defaultCover from '@/assets/svg/default/default-cover.svg'

const props = defineProps<{
  title: string
  image?: string
  active?: boolean
}>()

</script>

<template>
  <div
      class="no-bg-transition"
      :class="[
      'flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition',
      props.active ? 'bg-menu-active' : 'hover:bg-menu-hover'
    ]"
  >
    <img
        :src="props.image ? props.image : defaultCover"
        class="w-6 h-6 rounded object-cover bg-gray-800"
        alt=""
    />
    <span class="text-sm truncate">{{ props.title }}</span>
  </div>
</template>

