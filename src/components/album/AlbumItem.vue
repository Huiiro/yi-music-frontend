<template>
  <div
      class="min-w-[10rem] w-full sm:w-[12rem] cursor-pointer transition transform hover:scale-105"
      @click="goToAlbumDetail"
  >
    <div class="w-full aspect-square overflow-hidden rounded-xl shadow-md">
      <img
          :src="album.albumCover || defaultCover"
          alt="Album Cover"
          class="w-full h-full object-cover"
      />
    </div>

    <div class="mt-2 text-sm font-semibold text-white truncate">
      {{ album.albumName }}
    </div>

    <div class="text-xs text-gray-400 flex items-center gap-1 truncate">
      <span>{{ album.songCount }} 首</span>
      <span class="text-xs">•</span>
      <span class="truncate">{{ album.artistName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {AlbumEntity} from '@/api/interface'
import {useRouter} from 'vue-router'
import defaultCover from '@/assets/svg/default/default-cover.svg'

const props = defineProps<{
  album: AlbumEntity
}>()

const router = useRouter()

const goToAlbumDetail = () => {
  router.push({
    name: 'AlbumDetail',
    query: {
      albumName: props.album.albumName,
      artistName: props.album.artistName,
      albumCover: props.album.albumCover,
      songCount: props.album.songCount,
    }
  })
}
</script>
