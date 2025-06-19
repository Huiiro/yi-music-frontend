<!-- 播放控制条组件 -->
<script setup lang="ts">
import {useAppStore} from '@/store/app'
import {useI18n} from 'vue-i18n'
import {formatTime} from '@/utils/time.ts'

const appStore = useAppStore()
const {t} = useI18n()

const props = defineProps<{
  currentTrack: {
    cover: string
    title: string
    artist: string
    duration: number
  }
  isPlaying: boolean
  currentTime: number
}>()

const emit = defineEmits<{
  (e: 'togglePlay'): void
  (e: 'prevTrack'): void
  (e: 'nextTrack'): void
  (e: 'progressChange', value: number): void
}>()

function onProgressChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = Number(target.value)
  emit('progressChange', value)
}
</script>

<template>
  <div class="w-full max-w-[32rem] mx-auto px-4" @click.stop>
    <div class="flex flex-col items-center">
      <div class="flex items-center gap-6 mb-1">
        <button @click.stop="$emit('prevTrack')" :aria-label="t('prev_track_alt')"
                class="text-white hover:text-primary transition bg-no-transition">
          <svgIcon name="play-prev" :class-name="appStore.isSmallScreen ? 'w-5 h-5' : 'w-4 h-4 icon'"/>
        </button>
        <button @click.stop="$emit('togglePlay')" :aria-label="t('play_pause_alt')"
                class="text-white hover:text-primary transition bg-no-transition">
          <svgIcon v-if="isPlaying" name="play-pause" :class-name="appStore.isSmallScreen ? 'w-10 h-10' : 'w-8 h-8 icon'"/>
          <svgIcon v-else name="play-play" :class-name="appStore.isSmallScreen ? 'w-10 h-10' : 'w-8 h-8 icon'"/>
        </button>
        <button @click.stop="$emit('nextTrack')" :aria-label="t('next_track_alt')"
                class="text-white hover:text-primary transition bg-no-transition">
          <svgIcon name="play-next" :class-name="appStore.isSmallScreen ? 'w-5 h-5' : 'w-4 h-4 icon'"/>
        </button>
      </div>

      <input
          type="range"
          min="0"
          :max="props.currentTrack.duration"
          step="1"
          :value="props.currentTime"
          @change="onProgressChange"
          class="w-full h-1 rounded bg-bg-light accent-primary cursor-pointer"
          :class="appStore.isSmallScreen ? 'mt-3.5' : 'mt-0.5'"
      />

      <div class="w-full flex justify-between text-xs text-white dark:text-gray-400 mt-0.5 select-none">
        <span>{{ formatTime(props.currentTime) }}</span>
        <span>{{ formatTime(props.currentTrack.duration) }}</span>
      </div>
    </div>
  </div>
</template>
