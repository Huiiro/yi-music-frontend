<script setup lang="ts">

import SongListView from '@/components/song/SongListView.vue'

const source = {
  type: 'song'
}
</script>

<template>
  <SongListView :source="source" />
</template>