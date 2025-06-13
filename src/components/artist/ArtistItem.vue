<template>
  <div
      class="group flex flex-col items-center text-center transition transform hover:scale-105"
      @click="goToArtistDetail"
  >
    <img
        :src="artist.albumCover || defaultArtist"
        alt="artist cover"
        class="w-32 h-32 rounded-full object-cover shadow-md mb-3"
    />

    <div class="text-lg font-semibold text-white truncate max-w-[8rem] hover:underline hover:text-white">
      {{ artist.artistName }}
    </div>

    <div class="text-sm text-gray-400">
      {{ artist.songCount }}{{ t('song_count') }}
    </div>
  </div>
</template>

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
