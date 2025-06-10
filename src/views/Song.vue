<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {aggregationSort, getSongList2Playlist} from "@/api/song.ts";
import {usePlayStore} from "@/store/play";
import {useI18n} from "vue-i18n";

import SongItem from "@/components/song/SongItem.vue";
import type {songEntity} from "@/api/interface.ts";
import SongListHeader from "@/components/song/SongListHeader.vue";

const {t} = useI18n();
const playStore = usePlayStore();
const songList = ref<songEntity[]>([]);

const activeMenuIndex = ref<number | null>(null);

const loading = ref(false);
const noMore = ref(false);

const page = ref({
  total: 0,
  current: 1,
  size: 100,
  pages: 1
});

// 播放歌曲
const playSongById = (id: number) => {
  playStore.playSongById(id, true);
};

// 加载歌曲列表
const load = async (resort: boolean | null) => {

  // 触发排序查询
  if (resort) {
    songList.value = [];
    loading.value = false;
    noMore.value = false;
  }

  if (loading.value || noMore.value) return;

  loading.value = true;

  const res = await aggregationSort(
      {sortType: sortType.value, sortOrder: sortOrder.value},
      {}, page.value);

  const result = res.data;

  if (result?.data?.length) {
    songList.value.push(...result.data);
    page.value.total = result.total;
    page.value.pages = result.pages;
    page.value.current++;
  }

  if (page.value.current > page.value.pages) {
    noMore.value = true;
  }

  loading.value = false;
};

// 排序加载
const updateSort = async (type: string) => {
  if (type == 'default') {
    sortType.value = 'default'
    sortOrder.value = 'asc'
  } else {
    sortType.value = type
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
  page.value.current = 1;

  await load(true);
}

onMounted(async () => {
  const response = await getSongList2Playlist();
  playStore.setPlayList(response.data);
  await load(false);
});


const selectedIds = ref(new Set<number>())
const multiSelectMode = ref(false);
const sortType = ref<string>('default');
const sortOrder = ref<'asc' | 'desc'>('asc');

const isAllSelected = computed(() =>
    songList.value.length > 0 &&
    songList.value.every(song => selectedIds.value.has(song.id))
)

const toggleMultiSelect = () => {
  multiSelectMode.value = !multiSelectMode.value;
  if (!multiSelectMode.value) selectedIds.value.clear();
};

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
  console.log('播放', [...selectedIds.value]);
};

const handleBatchDelete = () => {
  songList.value = songList.value.filter(song => !selectedIds.value.has(song.id));
  selectedIds.value.clear();
};

const handleBatchAdd = () => {
  // 添加到歌单等
  console.log('添加', [...selectedIds.value]);
};

</script>

<template>
  <div class="flex flex-col h-full">
    <SongListHeader
        :multiSelectMode="multiSelectMode"
        :isAllSelected="isAllSelected"
        :selectedCount="selectedIds.size"
        :sortType="sortType"
        :sortOrder="sortOrder"
        @updateSort="updateSort"
        @toggleMultiSelect="toggleMultiSelect"
        @toggleSelectAll="toggleSelectAll"
        @batchPlay="handleBatchPlay"
        @batchDelete="handleBatchDelete"
        @batchAdd="handleBatchAdd"
        search-text=""
    />
    <div
        v-infinite-scroll="load"
        class="divide-y divide-gray-700 infinite-list overflow-auto"
        style="height: 100%"
    >
      <SongItem
          v-for="(song, i) in songList"
          :key="song.id"
          :index="i + 1"
          v-bind="song"
          :activeMenuIndex="activeMenuIndex"
          :multiSelectMode="multiSelectMode"
          :selected="selectedIds.has(song.id)"
          @openMenu="(index) => (activeMenuIndex = index)"
          @closeMenu="() => (activeMenuIndex = null)"
          @playSong="() => playSongById(song.id)"
          @toggleSelect="toggleSelect(song.id)"
      />
      <div v-if="noMore" class="text-center py-4 text-gray-400">{{ t('no_more_content') }}</div>
    </div>
  </div>

</template>

<style scoped>
.infinite-list {
  height: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>