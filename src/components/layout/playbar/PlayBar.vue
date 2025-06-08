<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {usePlayStore} from "@/store/play";
import {useAppStore} from "@/store/app";
import {useUIStore} from "@/store/ui";

import TrackInfo from '@/components/layout/playbar/TrackInfo.vue';
import VolumeControl from '@/components/layout/playbar/Volume.vue';
import PlayerControls from '@/components/layout/playbar/PlayerControls.vue'
import Lyrics from "@/components/layout/playbar/Lyrics.vue";

import playlist from '@/assets/svg/control/playlist.svg';
import font from '@/assets/svg/menu/font.svg';
import display from '@/assets/svg/menu/display.svg';
import fullscreen from '@/assets/svg/menu/fullscreen.svg';
import close from '@/assets/svg/menu/close.svg';

import play from '@/assets/svg/play/play.svg';
import pause from '@/assets/svg/play/pause.svg';
import next from '@/assets/svg/play/next.svg';

import {useClickOutside} from "@/utils/useClickOutside.ts";
import {findCurrentLineIndex} from "@/utils/lyricParser.ts";

const playStore = usePlayStore();
const appStore = useAppStore();
const uiStore = useUIStore();

const showPlayer = ref(playStore.showPlayer);

// 大屏渐变色
const backgroundStyle = computed(() => ({
  backgroundImage: `linear-gradient(to bottom, ${uiStore.topColor}, ${uiStore.bottomColor})`,
}));

function togglePlay() {
  playStore.togglePlay();
}

function prevTrack() {
  playStore.prevTrack();
}

function nextTrack() {
  playStore.nextTrack();
}

function onProgressChange(value: number) {
  playStore.setCurrentTime(value);
}

function openPlaylist(e: Event) {
  e.stopPropagation();
  //TODO
  console.log('打开播放列表');
}

// 点击底部播放栏，切换大屏显隐
function togglePlayer() {
  showPlayer.value = !showPlayer.value;
}

// 点击大屏半透明遮罩关闭大屏
function closePlayer() {
  showPlayer.value = false;
}

// 切换全屏显示
function toggleFullScreen() {
  const doc = document as any;
  const docEl = document.documentElement as any;

  if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
    // 进入全屏
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  } else {
    // 退出全屏
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }
}


const sliderWrapperRef = ref<HTMLElement | null>(null);

// 点击外部时隐藏滑块
useClickOutside(sliderWrapperRef, () => {
  if (uiStore.showLyricSizeSlider) {
    uiStore.showLyricSizeSlider = false;
  }
});


// 简易模式下获取当前高亮歌词
const currentLyricText = computed(() => {
  return playStore.currentTrack.lrc[playStore.currentLyricIndex]?.text || '';
});

const nextLyricText = computed(() =>
    playStore.currentTrack.lrc[playStore.currentLyricIndex + 1]?.text || ''
);


// 监听简易模式下歌词滚动变化
watch(
    () => playStore.currentTime,
    (newTime) => {
      const lyrics = playStore.currentTrack.lrc || [];
      const newIndex = findCurrentLineIndex(lyrics, newTime);
      if (playStore.currentLyricIndex !== newIndex) {
        playStore.currentLyricIndex = newIndex;
      }
    }
);

</script>

