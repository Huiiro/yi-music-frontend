<script setup lang='ts'>
import {onMounted, ref} from 'vue'
import type {ArtistEntity} from '@/api/interface.ts'
import {getArtistList} from '@/api/artist.ts'
import ArtistItem from '@/components/artist/ArtistItem.vue'

const artists = ref([] as ArtistEntity[])

onMounted(async () => {
  const res = await getArtistList()
  artists.value = res.data
})
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
    <ArtistItem v-for="artist in artists" :artist="artist"/>
  </div>
</template>
