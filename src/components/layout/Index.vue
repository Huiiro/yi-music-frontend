<script setup lang="ts">
import {onMounted} from 'vue'
import Sidebar from '@/components/layout/sidebar/SideBar.vue'
import Header from '@/components/layout/header/Header.vue'
import PlayBar from '@/components/layout/playbar/PlayBar.vue'
import Main from '@/components/layout/main/Main.vue'
import {usePlayStore} from '@/store/play'

const playStore = usePlayStore()

onMounted(() => {
  playStore.checkInit()
})
</script>

<template>
  <div class="absolute w-full flex flex-col h-screen overflow-y-scroll">
    <div class="w-full flex flex-col h-full overflow-hidden">
      <Header/>
      <div class="flex flex-1 overflow-hidden bg-gray-900">
        <Sidebar/>
        <main class="flex-1 overflow-x-hidden">
          <Main/>
        </main>
      </div>
      <PlayBar/>
    </div>
  </div>
</template>
