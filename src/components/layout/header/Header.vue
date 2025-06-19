<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useSettingsStore} from '@/store/settings'
import {useSidebarStore} from '@/store/sidebar'
import {usePlayStore} from '@/store/play'
import {useAppStore} from '@/store/app'

import LangSwitcher from '@/components/layout/header/components/LangSwitcher.vue'
import DarkModeSwitcher from '@/components/layout/header/components/DarkModeSwitcher.vue'

const settingsStore = useSettingsStore()
const sidebarStore = useSidebarStore()
const playStore = usePlayStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()

const fileInputRef = ref<HTMLInputElement | null>(null)

// 获取当前歌词
const currentLyricText = computed(() => {
  return playStore.currentTrack.lrc[playStore.currentLyricIndex]?.text || ''
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

// 管理用户资料
const openUserInfo = () => {

}

// 上传文件
const uploadLocalFiles = () => {
  fileInputRef.value?.click()
}

// 处理文件变化
const handleFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  const formData = new FormData()
  for (const file of files) {
    formData.append('files', file)
  }

  try {
    //TODO
    console.log('上传成功')
  } catch (error) {
    console.error('上传失败', error)
  }
}

// 监听路由变化，移动端自动收起侧边栏
watch(() => route.path, () => {
  if (appStore.isSmallScreen) {
    sidebarStore.toggleVisibility(false)
    sidebarStore.setWidth(0)
  }
})
</script>

<template>
  <header class="h-12 bg-bg-light text-text flex items-center justify-between px-4">
    <!-- 左侧组件 -->
    <div class="flex items-center space-x-2">
      <!-- 侧边栏按钮 -->
      <button v-if="appStore.isSmallScreen" class="mr-2" @click="toggleSidebar">☰</button>
      <!-- LOGO文字 -->
      <h1 v-if="!appStore.isSmallScreen" class="text-lg font-bold mr-2 cursor-pointer hover:text-primary">
        {{ appStore.logoText }}
      </h1>
      <!-- 后退按钮 -->
      <button v-if="!appStore.isSmallScreen" class="ml-4 hover:text-primary" @click="goBack">
        <svgIcon name="common-back" class-name="w-4 h-4 icon"/>
      </button>
      <!-- 前进按钮 -->
      <button v-if="!appStore.isSmallScreen" class="ml-1 hover:text-primary" @click="goForward">
        <svgIcon name="common-next" class-name="w-4 h-4 icon"/>
      </button>
    </div>

    <!-- 中间组件 歌词 -->
    <div class="flex-1 flex justify-center items-center gap-2 px-4"
         v-if="settingsStore.showTopLyrics">
      <p>{{ currentLyricText }}</p>
    </div>

    <!-- 右侧组件 -->
    <div class="flex items-center space-x-3">
      <!-- 上传文件 -->
      <button v-if="!appStore.isSmallScreen"
              class="hover:text-primary"
              @click="uploadLocalFiles">
        <svgIcon name="common-plus" class-name="w-6 h-6 icon"/>
      </button>
      <input
          ref="fileInputRef"
          type="file"
          multiple
          accept="audio/*"
          class="hidden"
          @change="handleFileChange"
      />

      <!-- 用户信息 -->
      <button class="hover:text-primary" @click="openUserInfo">
        <svgIcon name="common-user" class-name="w-5 h-5 icon"/>
      </button>

      <!-- 暗黑模式切换 -->
      <DarkModeSwitcher />

      <!--语言管理-->
      <LangSwitcher mode="short" v-if="!appStore.isSmallScreen"/>
    </div>
  </header>
</template>
