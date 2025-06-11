<!-- 播放列表歌曲 item 组件 -->
<script setup lang="ts">
import drag from '@/assets/svg/common/drag-handle.svg'
import deleteLight from '@/assets/svg/common/delete-light.svg'
import defaultCover from '@/assets/svg/default/default-cover.svg'
import {useI18n} from 'vue-i18n'

defineProps<{
  track: any,
  index: number,
  isCurrent: boolean,
  shuffle?: boolean,
}>()

defineEmits(['click', 'remove'])

const {t} = useI18n();
</script>

<template>
  <div
      class="flex items-center justify-between px-4 py-2 hover:bg-gray-800 transition cursor-pointer"
      :class="{ 'bg-gray-700': isCurrent }"
      :data-id="track.id"
      @click="$emit('click')"
  >
    <!-- 拖动图标 -->
    <img :src="drag" alt="" class=" drag-handle w-3 h-4 mr-2 cursor-move text-gray-400" v-if="!$props.shuffle"/>

    <!-- 序号 -->
    <span class="w-6 text-center text-sm text-gray-400 mr-2">{{ index + 1 }}</span>

    <!-- 封面和信息 -->
    <div class="flex items-center gap-3 flex-1">
      <img
          :src="track.cover ? track.cover : defaultCover"
          alt="cover"
          class="w-10 h-10 rounded object-cover bg-gray-600"
      />
      <div class="text-sm truncate">
        <p class="font-medium truncate max-w-[180px]">{{ track.title || t('unknown_title') }}</p>
        <p class="text-xs text-gray-400">
          {{ track.artist || t('unknown_artist') }}
          <span v-if="isCurrent" class="text-green-400 ml-2">{{ t('is_playing') }}</span>
        </p>
      </div>
    </div>

    <!-- 删除按钮 -->
    <img :src="deleteLight" alt="" class="w-4 h-4" @click.stop="$emit('remove')">
  </div>
</template>