<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from 'vue';
import {useAppStore} from '@/store/app';
import {useSidebarStore} from "@/store/sidebar";

const sidebarStore = useSidebarStore();
const appStore = useAppStore();
const isSmallScreen = ref(appStore.isSmallScreen);

// 监听窗口宽度变化，动态切换侧边栏显示和按钮显示
function onResize() {
  appStore.updateScreenSize();

  const small = window.innerWidth < 768;
  if (small !== isSmallScreen.value) {
    isSmallScreen.value = small;

    if (small) {
      sidebarStore.toggleVisibility(false);
      sidebarStore.setWidth(0);
    } else {
      sidebarStore.toggleVisibility(true);
      sidebarStore.setWidth(sidebarStore.defaultWidth);
    }
  }
}

onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize();

  // 页面加载时，根据屏幕宽度初始化侧边栏状态
  if (isSmallScreen.value) {
    sidebarStore.toggleVisibility(false);
    sidebarStore.setWidth(0);
  } else {
    sidebarStore.toggleVisibility(true);
    sidebarStore.setWidth(sidebarStore.defaultWidth);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component"/>
  </router-view>
</template>
