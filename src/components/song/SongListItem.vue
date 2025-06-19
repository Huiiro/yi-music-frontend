<!-- 歌曲列表 item 组件 -->
<script setup lang="ts">
import {ref, computed} from 'vue'
import {useClickOutside} from '@/utils/useClickOutside'
import {useI18n} from 'vue-i18n'
import {useMenuDirection} from '@/utils/useMenuDirection.ts'
import {useRoute} from 'vue-router'
import router from '@/router'
import defaultCover from '@/assets/svg/default/default-cover.svg'
import SongMenuItem from '@/components/song/SongMenuItem.vue'

const props = defineProps<{
  index: number
  title: string
  artist: string
  album: string
  duration: string
  cover: string | null
  activeMenuIndex: number | null
  multiSelectMode?: boolean
  selected?: boolean
  searchKeyword?: string
}>()

const emit = defineEmits<{
  (e: 'openMenu', index: number): void
  (e: 'closeMenu'): void
  (e: 'playSong', index: number): void
  (e: 'toggleSelect'): void
}>()

const {t} = useI18n()
const menuRef = ref<HTMLElement | null>(null)
const isMenuOpen = computed(() => props.activeMenuIndex === props.index)
const {menuDirection} = useMenuDirection(menuRef, isMenuOpen)
const route = useRoute()

// 高亮查询关键词
const highlightText = (text: string): string => {
  if (!props.searchKeyword) return text

  const escapedKeyword = props.searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeyword})`, 'ig')
  return text.replace(regex, '<mark class="bg-yellow-400 text-black">$1</mark>')
}

// 外部点击关闭菜单
useClickOutside(menuRef, () => {
  if (isMenuOpen.value) emit('closeMenu')
})

// 打开菜单
const toggleMenu = () => {
  if (isMenuOpen.value) {
    emit('closeMenu')
  } else {
    emit('openMenu', props.index)
  }
}

// 双击播放
const handleDoubleClick = () => {
  emit('playSong', props.index)
}


const handleClickAlbumDetail = (e: MouseEvent) => {
  const targetPath = '/album/detail'
  const targetQuery = {
    albumName: props.album,
    artistName: props.artist,
    albumCover: props.cover,
  }
  const isSameRoute =
      route.path === targetPath &&
      route.query.albumName === targetQuery.albumName &&
      route.query.artistName === targetQuery.artistName

  if (isSameRoute) {
    e.preventDefault();
  } else {
    router.push({path: targetPath, query: targetQuery});
  }
}

const handleClickArtistDetail = (e: MouseEvent) => {
  const targetPath = '/artist/detail'
  const targetQuery = {
    artistName: props.artist,
    albumCover: props.cover,
  }
  const isSameRoute =
      route.path === targetPath &&
      route.query.artistName === targetQuery.artistName

  if (isSameRoute) {
    e.preventDefault();
  } else {
    router.push({path: targetPath, query: targetQuery});
  }
}

</script>

<template>
  <div class="w-full text-text" @dblclick="handleDoubleClick">
    <!-- Row -->
    <div class="flex items-center px-4 py-3 hover:bg-bg-light transition group relative">

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
      <div class="w-8 text-sm text-text-light">
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
        <div class="cursor-default font-medium truncate" v-html="highlightText(props.title)"/>
        <div class="text-sm text-text-light truncate">
          <span       @click="handleClickArtistDetail"
                      class="cursor-pointer hover:underline hover:text-text-hover"
                      v-html="highlightText(props.artist)"/>
          &nbsp;-&nbsp;
          <span
                      @click="handleClickAlbumDetail"
                      class="cursor-pointer hover:underline hover:text-text-hover"
                      v-html="highlightText(props.album)"/>
        </div>
      </div>

      <!-- 时长 -->
      <div class="w-16 text-right text-sm text-text-light select-none">
        {{ props.duration }}
      </div>

      <!-- 操作菜单按钮 + 菜单 -->
      <div class="ml-4 mr-2 relative flex items-center justify-center" ref="menuRef">
        <button @click.stop="toggleMenu" class="hover:text-primary">
          <svgIcon name="menu-more-horizontal" class-name="w-5 h-5 icon"/>
        </button>

        <!-- 菜单 -->
        <div
            v-if="isMenuOpen"
            class="absolute right-0 w-40 bg-bg-light text-text rounded shadow-lg
            z-[1000] overflow-hidden text-sm"
            :class="menuDirection === 'top'
            ? 'bottom-full mb-2'
            : 'top-full mt-2'"
        >
          <SongMenuItem class="hover:bg-bg-hover"
                        icon="play-play" :label="t('play_now')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem class="hover:bg-bg-hover"
                        icon="play-play" :label="t('play_next')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem class="hover:bg-bg-hover"
                        icon="common-plus" :label="t('add_song_list_library')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem class="hover:bg-bg-hover"
                        icon="common-plus" :label="t('add_playlist')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem class="hover:bg-bg-hover"
                        icon="menu-artist" :label="t('show_artist')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem class="hover:bg-bg-hover"
                        icon="menu-album" :label="t('show_album')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem class="hover:bg-bg-hover"
                        icon="common-detail" :label="t('show_detail')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
          <SongMenuItem class="hover:bg-bg-hover"
                        icon="common-delete" :label="t('delete')"
                        @click="() => { /* 执行详情逻辑 */ emit('closeMenu') }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
