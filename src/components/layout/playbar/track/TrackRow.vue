<!-- 播放列表歌曲 item 组件 -->
<script setup lang="ts">
import {useI18n} from 'vue-i18n'

defineProps<{
  track: any
  index: number
  isCurrent: boolean
  shuffle?: boolean
}>()

defineEmits(['click', 'remove'])

const {t} = useI18n()
</script>

<template>
  <div
      class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-bg-hover transition no-bg-transition"
      :class="{ 'bg-bg-hover': isCurrent }"
      :data-id="track.id"
      @click="$emit('click')"
  >
    <!-- 拖动图标 -->
    <svgIcon v-if="!$props.shuffle"
             name="common-drag-handle"
             class-name="drag-handle w-3 h-4 mr-2 cursor-move text-text-light"
    />

    <!-- 序号 -->
    <span class="w-6 mr-2 text-center text-sm text-text-light">{{ index + 1 }}</span>

    <!-- 封面和信息 -->
    <div class="flex items-center gap-3 flex-1">
      <div class="w-10 h-10 rounded overflow-hidden flex items-center justify-center">
        <img
            v-if="track.cover"
            :src="track.cover"
            alt="cover"
            class="w-full h-full object-cover"
        />
        <svgIcon v-else name="default-default-cover" class-name="icon"/>
      </div>
      <div class="text-sm truncate">
        <p class="font-medium truncate max-w-[180px]">{{ track.title || t('unknown_title') }}</p>
        <p class="text-xs text-text-light">
          {{ track.artist || t('unknown_artist') }}
          <span v-if="isCurrent" class="text-green-400 ml-2 select-none">{{ t('is_playing') }}</span>
        </p>
      </div>
    </div>

    <!-- 删除按钮 -->
    <svgIcon name="common-delete-light" class-name="w-4 h-4 icon" @click.stop="$emit('remove')"/>
  </div>
</template>
