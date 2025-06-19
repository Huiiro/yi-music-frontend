<script setup lang="ts">
import {onMounted, watch} from 'vue'
import Sidebar from '@/components/layout/sidebar/SideBar.vue'
import Header from '@/components/layout/header/Header.vue'
import PlayBar from '@/components/layout/playbar/PlayBar.vue'
import Main from '@/components/layout/main/Main.vue'
import {usePlayStore} from '@/store/play'
import {useSettingsStore} from '@/store/settings'

const playStore = usePlayStore()
const settingsStore = useSettingsStore()

onMounted(() => {
  playStore.checkInit()
  if(settingsStore.darkMode) {
    document.documentElement.classList.toggle('dark', true)
  }
})

watch(()=> settingsStore.darkMode, (val)=> {
  document.documentElement.classList.toggle('dark', val)
})

</script>

<template>
  <div class="absolute w-full flex flex-col h-screen overflow-y-scroll">
    <div class="w-full flex flex-col h-full overflow-hidden">
      <Header/>
      <div class="flex flex-1 overflow-hidden bg-bg">
        <Sidebar/>
        <main class="flex-1 overflow-x-hidden">
          <Main/>
        </main>
      </div>
      <PlayBar/>
    </div>
  </div>
</template>
