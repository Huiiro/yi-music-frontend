<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from 'vue'
import {useAppStore} from '@/store/app'
import {useSidebarStore} from '@/store/sidebar'
import {usePlayStore} from '@/store/play'
import {useSettingsStore} from '@/store/settings'

const appStore = useAppStore()
const sidebarStore = useSidebarStore()
const playStore = usePlayStore()
const settingsStore = useSettingsStore()
const isSmallScreen = ref(appStore.isSmallScreen)

// 监听窗口宽度变化，动态切换侧边栏显示和按钮显示
const onResize = () => {
  appStore.updateScreenSize()

  const small = window.innerWidth < 768
  if (small !== isSmallScreen.value) {
    isSmallScreen.value = small

    if (small) {
      sidebarStore.toggleVisibility(false)
      sidebarStore.setWidth(0)
    } else {
      sidebarStore.toggleVisibility(true)
      sidebarStore.setWidth(sidebarStore.defaultWidth)
    }
  }
}

// 监听键盘快捷键事件
const handleKeyDown = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase()
  const { shortcutKeys } = settingsStore

  switch (key) {
    case shortcutKeys.play:
      playStore.togglePlay()
      break
    case shortcutKeys.prev:
      playStore.prevTrack()
      break
    case shortcutKeys.next:
      playStore.nextTrack()
      break
    case shortcutKeys.iv:
      playStore.increaseVolume()
      break
    case shortcutKeys.dv:
      playStore.decreaseVolume()
      break
    case shortcutKeys.tp:
      playStore.togglePlayMode()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('resize', onResize)
  onResize()

  if (isSmallScreen.value) {
    sidebarStore.toggleVisibility(false)
    sidebarStore.setWidth(0)
  } else {
    sidebarStore.toggleVisibility(true)
    sidebarStore.setWidth(sidebarStore.defaultWidth)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component"/>
  </router-view>
</template>
