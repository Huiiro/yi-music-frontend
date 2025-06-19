<!-- 音量控制组件 -->
<script setup lang="ts">
import {computed} from 'vue'
import {usePlayStore} from '@/store/play'

const playStore = usePlayStore()

const volumeIcon = computed(() => {
  const vol = playStore.muted ? 0 : playStore.volume
  if (vol === 0) return 'volume-volume-mute'
  if (vol <= 30) return 'volume-volume-low'
  if (vol <= 70) return 'volume-volume-middle'
  return 'volume-volume-high'
})

// 滑块显示值，静音时显示0
const sliderValue = computed({
  get: () => (playStore.muted ? 0 : playStore.volume),
  set: (val: number) => {
    playStore.setVolume(val)
    if (val === 0) {
      playStore.setMuted(true)
    } else {
      playStore.setMuted(false)
    }
  }
})

// 点击图标切换静音
const toggleMute = () => {
  playStore.toggleMute()
}
</script>

<template>
  <div class="flex items-center gap-2">
    <svgIcon
        :name="volumeIcon"
        class="w-6 h-6 cursor-pointer text-white hover:text-primary"
        @click="toggleMute"
    />
    <input
        type="range"
        min="0"
        max="100"
        step="1"
        :value="sliderValue"
        @input="playStore.setVolume(parseInt((($event.target as HTMLInputElement)?.value || '0')))"
        class="w-24 h-1 rounded bg-bg-light accent-primary cursor-pointer"
    />
  </div>
</template>
