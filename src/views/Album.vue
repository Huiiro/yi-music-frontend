<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {getAlbumList} from '@/api/album'
import type {AlbumEntity} from '@/api/interface.ts'
import AlbumItem from '@/components/album/AlbumItem.vue'
import AlbumHeader from '@/components/album/AlbumHeader.vue'

const albums = ref([] as AlbumEntity[])
const minSize = ref(180)

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
  const res = await getAlbumList(sort.value, search.value)
  albums.value = res.data
}

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="sticky top-0 z-30 bg-gray-900">
      <AlbumHeader
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
      <AlbumItem
          v-for="album in albums"
          :key="album.albumName"
          :album="album"
          :cover-size="minSize"/>
    </div>
  </div>
</template>
