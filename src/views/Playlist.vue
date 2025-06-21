<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { getSongListSingleton } from "@/api/songList.ts"
import SongListView from '@/components/song/SongListView.vue'
import defaultCover from '@/assets/svg/default/default-cover.svg'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const route = useRoute()
const id = computed(() => Number(route.params.id))

const playlistData = ref({} as any)

const source = computed(() => ({
  type: 'songList',
  id: id.value
}))

const loadData = async () => {
  if (!id.value) return
  try {
    const res = await getSongListSingleton(id.value)
    playlistData.value = res.data
  } catch (err) {
    console.error(err)
  }
}

// 播放全部
const handlePlayAll = () => {

}

// 删除歌单
const handleDeletePlaylist = () => {

}

// 初次加载
onMounted(() => {
  loadData()
})

// 路由参数变化时重新加载（切换歌单）
watch(() => route.params.id, () => {
  loadData()
})
</script>

<template>
  <div class="relative flex sm:flex-row sm:items-center gap-4 p-4 shrink-0">
    <img
        ref="coverRef"
        crossorigin="anonymous"
        :src="playlistData.songListCover || defaultCover"
        alt=""
        class="w-36 h-36 rounded-xl shadow-md object-cover shrink-0"
    />
    <div class="relative flex flex-col justify-start min-w-0 w-full pt-1 pb-12">
      <h2 class="text-2xl sm:text-3xl font-bold text-text mb-2 truncate">
        {{ playlistData.songListName }}
      </h2>
      <div class="text-sm text-text-light truncate">
        <span>{{ playlistData.songListDesc }}&nbsp;</span>
      </div>
      <div class="text-sm text-text-light truncate">
        <span>{{ t('create_time') }}{{ playlistData.createTime }}</span>
      </div>
      <div class="absolute bottom-0 left-0 mt-3 flex gap-2">
        <button
            @click="handlePlayAll"
            class="bg-blue-300 hover:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600
            text-text text-sm px-3 py-1.5 rounded shadow transition"
        >
          <span class="flex items-center gap-2">
            <svgIcon name="play-play" class-name="w-4 h-4"/>
            <span>{{ t('play_all_alt') }}</span>
          </span>
        </button>
        <button
            @click="handleDeletePlaylist"
            class="bg-red-300 hover:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600
            text-text text-sm px-3 py-1.5 rounded shadow transition"
        >
          <span class="flex items-center gap-2">
            <svgIcon name="common-delete" class-name="w-4 h-4" />
            <span>{{ t('delete_playlist') }}</span>
          </span>
        </button>
      </div>
    </div>
  </div>
  <div class="h-full flex-1 overflow-auto">
    <SongListView :source="source" />
  </div>
</template>
