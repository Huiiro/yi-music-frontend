<!-- 语言切换组件 -->
<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAppStore} from '@/store/app'

const {locale} = useI18n()
const appStore = useAppStore()
const showDropdown = ref(false)

const langMap = {
  zh: '简体中文',
  en: 'English',
} as any

const props = defineProps({
  mode: {
    type: String as () => 'short' | 'full',
    default: 'short'
  }
})

const displayLang = computed(() =>
    props.mode === 'full' ? langMap[locale.value] || locale.value : locale.value.toUpperCase()
)

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
        class="flex items-center gap-x-1 text-text hover:text-text-hover transition no-bg-transition"
        @click="showDropdown = !showDropdown"
    >
      <svgIcon v-if="mode == 'short'" name="common-locale" class-name="w-4 h-4 icon"/>
      <span class="leading-none">{{ displayLang }}</span>
    </button>

    <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-28 bg-bg text-text rounded shadow-md z-50"
    >
      <div
          v-for="([langCode, langName]) in Object.entries(langMap)"
          :key="langCode"
          class="px-4 py-2 hover:bg-bg-hover cursor-pointer"
          @click="toggleLang(langCode)"
      >
        {{ langName }}
      </div>
    </div>
  </div>
</template>
