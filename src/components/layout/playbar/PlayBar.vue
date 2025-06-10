<script setup lang="ts">
import {computed, nextTick, ref, watch} from 'vue';
import {usePlayStore} from '@/store/play';
import {useAppStore} from '@/store/app';
import {useUIStore} from '@/store/ui';
import {useI18n} from 'vue-i18n';

import Lyrics from '@/components/layout/playbar/Lyrics.vue';
import TrackInfo from '@/components/layout/playbar/TrackInfo.vue';
import VolumeControl from '@/components/layout/playbar/Volume.vue';
import PlayerControls from '@/components/layout/playbar/PlayerControls.vue';

import playlist from '@/assets/svg/control/playlist.svg';
import font from '@/assets/svg/menu/font.svg';
import display from '@/assets/svg/menu/display.svg';
import fullscreen from '@/assets/svg/menu/fullscreen.svg';
import close from '@/assets/svg/menu/close.svg';
import play from '@/assets/svg/play/play.svg';
import pause from '@/assets/svg/play/pause.svg';
import next from '@/assets/svg/play/next.svg';
import light from '@/assets/svg/common/light.svg';

import draggable from 'vuedraggable';
import {useClickOutside} from '@/utils/useClickOutside.ts';
import {findCurrentLineIndex} from '@/utils/lyricParser.ts';
import {formatTime} from '@/utils/time.ts';
import TrackRow from "@/components/layout/playbar/TrackRow.vue";

const playStore = usePlayStore();
const appStore = useAppStore();
const uiStore = useUIStore();
const {t} = useI18n();

const showPlayer = ref(playStore.showPlayer);

// 大屏渐变色
const backgroundStyle = computed(() => ({
  backgroundImage: `linear-gradient(to bottom, ${uiStore.topColor}, ${uiStore.bottomColor})`,
}));

// 播放方式I18n
const playModeTitle = computed(() => t(`playMode.${playStore.playMode}`))

// 字体大小I18n
const sizeLabel = computed(() => {
  const labels = [t('small'), t('medium'), t('large'), t('x_large')];
  return labels[uiStore.lyricFontSizeIndex];
});

// 切换播放
const togglePlay = () => {
  playStore.togglePlay();
}

// 上一首
const prevTrack = () => {
  playStore.prevTrack();
}

// 下一首
const nextTrack = () => {
  playStore.nextTrack();
}

// 拖动进度条事件
const onProgressChange = (value: number) => {
  playStore.setCurrentTime(value);
}

// 切换大屏
const togglePlayer = () => {
  showPlayer.value = !showPlayer.value;
}

// 关闭大屏
const closePlayer = () => {
  showPlayer.value = false;
}

