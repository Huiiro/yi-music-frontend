<script setup lang="ts">
import {ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useSidebarStore} from '@/store/sidebar'
import {useAppStore} from '@/store/app'
import {useI18n} from 'vue-i18n'

import next from '@/assets/svg/common/next.svg'
import back from '@/assets/svg/common/back.svg'
import search from '@/assets/svg/common/search.svg'
import plus from '@/assets/svg/common/plus.svg'
import user from '@/assets/svg/common/user.svg'
import LangSwitcher from '@/components/layout/header/LangSwitcher.vue'

const sidebarStore = useSidebarStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const {t} = useI18n()

/**
 * 监听路由变化，移动端自动收起侧边栏
 */
watch(() => route.path, () => {
  if (appStore.isSmallScreen) {
    sidebarStore.toggleVisibility(false)
    sidebarStore.setWidth(0)
  }
})

/**
 * 展开/收起侧边栏
 */
const toggleSidebar = () => {
  sidebarStore.toggleVisibility()
  if (sidebarStore.visible) {
    sidebarStore.setWidth(sidebarStore.defaultWidth)
  } else {
    sidebarStore.setWidth(0)
  }
}

/**
 * 路由跳转 -> 向后
 */
const goBack = () => {
  router.back()
}

/**
 * 路由跳转 -> 向前
 */
const goForward = () => {
  router.forward()
}

/**
 * 上传文件
 */
const uploadLocalFiles = () => {
  fileInputRef.value?.click()
}

/**
 * 管理用户资料
 */
const openUserInfo = () => {

}

/**
 * 聚合搜索函数
 */
const searchAggregation = () => {
  //TODO
  console.log('user search')
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
</script>

<template>
  <header class="h-12 bg-gray-800 flex items-center justify-between px-4 text-white">
    <!-- 左侧组件 -->
    <div class="flex items-center space-x-2">
      <!--侧边栏按钮-->
      <button v-if="appStore.isSmallScreen" @click="toggleSidebar" class="mr-2">☰</button>
      <!--LOGO文字-->
      <h1 class="text-lg font-bold mr-2">{{ appStore.logoText }}</h1>
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
    <div class="flex-1 flex justify-center items-center gap-2 px-4">
      <img :src="search" :alt="t('search_alt')" class="w-5 h-5"/>
      <input
          @keyup.enter="searchAggregation"
          type="text"
          :placeholder="t('search_placeholder')"
          class="w-full max-w-md px-3 py-1 rounded bg-gray-700 text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 右侧组件 -->
    <div class="flex items-center space-x-3">
      <!--上传文件-->
      <button @click="uploadLocalFiles" class="text-xl hover:text-blue-400">
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

      <!--欢迎文字-->
      <!--<p> {{ t('user_welcome_prefix') }} Admin</p>-->

      <!--语言管理-->
      <LangSwitcher/>
    </div>
  </header>
</template>