<template>
  <!-- 大屏播放页，覆盖内容区域，不覆盖底部播放栏 -->
  <transition name="slide-up-fade">
    <div
        v-if="showPlayer"
        class="fixed inset-x-0 top-0 bottom-16 bg-opacity-90 text-white z-40 flex flex-col rounded-t-lg transition-colors duration-300"
        :style="backgroundStyle"
        @click.self="closePlayer"
    >
      <!--遮罩层-->
      <div class="absolute inset-0 bg-black opacity-50 pointer-events-none"/>

      <!-- header 区域添加控制按钮 -->
      <header class="flex justify-between items-center p-4 relative z-10">
        <h2 class="text-xl font-bold">{{ appStore.logoText }}</h2>
        <div class="flex items-center gap-3">

          <!-- 字体大小控制 -->
          <div class="relative" ref="sliderWrapperRef">
            <button
                @click="uiStore.toggleSliderVisible"
                title="歌词大小"
                class="w-8 h-8 flex items-center justify-center text-white"
            >
              <img :src="font" alt="" class="w-4 h-4"/>
            </button>

            <!-- 字体大小滑动条 -->
            <transition name="fade">
              <div
                  v-if="uiStore.showLyricSizeSlider"
                  class="absolute top-full mt-2 right-0 bg-black bg-opacity-80 px-4 py-3 rounded shadow z-50 w-60"
              >
                <label for="lyric-size" class="text-sm text-gray-300 block mb-2">
                  歌词大小：{{ uiStore.sizeLabel }}</label>
                <input
                    id="lyric-size"
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    v-model.number="uiStore.lyricFontSizeIndex"
                    class="w-full accent-blue-500"
                />
              </div>
            </transition>
          </div>

          <!-- 显示方式切换 -->
          <button
              @click="uiStore.toggleDisplayMode"
              title="显示方式"
              class="w-8 h-8 flex items-center justify-center"
          >
            <img :src="display" alt="" class="w-5 h-5"/>
          </button>

          <!-- 全屏显示切换 -->
          <button
              @click="toggleFullScreen"
              title="全屏"
              class="w-8 h-8 flex items-center justify-center text-2xl leading-none"
          >
            <img :src="fullscreen" alt="" class="w-6 h-6"/>
          </button>

          <!-- 关闭按钮 -->
          <button
              @click="closePlayer"
              title="关闭"
              class="w-8 h-8 flex items-center justify-center text-2xl leading-none"
          >
            <img :src="close" alt="" class="w-5 h-5"/>
          </button>
        </div>
      </header>

      <!-- 歌词 + 歌曲区域 -->
      <div class="flex-1 overflow-hidden relative">
        <!-- 默认模式 PC Mode (大屏布局左右分栏) -->
        <div
            v-if="uiStore.displayMode === 0 && !appStore.isSmallScreen"
            class="flex flex-col md:flex-row h-full"
        >
          <!-- 歌词 -->
          <div class="w-full md:w-1/2 overflow-y-auto order-1 md:order-2 px-4 py-4">
            <Lyrics/>
          </div>

          <!-- 歌曲信息 + 控件 -->
          <div class="w-full md:w-1/2 order-2 md:order-1 flex flex-col items-center justify-center px-6 py-8">
            <!-- 大屏模式播放器封面与信息 -->
            <img
                :src="playStore.currentTrack.cover"
                alt=""
                class="w-64 h-64 md:w-92 md:h-92 lg:w-[30rem] lg:h-[30rem] max-w-full rounded object-cover bg-gray-800 mb-6"
            />
            <div class="text-2xl font-semibold mb-1 truncate max-w-full text-center">
              {{ playStore.currentTrack.title }}
            </div>
            <div class="text-sm text-gray-400 truncate max-w-full text-center mt-0.5">
              {{ playStore.currentTrack.album }} - {{ playStore.currentTrack.artist }}
            </div>
          </div>
        </div>

        <!-- 小屏简洁模式（仅歌词） -->
        <div v-else-if="uiStore.displayMode === 1" class="h-full flex flex-col">
          <!-- 歌词区域，占据剩余空间，内部滚动 -->
          <div class="flex-1 overflow-hidden">
            <Lyrics/>
          </div>

          <!-- 控制栏，固定底部 -->
          <div
              v-if="appStore.isSmallScreen"
              class="w-full flex justify-center px-4 py-3"
          >
            <div class="w-[36rem]">
              <PlayerControls
                  :currentTrack="playStore.currentTrack"
                  :isPlaying="playStore.isPlay"
                  :currentTime="playStore.currentTime"
                  @togglePlay="togglePlay"
                  @prevTrack="prevTrack"
                  @nextTrack="nextTrack"
                  @progressChange="onProgressChange"
              />
            </div>
          </div>
        </div>


        <!-- 上图下歌词模式 -->
        <div v-else class="flex flex-col h-full">
          <!-- 歌曲信息封面 -->
          <div class="flex flex-col items-center justify-center px-6 py-6">
            <!-- 可重用封面、标题、艺术家 -->
            <img
                :src="playStore.currentTrack.cover"
                alt=""
                class="w-64 h-64 md:w-[27rem] md:h-[27rem] rounded object-cover bg-gray-800 mb-6"
            />
            <div class="text-2xl font-semibold mb-1 truncate max-w-full text-center">
              {{ playStore.currentTrack.title }}
            </div>
            <div class="text-sm text-gray-400 truncate max-w-full text-center mt-0.5">
              {{ playStore.currentTrack.album }} - {{ playStore.currentTrack.artist }}
            </div>
          </div>
          <!-- 当前歌词行，居中显示 -->
          <div class="flex-1 flex flex-col items-center justify-center text-center text-white px-4">
            <!-- 当前高亮歌词 -->
            <div :class="['font-bold', uiStore.highlightFontSizeClass]">
              {{ currentLyricText }}
            </div>

            <!-- 下一句歌词：淡入动画 -->
            <transition name="fade-up" mode="out-in">
              <div
                  :key="nextLyricText"
                  :class="['text-gray-400 mt-2', uiStore.nextLyricFontSizeClass]"
              >
                {{ nextLyricText }}
              </div>
            </transition>
          </div>
          <div v-if="appStore.isSmallScreen" class="px-4 py-3 mt-auto">
            <PlayerControls
                :currentTrack="playStore.currentTrack"
                :isPlaying="playStore.isPlay"
                :currentTime="playStore.currentTime"
                @togglePlay="togglePlay"
                @prevTrack="prevTrack"
                @nextTrack="nextTrack"
                @progressChange="onProgressChange"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>


  <footer
      class="relative bg-gray-900 text-white flex items-center h-16 px-4 select-none z-50"
      :style="{ backgroundColor: showPlayer ? uiStore.bottomColor : '' }"
      @click="togglePlayer"
  >
    <!-- 遮罩 -->
    <div class="absolute inset-0 bg-black opacity-60 pointer-events-none"/>

    <!-- 左侧封面与信息 -->
    <TrackInfo
        :cover="playStore.currentTrack.cover"
        :title="playStore.currentTrack.title"
        :artist="playStore.currentTrack.artist"
    />

    <!-- 中间播放控制，绝对居中 -->
    <div class="absolute left-1/2 -translate-x-1/2 w-[22rem] lg:w-[36rem]">
      <PlayerControls
          :currentTrack="playStore.currentTrack"
          :isPlaying="playStore.isPlay"
          :currentTime="playStore.currentTime"
          @togglePlay="togglePlay"
          @prevTrack="prevTrack"
          @nextTrack="nextTrack"
          @progressChange="onProgressChange"
          v-if="!appStore.isSmallScreen"
      />
    </div>

    <!-- 右侧控制区 -->
    <div class="flex items-center gap-4 ml-auto z-10 h-full" @click.stop>
      <!-- 播放控制按钮 小屏模式-->
      <button
          class="text-gray-400 hover:text-blue-500 transition text-lg select-none"
          @click.stop="playStore.togglePlay"
          title="播放/暂停"
          v-if="appStore.isSmallScreen && !showPlayer"
      >
        <img v-if="!playStore.isPlay" :src="play" alt="" class="w-6 h-6"/>
        <img v-if="playStore.isPlay" :src="pause" alt="" class="w-6 h-6"/>
      </button>
      <button
          class="text-gray-400 hover:text-blue-500 transition text-lg select-none"
          @click.stop="playStore.nextTrack()"
          title="下一首"
          v-if="appStore.isSmallScreen && !showPlayer"
      >
        <img :src="next" alt="" class="w-5 h-5"/>
      </button>

      <!-- 播放方式控制按钮 -->
      <button
          class="text-gray-400 hover:text-blue-500 transition text-lg select-none"
          @click.stop="playStore.togglePlayMode"
          :title="playStore.playModeTitle"
      >
        <img :src="playStore.playModeIcon" alt="" class="w-6 h-6"/>
      </button>

      <!--播放列表控制-->
      <button
          class="text-gray-400 hover:text-blue-500 transition text-lg select-none"
          @click.stop="openPlaylist"
          title="播放列表"
      >
        <img :src="playlist" alt="" class="w-6 h-6"/>
      </button>

      <!--音量控制区-->
      <VolumeControl v-if="!appStore.isSmallScreen"/>
    </div>
  </footer>

</template>

<style scoped>
.slide-up-fade-enter-from,
.slide-up-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-fade-enter-active,
.slide-up-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-fade-enter-to,
.slide-up-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
