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

const SongListViewRef = ref()
const handlePlayAll = () => {
  SongListViewRef.value?.playSongsAndSetPlaylist()
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
    <!-- cover -->
    <img
        ref="coverRef"
        crossorigin="anonymous"
        :src="albumCover ? albumCover : defaultArtist"
        alt=""
        class="w-36 h-36 rounded-full shadow-md object-cover shrink-0"
    />
    <!-- text -->
    <div class="relative flex flex-col justify-center min-w-0 w-full pt-1 pb-12">
      <!-- header -->
      <h2 class="text-2xl sm:text-3xl font-bold text-text mb-2 truncate">
        {{ artistName }}
      </h2>
      <!-- content -->
      <div class="text-sm text-text-light truncate">
        {{ songCount }}{{ t('song_count') }}
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
      </div>
    </div>
  </div>
  <div class="h-full flex-1 overflow-auto">
    <SongListView ref="SongListViewRef" :source="source" />
  </div>
</template>
