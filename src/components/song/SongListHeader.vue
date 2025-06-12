<!-- 歌曲列表 header 组件 -->
<script setup lang="ts">
import {computed, onBeforeUnmount, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'

import plus from '@/assets/svg/common/plus.svg'
import deleteIcon from '@/assets/svg/common/delete.svg'
import play from '@/assets/svg/play/play.svg'
import task from '@/assets/svg/common/task.svg'
import sort from '@/assets/svg/common/sort.svg'
import {useClickOutside} from '@/utils/useClickOutside.ts'
import {CONSTANTS} from '@/plugins/consts.ts'

const props = defineProps<{
  multiSelectMode: boolean,
  selectedCount: number,
  sortType: string,
  sortOrder: 'asc' | 'desc',
  searchText: string,
  isAllSelected: boolean,
}>()

const emit = defineEmits<{
  (e: 'toggleMultiSelect'): void,
  (e: 'updateSort', type: string): void,
  (e: 'updateSearch', text: string): void,
  (e: 'batchPlay'): void,
  (e: 'batchAdd'): void,
  (e: 'batchDelete'): void,
  (e: 'toggleSelectAll'): void,
}>()

const {t} = useI18n()
const localSearchText = ref(props.searchText)
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const sortKeys = computed(() => [
  {value: 'default', label: t('sort_by_default')},
  {value: 'title', label: t('sort_by_title')},
  {value: 'artist', label: t('sort_by_artist')},
  {value: 'album', label: t('sort_by_album')},
  {value: 'duration', label: t('sort_by_duration')},
])

// 切换打开菜单
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 选择排序条件
const handleSelect = (key: string) => {
  emit('updateSort', key)
  showDropdown.value = false
}

// 点击外部关闭
useClickOutside(dropdownRef, () => {
  showDropdown.value = false
})

// 获取查询输入
watch(localSearchText, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    emit('updateSearch', val.trim())
  }, CONSTANTS.DEBOUNCE)
})

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

</script>

<template>
  <div class="text-white border-b border-gray-700">
    <!-- 顶部主操作行 -->
    <div class="flex items-center justify-between px-4 py-3">
      <!-- 左侧：多选 -->
      <div class="flex items-center gap-2">
        <button
            class="px-3 py-1 border border-gray-600 rounded text-sm hover:bg-gray-800 flex items-center gap-1"
            @click="emit('toggleMultiSelect')"
        >
          <img :src="task" alt="" class="w-4 h-4"/>
          {{ multiSelectMode ? t('cancel_selection') : t('multi_select') }}
        </button>

        <!-- 左侧：搜索框 -->
        <div class="relative w-48">
          <input
              v-model="localSearchText"
              type="text"
              :placeholder="t('search_placeholder')"
              class="px-2 py-1 pr-6 rounded bg-gray-800 border border-gray-600 text-sm focus:outline-none focus:border-blue-400 w-full"
          />
          <button
              v-if="localSearchText"
              class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              @click="localSearchText = ''"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 右侧：排序 -->
      <div ref="dropdownRef" class="relative sort-dropdown text-sm text-white">
        <button
            class="flex items-center justify-between w-14 px-3 py-2  rounded hover:border-blue-400"
            @click="toggleDropdown"
        >
          <img :src="sort" alt="" class="w-4 h-4"/>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2"
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- 下拉菜单选项卡 -->
        <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded shadow-lg z-50"
        >
          <div
              v-for="key in sortKeys"
              :key="key.value"
              class="px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
              @click="handleSelect(key.value)"
          >
            <span>{{ key.label }}</span>
            <span v-if="key.value === props.sortType">
          {{ props.sortOrder === 'asc' ? '↑' : '↓' }}
        </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部批量操作行 -->
    <div v-if="multiSelectMode" class="flex items-center justify-between px-4 pb-3 text-sm">
      <div class="flex items-center gap-3">
        <!-- 全选 / 取消全选 -->
        <button class="hover:text-yellow-400" @click="emit('toggleSelectAll')">
          {{ isAllSelected ? t('unselect_all') : t('select_all') }}
        </button>

        <!-- 批量播放 -->
        <button
            :disabled="selectedCount === 0"
            class="flex items-center gap-1"
            :class=" selectedCount == 0 ? 'opacity-50 cursor-not-allowed': 'hover:text-blue-200' "
            @click="emit('batchPlay')"
        >
          <img :src="play" alt="" class="w-4 h-4"/>
          {{ t('play') }}
        </button>

        <!-- 批量添加 -->
        <button
            :disabled="selectedCount === 0"
            class="flex items-center gap-1"
            :class=" selectedCount == 0 ? 'opacity-50 cursor-not-allowed': 'hover:text-green-200' "
            @click="emit('batchAdd')"
        >
          <img :src="plus" alt="" class="w-4 h-4"/>
          {{ t('add') }}
        </button>

        <!-- 批量删除 -->
        <button
            :disabled="selectedCount === 0"
            class="flex items-center gap-1 "
            :class=" selectedCount == 0 ? 'opacity-50 cursor-not-allowed': 'hover:text-red-200' "
            @click="emit('batchDelete')"
        >
          <img :src="deleteIcon" alt="" class="w-4 h-4"/>
          {{ t('delete') }}
        </button>

        <!-- 已选中数量 -->
        <span>
          {{ t('selected') }} {{ selectedCount }} {{ t('selected_items') }}
        </span>
      </div>
    </div>

  </div>
</template>

<style scoped>
select {
  appearance: none;
}
</style>
