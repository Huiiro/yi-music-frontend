<script setup lang="ts">
import {watch} from 'vue';
import {useRoute} from 'vue-router';
import {useSidebarStore} from '@/store/sidebar';
import {useAppStore} from "@/store/app";

const sidebarStore = useSidebarStore();
const appStore = useAppStore();
const route = useRoute();

// 展开，收起侧边栏
function toggleSidebar() {
  sidebarStore.toggleVisibility();
  if (sidebarStore.visible) {
    sidebarStore.setWidth(sidebarStore.defaultWidth);
  } else {
    sidebarStore.setWidth(0);
  }
}

// 监听路由变化，移动端点击路由后自动收起侧边栏
watch(() => route.path, () => {
  if (appStore.isSmallScreen) {
    sidebarStore.toggleVisibility(false);
    sidebarStore.setWidth(0);
  }
});

</script>

<template>
  <header class="h-12 bg-gray-800 flex items-center px-4 text-white">
    <button v-if="appStore.isSmallScreen" class="mr-4" @click="toggleSidebar">☰</button>
    <h1 class="text-lg font-bold"> {{ appStore.logoText }} </h1>
  </header>
</template>


