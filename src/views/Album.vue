<template>
  <div class="grid [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] gap-4 p-4">
    <AlbumItem
        v-for="(album, index) in albums"
        :key="index"
        :album="album"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import AlbumItem from '@/components/album/AlbumItem.vue'
import {getAlbumList} from '@/api/album'
import type {AlbumEntity} from '@/api/interface.ts'

const albums = ref([] as AlbumEntity[])

onMounted(async () => {
  const res = await getAlbumList()
  albums.value = res.data
})
</script>
