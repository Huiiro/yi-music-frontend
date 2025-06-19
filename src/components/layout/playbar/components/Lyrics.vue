<!-- 歌词组件 -->
<script setup lang="ts">
import {ref, watch, computed, watchEffect} from 'vue'
import {usePlayStore} from '@/store/play'
import {useUIStore} from "@/store/ui"
import {findCurrentLineIndex} from '@/utils/lyricParser.ts'

const playStore = usePlayStore()
const uiStore = useUIStore()

const lyrics = computed(() => playStore.currentTrack.lrc || [])
const currentTime = computed(() => playStore.currentTime)
const currentLyricIndex = computed(() =>
    findCurrentLineIndex(lyrics.value, currentTime.value)
)

const lyricContainer = ref<HTMLDivElement | null>(null)
const lyricLineRefs = ref<HTMLElement[]>([])

const setLyricRef = (el: Element | any, index: number) => {
  if (el instanceof HTMLElement) {
    lyricLineRefs.value[index] = el
  }
}

const scrollToCurrentLyric = (index: number) => {
  const lineEl = lyricLineRefs.value[index]
  const container = lyricContainer.value
  if (lineEl && container) {
    const offsetTop = lineEl.offsetTop
    const containerHeight = container.clientHeight
    const lineHeight = lineEl.clientHeight

    container.scrollTo({
      top: offsetTop - containerHeight / 2 + lineHeight / 2,
      behavior: 'smooth',
    })
  }
}

// 监听歌词索引
watch(currentLyricIndex, (newIndex) => {
  scrollToCurrentLyric(newIndex)
})

// 监听用户事件 触发时高亮行自动局中
watchEffect(() => {
  const mode = uiStore.displayMode
  const fontSize = uiStore.lyricFontSizeIndex
  console.debug(`watch: playMode ${mode}, fontSieMode ${fontSize}`)
  scrollToCurrentLyric(currentLyricIndex.value)
})
</script>

<template>
  <div ref="lyricContainer" class="overflow-auto h-full lyric-scroll">

    <!-- 顶部留白区域 -->
    <div class="h-[40%] shrink-0"/>

    <!-- 歌词内容区域 -->
    <div class="w-full">
      <div
          v-for="(line, index) in lyrics"
          :key="index"
          :ref="el => setLyricRef(el, index)"
          :class="[
      'text-center transition-all duration-300',
      uiStore.lyricLeadingClass,
      index === currentLyricIndex
        ? ['text-white font-bold', uiStore.highlightFontSizeClass]
        : ['text-gray-400', uiStore.lyricFontSizeClass]
    ]"
      >
        {{ line.text }}
      </div>
    </div>

    <!-- 底部留白区域 -->
    <div class="h-[40%] shrink-0"/>
  </div>
</template>

<style scoped>
.lyric-scroll::-webkit-scrollbar {
  width: 6px;
}

.lyric-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.lyric-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.lyric-scroll:hover::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.4);
}

.lyric-scroll::-webkit-scrollbar-thumb:active {
  background-color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .lyric-scroll::-webkit-scrollbar {
    display: none;
  }
}
</style>
