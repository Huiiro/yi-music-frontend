<!-- 侧边栏组件 -->
<script setup lang="ts">
import defaultCover from '@/assets/svg/default/default-cover.svg';

const props = defineProps<{
  title: string;
  image?: string;
  active?: boolean;
}>();

</script>

<template>
  <div
      :class="[
      'flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition',
      props.active ? 'bg-blue-600' : 'hover:bg-blue-800'
    ]"
  >
    <img
        :src="props.image ? props.image : defaultCover"
        class="w-8 h-8 rounded object-cover bg-gray-800"
        alt=""
    />
    <span class="text-sm truncate">{{ props.title }}</span>
  </div>
</template>

