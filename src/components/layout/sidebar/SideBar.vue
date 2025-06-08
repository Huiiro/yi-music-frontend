<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import SidebarItem from './SidebarItem.vue';
import {useSidebarStore} from "@/store/sidebar";
import homeIcon from '@/assets/svg/menu/home.svg';
import library from '@/assets/svg/menu/library.svg';
import list from '@/assets/svg/menu/list.svg';
import more from '@/assets/svg/menu/more-horizontal.svg';
import settings from '@/assets/svg/menu/settings.svg';
import history from '@/assets/svg/menu/history.svg';
import musicIcon from '@/assets/svg/menu/song.svg';
import artistIcon from '@/assets/svg/menu/artist.svg';
import albumIcon from '@/assets/svg/menu/album.svg';

const sidebarStore = useSidebarStore();

const router = useRouter();
const route = useRoute();

const defaultWidth = sidebarStore.defaultWidth;
let isResizing = false;

//Data
const sectionA = [
  {title: '歌曲', path: '/song', icon: musicIcon},
  {title: '歌手', path: '/artist', icon: artistIcon},
  {title: '专辑', path: '/album', icon: albumIcon},
];

const sectionB = ref<{ title: string; path: string }[]>([]);
const sectionC = ref<{ title: string; path: string }[]>([]);
const sectionD = [
  {title: '播放历史', path: '/history', icon: history},
  {title: '设置', path: '/settings', icon: settings},
];

//@ts-ignore
function startResize(e: MouseEvent) {
  isResizing = true;
  document.body.style.cursor = 'col-resize';
}

function stopResize() {
  isResizing = false;
  document.body.style.cursor = '';
}

function handleMouseMove(e: MouseEvent) {
  if (isResizing) {
    const newWidth = Math.min(Math.max(e.clientX, defaultWidth), window.innerWidth / 2);
    sidebarStore.setWidth(newWidth);
  }
}

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/');
}

function handleClick(path: string) {
  if (route.path !== path) {
    router.push(path);
  }
  sidebarStore.setActivePath(path);
}

async function fetchLibrary() {
  // 模拟API请求
  // TODO
  sectionB.value = [
    {title: '曲库 A', path: '/library/a'},
    {title: '曲库 B', path: '/library/b'},
    {title: '曲库 C', path: '/library/c'},
  ];
  sectionC.value = [
    {title: '歌单 A', path: '/playlist/1'},
    {title: '歌单 B', path: '/playlist/2'},
    {title: '歌单 C', path: '/playlist/3'},
    {title: '歌单 D', path: '/playlist/4'},
    {title: '歌单 E', path: '/playlist/5'},
    {title: '歌单 F', path: '/playlist/6'},
  ];
}

onMounted(() => {
  fetchLibrary();
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', stopResize);
  sidebarStore.setActivePath(route.path);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', stopResize);
});
</script>

<template>
  <transition name="slide">
    <aside
        class="h-full bg-gray-900 text-white overflow-y-auto overflow-x-hidden relative select-none transform"
        :class="[
                  sidebarStore.visible ? 'translate-x-0' : '-translate-x-full',
                  isResizing ? '': 'transition-all duration-300 ease-in-out'
                ]"
        :style="{ width: `${sidebarStore.width}px`, padding: sidebarStore.visible ? '1rem' : '0' }"
    >

      <!-- Resize Handle -->
      <div
          class="absolute top-0 right-0 h-full w-1 bg-transparent cursor-col-resize"
          @mousedown="startResize"
      ></div>

      <!-- Section A -->
      <div>
        <h2 class="flex items-center gap-1 text-sm text-gray-400 mb-2">
          <img :src="homeIcon" alt="" class="w-4 h-4"/>
          <span>开始</span>
        </h2>
        <ul class="space-y-1 text-sm">
          <li
              v-for="item in sectionA"
              :key="item.title"
              @click="handleClick(item.path)"
              :class="[
        'rounded px-2 py-2 cursor-pointer flex items-center gap-2',
        isActive(item.path) ? 'bg-blue-600' : 'hover:bg-blue-800'
      ]"
          >
            <img :src="item.icon" alt="" class="w-4 h-4"/>
            <span>{{ item.title }}</span>
          </li>
        </ul>
        <hr class="border-t border-gray-700 my-4"/>
      </div>

      <!-- Section B -->
      <div>
        <h2 class="flex items-center gap-1 text-sm text-gray-400 mb-2">
          <img :src="library" alt="" class="w-4 h-4"/>
          <span>曲库</span>
        </h2>
        <ul class="space-y-1">
          <li v-for="item in sectionB" :key="item.title">
            <SidebarItem :title="item.title" :active="isActive(item.path)" @click="handleClick(item.path)"/>
          </li>
        </ul>
        <hr class="border-t border-gray-700 my-4"/>
      </div>

      <!-- Section C -->
      <div>
        <h2 class="flex items-center gap-1 text-sm text-gray-400 mb-2">
          <img :src="list" alt="" class="w-4 h-4"/>
          <span>歌单</span>
        </h2>
        <ul class="space-y-1">
          <li v-for="item in sectionC" :key="item.title">
            <SidebarItem :title="item.title" :active="isActive(item.path)" @click="handleClick(item.path)"/>
          </li>
        </ul>
        <hr class="border-t border-gray-700 my-4"/>
      </div>

      <!-- Section D -->
      <div>
        <h2 class="flex items-center gap-1 text-sm text-gray-400 mb-2">
          <img :src="more" alt="" class="w-4 h-4"/>
          <span>更多</span>
        </h2>
        <ul class="space-y-1 text-sm">
          <li
              v-for="item in sectionD"
              :key="item.title"
              @click="handleClick(item.path)"
              :class="[
        'rounded px-2 py-2 cursor-pointer flex items-center gap-2',
        isActive(item.path) ? 'bg-blue-600' : 'hover:bg-blue-800'
      ]"
          >
            <img :src="item.icon" alt="" class="w-4 h-4"/>
            <span>{{ item.title }}</span>
          </li>
        </ul>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.sidebar {
  transition: width 0.3s ease-in-out;
  overflow-x: hidden;
  min-width: 0;
}

aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>
