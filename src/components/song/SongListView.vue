<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import {aggregationSearch, aggregationSort, getSongList2Playlist} from '@/api/song.ts'
import {usePlayStore} from '@/store/play'
import type {songEntity} from '@/api/interface.ts'
import {CONSTANTS} from '@/plugins/consts.ts'

import SongListItem from '@/components/song/SongListItem.vue'
import SongListHeader from '@/components/song/SongListHeader.vue'
import AddToSongList from '@/components/song/component/AddToSongList.vue'

const props = defineProps<{
  source: {
    type: string
    album?: string
    artist?: string
    id?: number
  },
}>()

const playStore = usePlayStore()
const songList = ref<songEntity[]>([])

const activeMenuIndex = ref<number | null>(null)

const loading = ref(false)
const noMore = ref(false)

const page = ref({
  total: 0,
  current: 1,
  size: CONSTANTS.QUERY_PAGE_SIZE,
  pages: 1
})

const selectedIds = ref(new Set<number>())
const multiSelectMode = ref(false)
const sortType = ref<string>('default')
const sortOrder = ref<'asc' | 'desc'>('asc')
const searchText = ref('')

const saveSongList = ref([] as any[])

// 播放歌曲
const playSongById = (id: number) => {
  if (playStore.playList.length == 0) {
    // 兜底 防止播放列表为空
    getSongList2Playlist().then(response => {
      playStore.setPlayList(response.data)
    })
  }
  if (playStore.switchPlaylist) {
    playStore.setPlayList(saveSongList.value)
  }
  playStore.playSongById(id, true)
}

// 播放歌曲 expose method
const playSongsAndSetPlaylist = () => {
  if (saveSongList.value.length > 0) {
    playStore.setPlayList(saveSongList.value)
    playStore.playSongById(saveSongList.value[0].id, true)
  }
}

// 加载歌曲列表
const load = async (resort: boolean | null, search: boolean | null) => {

  // 触发排序查询或搜索查询
  if (resort || search) {
    songList.value = []
    loading.value = false
    noMore.value = false
  }

  if (loading.value || noMore.value) return
  loading.value = true

  let res: any

  if (search) {
    res = await aggregationSearch(
        {searchKey: searchText.value},
        props.source,
        page.value
    )
  } else if (resort) {
    res = await aggregationSort(
        {sortType: sortType.value, sortOrder: sortOrder.value},
        props.source,
        page.value
    )
  }

  if (!res || !res.data) {
    loading.value = false
    return
  }

  const result = res.data
  if (search && searchText.value.length == 0) {
    saveSongList.value = result.data
  }

  if (result?.data?.length) {
    songList.value.push(...result.data)
    page.value.total = result.total
    page.value.pages = result.pages
    page.value.current++
  }

  if (page.value.current > page.value.pages) {
    noMore.value = true
  }

  loading.value = false
}

// 排序加载
const updateSort = async (type: string) => {
  if (type == 'default' && sortType.value == 'default') {
    // 多次默认排序不触发重新查询
    return
  }
  if (type == 'default') {
    sortType.value = 'default'
    sortOrder.value = 'asc'
  } else {
    sortType.value = type
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
  page.value.current = 1

  await load(true, false)
}

// 搜索加载
const updateSearch = async (searchVal: string) => {
  searchText.value = searchVal
  page.value.current = 1

  await load(false, true)
}

const isAllSelected = computed(() =>
    songList.value.length > 0 &&
    songList.value.every(song => selectedIds.value.has(song.id))
)

const toggleMultiSelect = () => {
  multiSelectMode.value = !multiSelectMode.value
  if (!multiSelectMode.value) selectedIds.value.clear()
}

const toggleSelect = (id: number) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(songList.value.map(song => song.id))
  }
}

const handleBatchPlay = () => {
  // 多选播放逻辑
  console.log('播放', [...selectedIds.value])
}

const handleBatchDelete = () => {
  // 多选删除逻辑
  console.log('播放', [...selectedIds.value])
  // songList.value = songList.value.filter(song => !selectedIds.value.has(song.id))
  // selectedIds.value.clear()
}

const handleBatchAdd = () => {
  // 添加到歌单等
  console.log('添加', [...selectedIds.value])
}

// 添加歌曲至歌单
const selectedSongId = ref<number>(0)
const addSongListDialogVisible = ref(false)
const handleAddToPlaylist = (id: number) => {
  addSongListDialogVisible.value = true
  selectedSongId.value = id
}

onMounted(async () => {
  if (playStore.playList.length == 0) {
    const response = await getSongList2Playlist()
    playStore.setPlayList(response.data)
  }
  await load(false, true)
})

watch(
    () => props.source,
    async () => {
      page.value.current = 1
      songList.value = []
      noMore.value = false
      await load(false, true)
    },
    {deep: true}
)

defineExpose({playSongsAndSetPlaylist: playSongsAndSetPlaylist})
</script>

<template>

  <!-- 添加歌曲至歌单 -->
  <AddToSongList
      v-model="addSongListDialogVisible"
      :songId="selectedSongId"
      @close="addSongListDialogVisible = false"
  />

  <div class="flex flex-col h-full">
    <SongListHeader
        :multiSelectMode="multiSelectMode"
        :isAllSelected="isAllSelected"
        :selectedCount="selectedIds.size"
        :sortType="sortType"
        :sortOrder="sortOrder"
        :searchText="searchText"
        @updateSort="updateSort"
        @updateSearch="updateSearch"
        @toggleMultiSelect="toggleMultiSelect"
        @toggleSelectAll="toggleSelectAll"
        @batchPlay="handleBatchPlay"
        @batchDelete="handleBatchDelete"
        @batchAdd="handleBatchAdd"
    />
    <div
        v-infinite-scroll="load"
        class="h-full divide-y divide-border overflow-auto"
    >
      <SongListItem
          v-for="(song, i) in songList"
          :key="song.id"
          :index="i + 1"
          v-bind="song"
          :activeMenuIndex="activeMenuIndex"
          :multiSelectMode="multiSelectMode"
          :selected="selectedIds.has(song.id)"
          :searchKeyword="searchText"
          @openMenu="(index) => (activeMenuIndex = index)"
          @closeMenu="() => (activeMenuIndex = null)"
          @playSong="() => playSongById(song.id)"
          @toggleSelect="toggleSelect(song.id)"
          @addToPlaylist="() => handleAddToPlaylist(song.id)"
      />
    </div>
  </div>
</template>