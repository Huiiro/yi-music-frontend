<script setup lang="ts">
import {ref, computed} from 'vue';
import {useClickOutside} from '@/utils/useClickOutside';
import {useI18n} from 'vue-i18n';

import more from '@/assets/svg/menu/more-horizontal.svg';
import play from '@/assets/svg/play/play.svg';
import plus from '@/assets/svg/common/plus.svg';
import detail from '@/assets/svg/common/detail.svg';
import artist from '@/assets/svg/menu/artist.svg';
import album from '@/assets/svg/menu/album.svg';
import deleteWarning from '@/assets/svg/common/delete-red.svg';
import defaultCover from '@/assets/svg/default/default-cover.svg';

import SongMenuItem from '@/components/song/SongMenuItem.vue';
import {useMenuDirection} from '@/utils/useMenuDirection.ts';

const {t} = useI18n();

const props = defineProps<{
  index: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string | null;
  activeMenuIndex: number | null;
  multiSelectMode?: boolean,
  selected?: boolean
}>();

const emit = defineEmits<{
  (e: 'openMenu', index: number): void;
  (e: 'closeMenu'): void;
  (e: 'playSong', index: number): void;
  (e: 'toggleSelect'): void;
}>();

const menuRef = ref<HTMLElement | null>(null);
const isMenuOpen = computed(() => props.activeMenuIndex === props.index);

const {menuDirection} = useMenuDirection(menuRef, isMenuOpen);

// 外部点击关闭菜单
useClickOutside(menuRef, () => {
  if (isMenuOpen.value) emit('closeMenu');
});

// 打开菜单
const toggleMenu = () => {
  if (isMenuOpen.value) {
    emit('closeMenu');
  } else {
    emit('openMenu', props.index);
  }
};

// 双击播放
const handleDoubleClick = () => {
  emit('playSong', props.index);
}

</script>

<template>
  <div class="w-full text-white" @dblclick="handleDoubleClick">
    <!-- Row -->
    <div class="flex items-center px-4 py-3 hover:bg-gray-800 transition group relative">

      <!-- 多选框 -->
      <div v-if="multiSelectMode" class="w-6 flex justify-center pr-4">
        <input
            type="checkbox"
            class="form-checkbox accent-blue-500 cursor-pointer"
            :checked="selected"
            @click.stop="$emit('toggleSelect')"
        />
      </div>

      <!-- 序号 -->
      <div class="w-8 text-sm text-gray-400">
        {{ props.index }}
      </div>

      <!-- 封面 -->
      <img
          :src="props.cover ? props.cover : defaultCover"
          alt="cover"
          class="w-12 h-12 rounded object-cover bg-gray-700 mx-3"
      />

      <!-- 歌曲信息 -->
      <div class="flex flex-col flex-1 truncate">
        <div class="font-medium truncate">{{ props.title }}</div>
        <div class="text-sm text-gray-400 truncate">
          <RouterLink :to="`/artist/${props.artist}`" class="hover:underline hover:text-white">
            {{ props.artist }}
          </RouterLink>
          &nbsp;-&nbsp;
          <RouterLink :to="`/album/${props.album}`" class="hover:underline hover:text-white">
            {{ props.album }}
          </RouterLink>
        </div>
      </div>

      <!-- 时长 -->
      <div class="w-16 text-right text-sm text-gray-400 select-none">
        {{ props.duration }}
      </div>

      <!-- 操作菜单按钮 + 菜单 -->
      <div class="ml-4 mr-2 relative flex items-center justify-center" ref="menuRef">
        <button @click.stop="toggleMenu" class="hover:text-blue-500 text-gray-400">
          <img :src="more" :alt="t('menu_alt')" class="w-4 h-4"/>
        </button>

        <!-- 菜单 -->
        <div
            v-if="isMenuOpen"
            class="absolute right-0 w-40 bg-gray-800 text-white rounded shadow-lg
            z-[1000] overflow-hidden text-sm"
            :class="menuDirection === 'top'
            ? 'bottom-full mb-2'
            : 'top-full mt-2'"
        >
          <SongMenuItem :icon="play" :label="t('play_now')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem :icon="play" :label="t('play_next')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem :icon="plus" :label="t('add_song_list_library')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem :icon="plus" :label="t('add_playlist')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem :icon="artist" :label="t('show_artist')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem :icon="album" :label="t('show_album')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem :icon="detail" :label="t('show_detail')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem :icon="deleteWarning" :label="t('delete')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
