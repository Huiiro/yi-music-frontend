<script setup lang="ts">
import {useRoute} from 'vue-router'
import {ref, computed, onMounted, watch} from 'vue'
import {usePlayStore} from '@/store/play'
import {useAppStore} from '@/store/app'
import {deleteSongListApi, getSongListSingleton} from "@/api/songList.ts"
import SongListView from '@/components/song/SongListView.vue'
import defaultCover from '@/assets/svg/default/default-cover.svg'
import {useI18n} from 'vue-i18n'
import {ElMessage} from 'element-plus'
import router from '@/router'

const {t} = useI18n()
const route = useRoute()
const playStore = usePlayStore()
const appStore = useAppStore()
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
const SongListViewRef = ref()
const handlePlayAll = () => {
  SongListViewRef.value?.playSongsAndSetPlaylist()
}

// 删除歌单
const deleteDialogVisible = ref(false)
const handleDeletePlaylist = () => {
  deleteDialogVisible.value = true
}

const deletePlayList = () => {
  let arr = []
  arr.push(playlistData.value.songListId)
  deleteSongListApi(arr).then(res => {
    if (res.code === 0) {
      ElMessage.success(t('delete_playlist_success'))
      // 关闭对话框
      deleteDialogVisible.value = false
      // 重置播放列表
      playStore.clearPlayList()
      // 重新加载歌单
      // 刷新sidebar
      appStore.notifyBToReload()
      // 跳转回首页
      router.push({name: 'Song'})
    }
  })
}

// 初次加载
onMounted(async () => {
  await loadData()
})

// 路由参数变化时重新加载（切换歌单）
watch(() => route.params.id, () => {
  loadData()
})
</script>

<template>
  <div>
    <el-dialog
        :title="t('delete_playlist')"
        v-model="deleteDialogVisible"
        width="350"
        top="30vh">
      <div class="text-text">
        <span class="text-sm">{{ t('delete_playlist_warn') }}</span><br/>
        <span class="text-xs text-text-light">{{ t('delete_playlist_warn_desc') }} </span>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2 px-2 pb-1">
          <button
              @click="deleteDialogVisible = false"
              class="px-4 py-1 rounded border border-border
              text-sm text-text hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {{ t('cancel') }}
          </button>
          <button
              @click="deletePlayList"
              class="px-4 py-1 rounded text-sm text-text
              bg-red-300 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-700"
          >
            {{ t('confirm') }}
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
  <div class="relative flex sm:flex-row sm:items-center gap-4 p-4 shrink-0">
    <!-- cover -->
    <img
        ref="coverRef"
        crossorigin="anonymous"
        :src="playlistData.songListCover || defaultCover"
        alt=""
        class="w-36 h-36 rounded-xl shadow-md object-cover shrink-0"
    />
    <!-- text -->
    <div class="relative flex flex-col justify-start min-w-0 w-full pt-1 pb-12">
      <!-- header -->
      <h2 class="text-2xl sm:text-3xl font-bold text-text mb-2 truncate">
        {{ playlistData.songListName }}
      </h2>
      <!-- content -->
      <div class="text-sm text-text-light truncate">
        <span>{{ playlistData.songListDesc }}&nbsp;</span>
      </div>
      <div class="text-sm text-text-light truncate">
        <span>{{ t('create_time') }}{{ playlistData.createTime }}</span>
      </div>
      <!-- button -->
      <div class="absolute bottom-0 left-0 mt-3 flex gap-2">
        <button
            @click="handlePlayAll"
            class="bg-blue-300 hover:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600
            text-text text-sm px-3 py-2 rounded shadow transition"
        >
          <span class="flex items-center gap-1">
            <svgIcon name="play-play" class-name="w-4 h-4"/>
            <span>{{ t('play_all_alt') }}</span>
          </span>
        </button>
        <button
            @click="handleDeletePlaylist"
            class="bg-red-300 hover:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600
            text-text text-sm px-3 py-2 rounded shadow transition"
        >
          <span class="flex items-center gap-1">
            <svgIcon name="common-delete" class-name="w-4 h-4"/>
            <span>{{ t('delete_playlist') }}</span>
          </span>
        </button>
      </div>
    </div>
  </div>
  <div class="h-full flex-1 overflow-auto">
    <SongListView ref="SongListViewRef" :source="source"/>
  </div>
</template>
