<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {ElMessage} from 'element-plus'
import {CONSTANTS} from '@/plugins/consts.ts'
import {useRoute, useRouter} from 'vue-router'
import {useAppStore} from '@/store/app'
import {useSidebarStore} from '@/store/sidebar'
import {useI18n} from 'vue-i18n'
import {createSongListApi, getSongListCollection} from '@/api/songList.ts'
import {createLibraryApi, getLibraryCollection} from '@/api/library.ts'
import type {LibraryEntity, SongListEntity} from '@/api/interface.ts'

import SidebarItem from './SidebarItem.vue'
import CreateSongListDialog from '@/components/layout/sidebar/dialog/CreateSongListDialog.vue'
import CreateLibraryDialog from '@/components/layout/sidebar/dialog/CreateLibraryDialog.vue'

const appStore = useAppStore()
const sidebarStore = useSidebarStore()
const router = useRouter()
const route = useRoute()
const {t} = useI18n()

const defaultWidth = sidebarStore.defaultWidth
let isResizing = false

//Data
const sectionA = computed(() => [
  {title: t('song'), path: '/song', icon: 'menu-song'},
  {title: t('artist'), path: '/artist', icon: 'menu-artist'},
  {title: t('album'), path: '/album', icon: 'menu-album'},
])
const sectionB = ref<{ title: string; path: string; cover: string }[]>([])
const sectionC = ref<{ title: string; path: string; cover: string }[]>([])
const sectionD = computed(() => [
  {title: t('history'), path: '/history', icon: 'menu-history'},
  {title: t('settings'), path: '/settings', icon: 'menu-settings'},
])

//@ts-ignore
const startResize = (e: MouseEvent) => {
  isResizing = true
  document.body.style.cursor = 'col-resize'
}

const stopResize = () => {
  isResizing = false
  document.body.style.cursor = ''
}

const handleMouseMove = (e: MouseEvent) => {
  if (isResizing) {
    const newWidth = Math.min(Math.max(e.clientX, defaultWidth), window.innerWidth / 2)
    sidebarStore.setWidth(newWidth)
  }
}

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleClick = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
  sidebarStore.setActivePath(path)
}

const fetchLibrary = async () => {
  const libraryData = await getLibraryCollection()
  sectionB.value = libraryData.data.map((item: any) => ({
    title: item.libraryName,
    path: `/library/${item.libraryId}`
  }))
}

const fetchSongList = async () => {
  const songListData = await getSongListCollection()
  sectionC.value = songListData.data.map((item: any) => ({
    title: item.songListName,
    path: `/playlist/${item.songListId}`,
    cover: item.songListCover,
  }))
}

const songListDialogVisible = ref(false)
const libraryDialogVisible = ref(false)

const handleCreateSongList = async (name: string) => {
  let songListEntity = {
    songListName: name
  } as SongListEntity
  const result = await createSongListApi(songListEntity)
  if (result.code === 0) {
    ElMessage({
      message: t('create_song_list_success'),
      type: 'success',
      plain: true,
      duration: CONSTANTS.MESSAGE_BOX_DURATION_SHORT,
    })
    await fetchSongList()
  }
}

const handleCreateLibrary = async (name: string) => {
  let libraryEntity = {
    libraryName: name
  } as LibraryEntity
  const result = await createLibraryApi(libraryEntity)
  if (result.code === 0) {
    ElMessage({
      message: t('create_library_success'),
      type: 'success',
      plain: true,
      duration: CONSTANTS.MESSAGE_BOX_DURATION_SHORT,
    })
    await fetchLibrary()
  }
}

onMounted(() => {
  fetchLibrary()
  fetchSongList()
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', stopResize)
  sidebarStore.setActivePath(route.path)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', stopResize)
})

watch(
    () => appStore.shouldReloadPlaylist,
    async (val) => {
      if (val) {
        await fetchSongList()
        appStore.markBReloaded()
      }
    }
)
</script>

<template>

  <!-- 创建曲库 -->
  <CreateLibraryDialog
      v-model="libraryDialogVisible"
      @confirm="handleCreateLibrary"
  />
  <!-- 创建歌单 -->
  <CreateSongListDialog
      v-model="songListDialogVisible"
      @confirm="handleCreateSongList"
  />

  <transition name="slide">
    <aside
        class="h-full text-text no-bg-transition overflow-y-auto overflow-x-hidden relative select-none"
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
      />

      <!-- Section A -->
      <div>
        <h2 class="flex items-center gap-1 text-sm mb-2">
          <svgIcon name="menu-home" class-name="w-4 h-4 icon"/>
          <span class="text-text-light"> {{ t('menu_start') }}</span>
        </h2>
        <ul class="space-y-1 text-sm">
          <li
              v-for="item in sectionA"
              :key="item.title"
              @click="handleClick(item.path)"
              :class="[
                'rounded px-2 py-2 cursor-pointer flex items-center gap-2',
                isActive(item.path) ? 'bg-menu-active' : 'hover:bg-menu-hover'
              ]"
          >
            <svgIcon :name="item.icon" class-name="w-4 h-4 icon"/>
            <span>{{ item.title }}</span>
          </li>
        </ul>
        <hr class="border-t border-border my-4"/>
      </div>

      <!-- Section B -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <h2 class="flex items-center gap-1 text-sm">
            <svgIcon name="menu-library" class-name="w-4 h-4 icon"/>
            <span class="text-text-light"> {{ t('menu_library') }} </span>
          </h2>
          <svgIcon name="common-plus"
                   class="cursor-pointer hover:text-primary"
                   class-name="w-4 h-4 icon"
                   @click="libraryDialogVisible = true"/>
        </div>
        <ul class="space-y-1">
          <li v-for="item in sectionB" :key="item.title">
            <SidebarItem :title="item.title"
                         :active="isActive(item.path)"
                         :image="item.cover"
                         @click="handleClick(item.path)"/>
          </li>
        </ul>
        <hr class="border-t border-border my-4"/>
      </div>

      <!-- Section C -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <h2 class="flex items-center gap-1 text-sm">
            <svgIcon name="menu-list" class-name="w-4 h-4 icon"/>
            <span class="text-text-light"> {{ t('menu_songList') }}</span>
          </h2>
          <svgIcon name="common-plus"
                   class="cursor-pointer hover:text-primary"
                   class-name="w-4 h-4 icon"
                   @click="songListDialogVisible = true"/>
        </div>
        <ul class="space-y-1">
          <li v-for="item in sectionC" :key="item.title">
            <SidebarItem :title="item.title"
                         :active="isActive(item.path)"
                         :image="item.cover"
                         @click="handleClick(item.path)"/>
          </li>
        </ul>
        <hr class="border-t border-border my-4"/>
      </div>

      <!-- Section D -->
      <div>
        <h2 class="flex items-center gap-1 text-text-light text-sm mb-2">
          <svgIcon name="menu-more-horizontal" class-name="w-4 h-4 icon"/>
          <span class="text-text-light"> {{ t('menu_more') }}</span>
        </h2>
        <ul class="space-y-1 text-sm">
          <li
              v-for="item in sectionD"
              :key="item.title"
              @click="handleClick(item.path)"
              :class="[
                'rounded px-2 py-2 cursor-pointer flex items-center gap-2',
                isActive(item.path) ? 'bg-menu-active' : 'hover:bg-menu-hover'
              ]"
          >
            <svgIcon :name="item.icon" class-name="w-4 h-4 icon"/>
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
