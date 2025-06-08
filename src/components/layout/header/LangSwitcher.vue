<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAppStore} from '@/store/app'

import localeIcon from '@/assets/svg/common/locale.svg';

const {locale} = useI18n()
const appStore = useAppStore()

const showDropdown = ref(false)

const toggleLang = (lang: string) => {
  appStore.setLocale(lang)
  locale.value = lang
  showDropdown.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest('.lang-switcher')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative lang-switcher" @click.stop>
    <button
        class="flex items-center gap-x-1 text-white hover:text-blue-400 transition"
        @click="showDropdown = !showDropdown"
    >
      <img :src="localeIcon" alt="" class="w-4 h-4"/>
      <span class="leading-none">{{ locale.toUpperCase() }}</span>
    </button>

    <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-28 bg-gray-800 text-white rounded shadow-md z-50"
    >
      <div
          class="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          @click="toggleLang('zh')"
      >
        简体中文
      </div>
      <div
          class="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          @click="toggleLang('en')"
      >
        English
      </div>
    </div>
  </div>
</template>
