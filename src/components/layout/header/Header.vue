<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useSettingsStore} from '@/store/settings'
import {useSidebarStore} from '@/store/sidebar'
import {usePlayStore} from '@/store/play'
import {useAppStore} from '@/store/app'
import {useI18n} from 'vue-i18n'

import next from '@/assets/svg/common/next.svg'
import back from '@/assets/svg/common/back.svg'
import plus from '@/assets/svg/common/plus.svg'
import user from '@/assets/svg/common/user.svg'
import LangSwitcher from '@/components/layout/header/LangSwitcher.vue'


const settingsStore = useSettingsStore()
const sidebarStore = useSidebarStore()
const playStore = usePlayStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const {t} = useI18n()

// 监听路由变化，移动端自动收起侧边栏
watch(() => route.path, () => {
  if (appStore.isSmallScreen) {
    sidebarStore.toggleVisibility(false)
    sidebarStore.setWidth(0)
  }
})

// 展开/收起侧边栏
const toggleSidebar = () => {
  sidebarStore.toggleVisibility()
  if (sidebarStore.visible) {
    sidebarStore.setWidth(sidebarStore.defaultWidth)
  } else {
    sidebarStore.setWidth(0)
  }
}

// 路由跳转 -> 向后
const goBack = () => {
  router.back()
}

// 路由跳转 -> 向前
const goForward = () => {
  router.forward()
}

// 上传文件
const uploadLocalFiles = () => {
  fileInputRef.value?.click()
}

// 管理用户资料
const openUserInfo = () => {

}

const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  console.log(files)

  const formData = new FormData()
  for (const file of files) {
    formData.append('files', file)
  }

  try {
    //TODO
    console.log(formData)
    //await uploadMusicFiles(formData)
    // 成功后刷新音乐列表，或提示
    console.log('上传成功')
  } catch (error) {
    console.error('上传失败', error)
  }
}

const currentLyricText = computed(() => {
  return playStore.currentTrack.lrc[playStore.currentLyricIndex]?.text || ''
})

</script>

<template>
  <header class="h-12 bg-gray-800 flex items-center justify-between px-4 text-white">
    <!-- 左侧组件 -->
    <div class="flex items-center space-x-2">
      <!--侧边栏按钮-->
      <button v-if="appStore.isSmallScreen" @click="toggleSidebar" class="mr-2">☰</button>
      <!--LOGO文字-->
      <h1 class="text-lg font-bold mr-2" v-if="!appStore.isSmallScreen">{{ appStore.logoText }}</h1>
      <!--后退按钮-->
      <button @click="goBack" class="hover:text-gray-300 ml-4" v-if="!appStore.isSmallScreen">
        <img :src="back" :alt="t('back_alt')" class="w-4 h-4"/>
      </button>
      <!--前进按钮-->
      <button @click="goForward" class="hover:text-gray-300 ml-1" v-if="!appStore.isSmallScreen">
        <img :src="next" :alt="t('forward_alt')" class="w-4 h-4"/>
      </button>
    </div>

    <!-- 中间组件 搜索框 -->
    <div class="flex-1 flex justify-center items-center gap-2 px-4" v-if="settingsStore.showTopLyrics">
      <p>{{ currentLyricText }}</p>
    </div>

    <!-- 右侧组件 -->
    <div class="flex items-center space-x-3">
      <!--上传文件-->
      <button @click="uploadLocalFiles" class="text-xl hover:text-blue-400"
              v-if="!appStore.isSmallScreen">
        <img :src="plus" alt="t('upload_file_alt')" class="w-6 h-6"/>
      </button>
      <input
          ref="fileInputRef"
          type="file"
          multiple
          accept="audio/*"
          class="hidden"
          @change="handleFileChange"
      />

      <!--用户信息-->
      <button @click="openUserInfo" class="text-xl hover:text-blue-400">
        <img :src="user" alt="t('user_info_alt')" class="w-5 h-5"/>
      </button>

      <!--语言管理-->
      <LangSwitcher mode="short" v-if="!appStore.isSmallScreen"/>
    </div>
  </header>
</template>
