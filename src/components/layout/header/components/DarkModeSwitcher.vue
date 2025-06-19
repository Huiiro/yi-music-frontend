<!-- 暗黑模式切换组件 -->
<script setup lang="ts">
import { useSettingsStore } from '@/store/settings'
import {useI18n} from 'vue-i18n'
const settingsStore = useSettingsStore()
const {t} = useI18n()
</script>

<template>
  <button
      class="w-8 h-8 flex items-center justify-center rounded transition"
      @click="settingsStore.toggleDarkMode"
      :title="t('switch_dark_mode')"
  >
    <svgIcon v-if="settingsStore.darkMode" name="common-dark-moon" class="w-4 h-4 dark:text-white hover:text-primary" />
    <svgIcon v-else name="common-dark-sun" class="w-8 h-8 text-yellow-400 hover:text-primary" />
  </button>
</template>
