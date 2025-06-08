<script setup lang="ts">
import axios from 'axios';
import {usePlayStore} from '@/store/play';
import {demoData} from "@/api/interface.ts";

const audioStore = usePlayStore();

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