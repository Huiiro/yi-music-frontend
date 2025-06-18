<!-- 定时关闭组件 -->
<script setup lang="ts">
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {usePlayStore} from '@/store/play'
import {useSettingsStore} from '@/store/settings'
import {CONSTANTS} from '@/plugins/consts.ts'

const {t} = useI18n()
const playerStore = usePlayStore()
const settingsStore = useSettingsStore()

const showCustom = ref(false)
const endAfterCurrentSong = ref(settingsStore.endAfterCurrentSong)

// 单位：秒(s)
const remainingTime = ref(0)
let timer: number | undefined
let waitSongEnd = false

const formattedTime = computed(() => {
  const m = Math.floor(remainingTime.value / 60)
  const s = remainingTime.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

const startTimer = (minutes: number) => {
  const endAfterCurrent = endAfterCurrentSong.value
  settingsStore.setSleepTimer(minutes, endAfterCurrent)
  updateRemainingTime()
}

const cancelTimer = () => {
  settingsStore.cancelSleepTimer()
  remainingTime.value = 0
}

const updateRemainingTime = () => {
  const now = Date.now()
  const diff = Math.max(settingsStore.sleepTimerEndTime - now, 0)
  remainingTime.value = Math.floor(diff / 1000)
}

// 每秒检测是否该停止播放
const checkSleep = () => {
  if (!settingsStore.sleepTimerEnabled) return

  updateRemainingTime()

  if (remainingTime.value <= 0) {
    if (settingsStore.endAfterCurrentSong) {
      waitSongEnd = true
    } else {
      playerStore.pause()
      settingsStore.cancelSleepTimer()
    }
  }
}

watch(() => playerStore.currentTime, (time) => {
  if (
      waitSongEnd &&
      playerStore.currentTrack?.duration &&
      (playerStore.currentTrack.duration - time <= CONSTANTS.SLEEP_TIMER_PRE_END_SECOND) &&
      settingsStore.sleepTimerEnabled
  ) {
    playerStore.pause()
    settingsStore.cancelSleepTimer()
    waitSongEnd = false
  }
})

watch(() => settingsStore.sleepTimerEnabled, (val) => {
  if (val == false) {
    cancelTimer()
  }
})

onMounted(() => {
  updateRemainingTime()
  timer = window.setInterval(checkSleep, 1000)
})

onBeforeUnmount(() => {
  if (timer !== undefined) window.clearInterval(timer)
})
</script>

<template>
  <div class="text-white space-y-4">
    <div class="flex items-center justify-between gap-2">
      <div>{{ t('timer_remains') }}：{{ formattedTime }}</div>
      <el-switch v-model="settingsStore.sleepTimerEnabled"/>
    </div>

    <div class="flex gap-2">
      <button @click="startTimer(10)" class="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">10
        {{ t('timer_minutes') }}
      </button>
      <button @click="startTimer(30)" class="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">30
        {{ t('timer_minutes') }}
      </button>
      <button @click="startTimer(60)" class="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">60
        {{ t('timer_minutes') }}
      </button>
      <button @click="showCustom = !showCustom"
              class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
      >
        {{ t('timer_custom') }}
      </button>
    </div>

    <div v-if="showCustom" class="flex items-center gap-2">
      <el-input
          type="number"
          v-model="settingsStore.customSleepTime"
          class="flex-1"
      ></el-input>
      <button class="shrink-0 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
              @click="startTimer(settingsStore.customSleepTime)">
        {{ t('timer_confirm') }}
      </button>
    </div>

    <label class="inline-flex items-center space-x-2">
      <input type="checkbox" v-model="endAfterCurrentSong"
             @change="settingsStore.endAfterCurrentSong = endAfterCurrentSong"/>
      <span> {{ t('timer_end_after_current_song') }} </span>
    </label>
  </div>
</template>
