<script setup lang="ts">
import {ref, watch, computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {useUIStore} from '@/store/ui'
import {getAlbumSong} from '@/api/album'
import {getImageTopBottomColors} from '@/utils/color.ts'

import type {songEntity} from '@/api/interface'
import SongListView from '@/components/song/SongListView.vue'
import defaultCover from '@/assets/svg/default/default-cover.svg'

const {t} = useI18n()
const route = useRoute()
const uiStore = useUIStore()
const transparentMode = ref(uiStore.transparentMode)

const albumName = ref('')
const artistName = ref('')
const albumCover = ref('')
const songCount = ref(0)

const loading = ref(false)
const songs = ref<songEntity[]>([])
const source = computed(() => ({
  type: 'album',
  album: albumName.value,
  artist: artistName.value,
}))

const coverRef = ref<HTMLImageElement | null>(null)
const topColor = ref('#111827')
const bottomColor = ref('#070f22')

const updateColors = () => {
  const img = coverRef.value
  if (img && img.complete) {
    //@ts-ignore
    const {topColor: top, bottomColor: bottom} = getImageTopBottomColors(img)
    topColor.value = top
    //bottomColor.value = bottom
  }
}

const onCoverLoaded = () => {
  if (transparentMode) {
    updateColors()
  }
}

const fetchSongs = async () => {
  if (!albumName.value || !artistName.value) return
  loading.value = true
  try {
    const res = await getAlbumSong(albumName.value, artistName.value)
    songs.value = res.data
  } finally {
    loading.value = false
  }
}

watch(() => route.query, async (query) => {
      albumName.value = (query.albumName as string) || ''
      artistName.value = (query.artistName as string) || ''
      albumCover.value = (query.albumCover as string) || ''
      songCount.value = (query.songCount as any) || 0

      if (songCount.value < 1) {
        await fetchSongs()
        songCount.value = songs.value.length
      }
    },
    {immediate: true}
)

</script>

<template>
  <div
      class="relative h-full flex flex-col"
      :style="transparentMode
      ? { background: `linear-gradient(to bottom, ${topColor}, ${bottomColor})` }
      : {}"
  >
    <!-- 遮罩层 -->
    <div class="absolute inset-0 bg-black pointer-events-none opacity-15" v-if="transparentMode"/>

    <!-- 顶部信息 -->
    <div class="relative flex sm:flex-row sm:items-center gap-4 p-4 shrink-0">
      <img
          @load="onCoverLoaded"
          ref="coverRef"
          crossorigin="anonymous"
          :src="albumCover ? albumCover : defaultCover"
          alt=""
          class="w-36 h-36 rounded-xl shadow-md object-cover shrink-0"
      />
      <div class="flex flex-col justify-center min-w-0 w-full">
        <h2 class="text-2xl sm:text-3xl font-bold text-text mb-2 truncate">
          {{ albumName }}
        </h2>
        <div class="text-sm text-text-light truncate">
          {{ songCount }}{{ t('song_count') }} · {{ artistName }}
        </div>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div class="flex-1 overflow-auto">
      <div v-if="loading">{{ t('loading') }}</div>
      <div v-else class="h-full">
        <SongListView :source="source" :key="albumName + artistName"/>
      </div>
    </div>

  </div>
</template>
