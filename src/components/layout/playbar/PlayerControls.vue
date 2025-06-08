<!--播放控制条-->
<script setup lang="ts">
import {defineEmits, defineProps} from 'vue';

import prev from '@/assets/svg/play/prev.svg';
import next from '@/assets/svg/play/next.svg';
import play from '@/assets/svg/play/play.svg';
import pause from '@/assets/svg/play/pause.svg';

import {useAppStore} from "@/store/app";

const appStore = useAppStore();

const props = defineProps<{
  currentTrack: {
    cover: string;
    title: string;
    artist: string;
    duration: number;
  };
  isPlaying: boolean;
  currentTime: number;
}>();

const emit = defineEmits<{
  (e: 'togglePlay'): void;
  (e: 'prevTrack'): void;
  (e: 'nextTrack'): void;
  (e: 'progressChange', value: number): void;
}>();

function onProgressChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);
  emit('progressChange', value);
}

</script>

<template>
  <div class="w-full max-w-[32rem] mx-auto px-4" @click.stop>

    <div class="flex flex-col items-center">
      <div class="flex items-center gap-6 mb-1">
        <button @click.stop="$emit('prevTrack')" aria-label="上一曲" class="hover:text-blue-500 transition">
          <img :src="prev" alt="prev" :class="appStore.isSmallScreen ? 'w-5 h-5' : 'w-4 h-4'"/>

        </button>
        <button @click.stop="$emit('togglePlay')" aria-label="播放/暂停" class="hover:text-blue-500 transition">
          <img v-if="isPlaying" :src="pause" alt="pause" :class="appStore.isSmallScreen ? 'w-10 h-10' : 'w-8 h-8'"/>
          <img v-else :src="play" alt="play" :class="appStore.isSmallScreen ? 'w-10 h-10' : 'w-8 h-8'"/>
        </button>
        <button @click.stop="$emit('nextTrack')" aria-label="下一曲" class="hover:text-blue-500 transition">
          <img :src="next" alt="next" :class="appStore.isSmallScreen ? 'w-5 h-5' : 'w-4 h-4'"/>
        </button>
      </div>

      <input
          type="range"
          min="0"
          :max="props.currentTrack.duration"
          step="1"
          :value="props.currentTime"
          @change="onProgressChange"
          class="w-full h-1 rounded bg-gray-700 accent-blue-500 cursor-pointer"
          :class="appStore.isSmallScreen ? 'mt-3.5' : 'mt-0.5'"
      />

      <div class="w-full flex justify-between text-xs text-gray-400 mt-0.5 select-none">
        <span>{{ formatTime(props.currentTime) }}</span>
        <span>{{ formatTime(props.currentTrack.duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
  const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
  return `${m}:${s}`;
}
</script>
