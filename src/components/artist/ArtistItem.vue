<!-- 艺术家页面组件 -->
<script setup lang="ts">
import {defineProps} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import type {ArtistEntity} from '@/api/interface.ts'
import defaultArtist from '@/assets/svg/default/default-artist.svg'

const {t} = useI18n()
const router = useRouter()

const props = defineProps<{
  artist: ArtistEntity
  coverSize: number
}>()

const goToArtistDetail = () => {
  router.push({
    name: 'ArtistDetail',
    query: {
      artistName: props.artist.artistName,
      albumCover: props.artist.albumCover,
      songCount: props.artist.songCount,
    }
  })
}
</script>

<template>
  <div
      class="w-full cursor-pointer transition-transform hover:scale-105"
      @click="goToArtistDetail"
  >
    <div class="w-full aspect-square overflow-hidden">
      <img
          class="w-full h-full object-cover rounded-full"
          :src="artist.albumCover || defaultArtist"
          alt="artist cover"
      />
    </div>

    <div class="mt-2 text-sm font-semibold text-text truncate">
      {{ artist.artistName }}
    </div>

    <div class="text-xs text-text-light flex items-center gap-1 truncate">
      {{ artist.songCount }}{{ t('song_count') }}
    </div>
  </div>
</template>
