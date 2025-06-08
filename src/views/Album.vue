<script setup lang="ts">
import axios from 'axios';
import {usePlayStore} from '@/store/play';
import type {AudioTrack} from "@/api/interface.ts";

const audioStore = usePlayStore();

const demoData: AudioTrack[] = [
  {
    id: 1,
    title: 'song1',
    artist: 'artist1',
    album: 'album1',
    duration: 240,
    coverUrl: 'string2',
    audioUrl: 'string2',
    lrc: ''
  }, {
    id: 2,
    title: 'song2',
    artist: 'artist2',
    album: 'album2',
    duration: 240,
    coverUrl: 'string33',
    audioUrl: 'string33',
    lrc: ''
  }, {
    id: 3,
    title: 'song2',
    artist: 'artist2',
    album: 'album2',
    duration: 240,
    coverUrl: 'string33',
    audioUrl: 'string33',
    lrc: ''
  }
]

async function fetchAudioToStore(id: number) {

  try {
    const response = await axios.get('http://localhost:8080/audio/' + id, {
      responseType: 'blob'
    });

    await audioStore.setAudioBlob(response.data);
    console.log('音频数据已存到store');
  } catch (error) {
    console.error('请求音频失败:', error);
  }
}

</script>

<template>
  album
  {{ audioStore.playList }}
  <br/>
  <button @click="fetchAudioToStore(1)"> PLAY SONG 1</button>
  <br/>
  <button @click="fetchAudioToStore(2)"> PLAY SONG 2</button>
  <br/>
  <button @click="fetchAudioToStore(3)"> PLAY SONG 3</button>
  <br/>
  <button @click="audioStore.setPlayList(demoData)">点击加入播放列表</button>
</template>

<style scoped>

</style>