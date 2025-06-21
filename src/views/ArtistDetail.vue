<script setup lang="ts">
import {ref, watch, computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {getArtistSong} from '@/api/artist.ts'

import type {songEntity} from '@/api/interface.ts'
import SongListView from '@/components/song/SongListView.vue'
import defaultArtist from '@/assets/svg/default/default-artist.svg'

const {t} = useI18n()
const route = useRoute()

const artistName = ref('')
const albumCover = ref('')
const songCount = ref(0)

const loading = ref(false)
const songs = ref<songEntity[]>([])
const source = computed(() => ({
  type: 'artist',
  artist: artistName.value,
}))

const fetchSongs = async () => {
  if (!artistName.value) return
  loading.value = true
  try {
    const res = await getArtistSong(artistName.value)
    songs.value = res.data
  } finally {
    loading.value = false
  }
}

watch(() => route.query, (query) => {
      artistName.value = (query.artistName as string) || ''
      albumCover.value = (query.albumCover as string) || ''
      songCount.value = (query.songCount as any) || 0

      if (songCount.value < 1) {
        fetchSongs()
        songCount.value = songs.value.length
      }
    },
    {immediate: true}
)
</script>

<template>
  <div class="relative flex sm:flex-row sm:items-center gap-4 p-4 shrink-0">
    <img
        ref="coverRef"
        crossorigin="anonymous"
        :src="albumCover ? albumCover : defaultArtist"
        alt=""
        class="w-36 h-36 rounded-full shadow-md object-cover shrink-0"
    />
    <div class="flex flex-col justify-center min-w-0 w-full">
      <h2 class="text-2xl sm:text-3xl font-bold text-text mb-2 truncate">
        {{ artistName }}
      </h2>
      <div class="text-sm text-text-light truncate">
        {{ songCount }}{{ t('song_count') }}
      </div>
    </div>
  </div>

  <!-- 歌曲列表 -->
  <div class="h-full flex-1 overflow-auto">
    <SongListView :source="source" />
  </div>
</template>
