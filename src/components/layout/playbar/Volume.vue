<!--音量控制条-->
<script setup lang="ts">
import { computed } from 'vue';
import { usePlayStore } from '@/store/play';

import volumeHigh from '@/assets/svg/volume/volume-high.svg';
import volumeMiddle from '@/assets/svg/volume/volume-middle.svg';
import volumeLow from '@/assets/svg/volume/volume-low.svg';
import volumeMute from '@/assets/svg/volume/volume-mute.svg';

const playStore = usePlayStore();

const volumeIcon = computed(() => {
  const vol = playStore.muted ? 0 : playStore.volume;
  if (vol === 0) return volumeMute;
  if (vol <= 30) return volumeLow;
  if (vol <= 70) return volumeMiddle;
  return volumeHigh;
});

// 滑块显示值，静音时显示0
const sliderValue = computed({
  get: () => (playStore.muted ? 0 : playStore.volume),
  set: (val: number) => {
    playStore.setVolume(val);
    if (val === 0) {
      playStore.setMuted(true);
    } else {
      playStore.setMuted(false);
    }
  }
});

// 点击图标切换静音
function toggleMute() {
  playStore.toggleMute();
}
</script>

<template>
  <div class="flex items-center gap-2">
    <img
        :src="volumeIcon"
        alt="volume"
        class="w-5 h-5 cursor-pointer"
        @click="toggleMute"
    />

    <input
        type="range"
        min="0"
        max="100"
        step="1"
        :value="sliderValue"
        @input="playStore.setVolume(parseInt((($event.target as HTMLInputElement)?.value || '0')))"
        class="w-24 h-1 rounded bg-gray-700 accent-blue-500 cursor-pointer"
    />
  </div>
</template>
