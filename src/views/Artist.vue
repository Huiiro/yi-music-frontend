<script setup lang='ts'>
import {onMounted, ref} from 'vue'
import type {ArtistEntity} from '@/api/interface.ts'
import {getArtistList} from '@/api/artist.ts'
import ArtistItem from '@/components/artist/ArtistItem.vue'
import ArtistHeader from '@/components/artist/ArtistHeader.vue'

const artists = ref([] as ArtistEntity[])
const minSize = ref(140)

const sort = ref('')
const search = ref('')

onMounted(async () => {
  await loadData()
})

const updateSize = (size: number) => {
  minSize.value = size
}

const updateSort = (sortVal: string) => {
  sort.value = sortVal
  loadData()
}

const updateSearch = (searchVal: string) => {
  search.value = searchVal
  loadData()
}

const loadData = async () => {
  const res = await getArtistList(sort.value, search.value)
  artists.value = res.data
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="sticky top-0 z-30 bg-gray-900">
      <ArtistHeader
          :size="minSize"
          @updateSize="updateSize"
          @updateSort="updateSort"
          @updateSearch="updateSearch"
      />
    </div>
    <div
        class="grid gap-x-4 gap-y-6 p-4 overflow-auto"
        :style="{ gridTemplateColumns: `repeat(auto-fill, minmax(${minSize}px, 1fr))` }"
    >
      <ArtistItem
          v-for="artist in artists"
          :key="artist.artistName"
          :artist="artist"
          :cover-size="minSize"/>
    </div>
  </div>
</template>
