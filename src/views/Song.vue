<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getSongList, getSongList2Playlist} from "@/api/song.ts";
import {usePlayStore} from "@/store/play";

import SongItem from "@/components/song/SongItem.vue";
import type {songEntity} from "@/api/interface.ts";

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
const load = async () => {
  if (loading.value || noMore.value) return;

  loading.value = true;

  const res = await getSongList(null, {
    current: page.value.current,
    size: page.value.size,
    total: page.value.total,
  });

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

onMounted(async () => {
  console.log('onMounted')
  const response = await getSongList2Playlist();
  playStore.setPlayList(response.data);
  await load();
});
</script>

<template>
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
        @openMenu="(index) => (activeMenuIndex = index)"
        @closeMenu="() => (activeMenuIndex = null)"
        @playSong="() => playSongById(song.id)"
    />
    <div v-if="noMore" class="text-center py-4 text-gray-400">没有更多内容了</div>
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