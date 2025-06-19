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

// 格式化按键
const normalizeKey = (e: KeyboardEvent): string => {
  const keys: string[] = []

  if (e.ctrlKey) keys.push('ctrl')
  if (e.altKey) keys.push('alt')
  if (e.metaKey) keys.push('meta')
  if (e.shiftKey) keys.push('shift')

  const mainKey = e.key.toLowerCase()

  const modifierKeys = ['control', 'shift', 'alt', 'meta']
  if (modifierKeys.includes(mainKey) && keys.length === 1) return ''

  keys.push(mainKey)
  return keys.join('+')
}

// 监听按键事件
const handleKeyDown = (e: KeyboardEvent) => {
  const keyCombo = normalizeKey(e)
  if (!keyCombo) return

  const { shortcutKeys } = settingsStore
  const matched = Object.entries(shortcutKeys).find(([_, v]) => v === keyCombo)

  const actions: Record<string, () => void> = {
    play: playStore.togglePlay,
    prev: playStore.prevTrack,
    next: playStore.nextTrack,
    it: playStore.increaseTime,
    dt: playStore.decreaseTime,
    iv: playStore.increaseVolume,
    dv: playStore.decreaseVolume,
    tp: playStore.togglePlayMode,
  }

  if (matched) {
    const [action] = matched
    const fn = actions[action]
    if (fn) {
      fn()
      e.preventDefault()
    }
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