// 切换全屏
const toggleFullScreen = () => {
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

// 字体大小滑块 Ref
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

// 简易模式下获取下行高亮歌词
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

// 播放列表抽屉
const drawer = ref(false);

const isCurrent = (id: number) => {
  const currentTrack = getCurrentList()[playStore.currentIndex];
  return currentTrack?.id === id;
};

const playTrackById = (id: number) => {
  playStore.playSongById(id, true);
};

const getCurrentList = () =>
    playStore.playMode === 3 ? playStore.shuffleList : playStore.playList;

const removeTrackById = (id: number) => {
  playStore.removeTrackFromPlaylist(id);
};

const clearList = () => {
  playStore.clearPlayList();
};

// 自动滚动定位当前播放项
const listContainer = ref<HTMLElement | null>(null);

const scrollToCurrent = async () => {
  await nextTick();
  const currentId = getCurrentList()?.[playStore.currentIndex]?.id;
  if (!currentId || !listContainer.value) return;

  const el = listContainer.value.querySelector(`[data-id="${currentId}"]`);
  if (el && el instanceof HTMLElement) {
    el.scrollIntoView({behavior: 'smooth', block: 'center'});
  }
};

// 拖动实现
const draggedTrackId = ref<number | null>(null);

const listRef = computed({
  get() {
    return playStore.playMode === 3 ? playStore.shuffleList : playStore.playList;
  },
  set(val) {
    if (playStore.playMode === 3) {
      playStore.shuffleList = val;
    } else {
      playStore.playList = val;
    }
  }
});

const onDragStart = () => {
  const list = playStore.playMode === 3 ? playStore.shuffleList : playStore.playList;
  draggedTrackId.value = list[playStore.currentIndex]?.id ?? null;
};

const onDragEnd = () => {
  if (!draggedTrackId.value) return;

  const list = playStore.playMode === 3 ? playStore.shuffleList : playStore.playList;
  const newIndex = list.findIndex(t => t.id === draggedTrackId.value);

  if (newIndex !== -1) {
    playStore.currentIndex = newIndex;
  }

  draggedTrackId.value = null;
};
</script>

<template>

  <!-- 播放列表 -->
  <div>
    <!--el-dom 挂载在根节点才能使v-deep生效-->
    <el-drawer
        v-model="drawer"
        size="360"
        :with-header="false"
        direction="ltr"
        @start="onDragStart"
        @open="scrollToCurrent"
    >
      <div class="bg-gray-900 text-white">
        <!-- header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 class="text-lg font-semibold">{{ t('playlist') }}</h2>
          <button @click="clearList"> {{ t('clear_playlist') }}</button>
        </div>

        <!-- 拖动排序区域 -->
        <div class="overflow-y-auto max-h-[calc(100vh-100px)]" ref="listContainer">
          <draggable
              v-model="listRef"
              item-key="id"
              animation="200"
              ghost-class="bg-gray-800"
              handle=".drag-handle"
              @end="onDragEnd"
          >
            <template #item="{ element: item, index }">
              <TrackRow :track="item"
                        :index="index"
                        :isCurrent="isCurrent(item.id)"
                        @dblclick="playTrackById(item.id)"
                        @remove="removeTrackById(item.id)"
              />
            </template>
          </draggable>
        </div>
      </div>
    </el-drawer>
  </div>

  <!-- 大屏播放页 -->
  <transition name="slide-up-fade">
    <div
        v-if="showPlayer"
        class="fixed inset-x-0 top-0 bottom-16 bg-opacity-90 text-white z-40
         flex flex-col rounded-t-lg transition-[background] duration-300"
        :style="backgroundStyle"
        @click.self="closePlayer"
    >
      <!--遮罩层-->
      <div
          class="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
          :class="uiStore.immerseMode ? 'opacity-92' : 'opacity-50'"
      />

      <!-- header 区域 -->
      <header class="flex justify-between items-center p-4 relative z-10">
        <h2 class="text-xl font-bold">{{ appStore.logoText }}</h2>
        <div class="flex items-center gap-3">

          <!-- 显示沉浸模式按钮 -->
          <button
              @click="uiStore.toggleImmerseMode"
              :title="t('immerse_mode_alt')"
              class="w-8 h-8 flex items-center justify-center"
          >
            <img :src="light" :alt="t('immerse_mode_alt')" class="w-6 h-6"/>
          </button>

          <!-- 字体大小按钮 -->
          <div class="relative" ref="sliderWrapperRef">
            <button
                @click="uiStore.toggleSliderVisible"
                :title="t('lyrics_font_size')"
                class="w-8 h-8 flex items-center justify-center text-white"
            >
              <img :src="font" :alt="t('lyrics_font_alt')" class="w-4 h-4"/>
            </button>

            <!-- 字体大小滑动条 -->
            <transition name="fade">
              <div
                  v-if="uiStore.showLyricSizeSlider"
                  class="absolute top-full mt-2 right-0 bg-black bg-opacity-80
                  px-4 py-3 rounded shadow z-50 w-60"
              >
                <label for="lyric-size" class="text-sm text-gray-300 block mb-2">
                  {{ t('lyrics_font_size') }}：{{ sizeLabel }}</label>
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

          <!-- 显示方式按钮 -->
          <button
              @click="uiStore.toggleDisplayMode"
              :title="t('display_type_alt')"
              class="w-8 h-8 flex items-center justify-center"
          >
            <img :src="display" :alt="t('display_type_alt')" class="w-5 h-5"/>
          </button>

          <!-- 全屏切换按钮 -->
          <button
              @click="toggleFullScreen"
              :title="t('fullscreen_alt')"
              class="w-8 h-8 flex items-center justify-center text-2xl leading-none"
          >
            <img :src="fullscreen" :alt="t('fullscreen_alt')" class="w-6 h-6"/>
          </button>

          <!-- 关闭按钮 -->
          <button
              @click="closePlayer"
              :title="t('close_alt')"
              class="w-8 h-8 flex items-center justify-center text-2xl leading-none"
          >
            <img :src="close" :alt="t('close_alt')" class="w-5 h-5"/>
          </button>
        </div>
      </header>

      <!-- Main 内容区域 -->
      <div class="flex-1 overflow-hidden relative">
        <!-- 默认模式-0 PC Mode (大屏布局左右分栏) -->
        <div
            v-if="uiStore.displayMode === 0 && !appStore.isSmallScreen"
            class="flex flex-col md:flex-row h-full"
        >
          <!-- 歌词区域 -->
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

        <!-- 歌词模式-1 -->
        <div v-else-if="uiStore.displayMode === 1" class="h-full flex flex-col">
          <!-- 歌词区域 -->
          <div class="flex-1 overflow-hidden">
            <Lyrics/>
          </div>

          <!-- 控制栏 -->
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

        <!-- 简洁模式-2 -->
        <div v-else class="flex flex-col h-full">
          <!-- 歌曲信息 -->
          <div class="flex flex-col items-center justify-center px-6 py-6">
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

          <!-- 歌词行，居中显示 -->
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

          <!-- 控制栏 -->
          <div v-if="appStore.isSmallScreen"
               class="px-4 py-3 mt-auto">
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
    <div
        class="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
        :class="uiStore.immerseMode ? 'opacity-100' : 'opacity-60'"
    />

    <!-- 左侧封面与信息 -->
    <TrackInfo
        :cover="playStore.currentTrack.cover"
        :title="playStore.currentTrack.title"
        :artist="playStore.currentTrack.artist"
    />

    <!-- 播放控制器 -->
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
      <!-- 小屏模式- 播放进度条 -->
      <div class="text-xs text-gray-200" v-if="appStore.isSmallScreen && !showPlayer">
        <p>{{ formatTime(playStore.currentTime) }} / {{ formatTime(playStore.currentTrack.duration) }}</p>
      </div>

      <!-- 小屏模式- 播放控制按钮 -->
      <!-- 播放/暂停按钮 -->
      <button
          class="text-gray-400 hover:text-blue-500 transition text-lg select-none"
          @click.stop="playStore.togglePlay"
          :title="t('play_pause_alt')"
          v-if="appStore.isSmallScreen && !showPlayer"
      >
        <img v-if="!playStore.isPlay" :src="play" :alt="t('play_alt')" class="w-6 h-6"/>
        <img v-if="playStore.isPlay" :src="pause" :alt="t('pause_alt')" class="w-6 h-6"/>
      </button>

      <!-- 下一首按钮 -->
      <button
          class="text-gray-400 hover:text-blue-500 transition text-lg select-none"
          @click.stop="playStore.nextTrack()"
          :title="t('next_track_alt')"
          v-if="appStore.isSmallScreen && !showPlayer"
      >
        <img :src="next" :alt="t('next_track_alt')" class="w-5 h-5"/>
      </button>

      <!-- 播放方式控制按钮 -->
      <button
          class="text-gray-400 hover:text-blue-500 transition text-lg select-none"
          @click.stop="playStore.togglePlayMode"
          :title="playModeTitle"
      >
        <img :src="playStore.playModeIcon" :alt="playModeTitle" class="w-6 h-6"/>
      </button>

      <!--播放列表控制-->
      <button
          class="text-gray-400 hover:text-blue-500 transition text-lg select-none"
          @click.stop="drawer = true;"
          :title="t('playlist_alt')"
      >
        <img :src="playlist" :alt="t('playlist_alt')" class="w-6 h-6"/>
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

::v-deep(.el-drawer__body) {
  margin-top: 20px;
  padding: 0;
}

::v-deep(.el-drawer) {
  background-color: transparent;
  --el-drawer-bg-color: transparent;
}

</style>
