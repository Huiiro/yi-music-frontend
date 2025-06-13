<script setup lang="ts">
import {defineProps} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import type {AlbumEntity} from '@/api/interface'
import defaultCover from '@/assets/svg/default/default-cover.svg'

const {t} = useI18n()
const router = useRouter()

const props = defineProps<{
  album: AlbumEntity
  coverSize: number
}>()

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

<template>
  <div
      class="w-full cursor-pointer transition-transform hover:scale-105"
      @click="goToAlbumDetail"
  >
    <div class="w-full aspect-square overflow-hidden rounded-xl shadow-md">
      <img
          class="w-full h-full object-cover"
          :src="album.albumCover || defaultCover"
          alt="Album Cover"
      />
    </div>

    <div class="mt-2 text-sm font-semibold text-white truncate">
      {{ album.albumName }}
    </div>

    <div class="text-xs text-gray-400 flex items-center gap-1 truncate">
      <span>{{ album.songCount }} {{ t('song_count') }}</span>
      <span class="text-xs">•</span>
      <span class="truncate">{{ album.artistName }}</span>
    </div>
  </div>
</template>
