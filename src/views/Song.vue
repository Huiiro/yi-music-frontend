<script setup lang="ts">
import {ref} from "vue";
import SongItem from '@/components/song/SongItem.vue';

const songList = [
  {
    id: 1,
    cover: 'https://picsum.photos/seed/song1/80',
    title: 'Lost Stars',
    artist: 'Adam Levine',
    album: 'Begin Again',
    duration: '04:27'
  },
  {
    id: 2,
    cover: 'https://picsum.photos/seed/song2/80',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: 'Divide',
    duration: '03:53'
  },
  {
    id: 3,
    cover: 'https://picsum.photos/seed/song3/80',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '03:20'
  },
  {
    id: 4,
    cover: 'https://picsum.photos/seed/song4/80',
    title: 'Shallow',
    artist: 'Lady Gaga & Bradley Cooper',
    album: 'A Star Is Born',
    duration: '03:36'
  },
  {
    id: 5,
    cover: 'https://picsum.photos/seed/song5/80',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: '03:23'
  },
  {
    id: 6,
    cover: 'https://picsum.photos/seed/song6/80',
    title: 'Someone Like You',
    artist: 'Adele',
    album: '21',
    duration: '04:45'
  }
]

const activeMenuIndex = ref<number | null>(null);

const playSongByIndex = ((index: number) => {
  console.log(index);
  // playStore
})
</script>

<template>
  <div class="divide-y divide-gray-700">
    <SongItem
        v-for="(song, i) in songList"
        :key="i"
        :index="i + 1"
        v-bind="song"
        :activeMenuIndex="activeMenuIndex"
        @openMenu="(index) => (activeMenuIndex = index)"
        @closeMenu="() => (activeMenuIndex = null)"
        @playSong="(index) => playSongByIndex(index)"
    />
  </div>

</template>

<style scoped>

</style>