<!-- 专辑页面头部 -->
<script setup lang="ts">
import {ref, onBeforeUnmount, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useClickOutside} from '@/utils/useClickOutside.ts'
import {CONSTANTS} from '@/plugins/consts.ts'

const props = defineProps<{
  size: number
}>()

const emit = defineEmits<{
  (e: 'updateSize', val: number): void
  (e: 'updateSearch', val: string): void
  (e: 'updateSort', val: string): void
}>()

const {t} = useI18n()
const localSearchText = ref('')
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const sortOrder = ref<'asc' | 'desc'>('asc')
const coverSizes = [
  {label: 'small', value: 100},
  {label: 'medium', value: 140},
  {label: 'large', value: 180},
  {label: 'over_size', value: 220}
]

// 切换排序
const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  emit('updateSort', sortOrder.value)
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

useClickOutside(dropdownRef, () => {
  showDropdown.value = false
})

// 搜索防抖
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
  <div class="text-text border-b border-border sticky top-0 backdrop-blur z-30">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- 左侧：搜索框 -->
      <div class="relative w-48">
        <input
            v-model="localSearchText"
            type="text"
            :placeholder="t('search_album_placeholder')"
            class="px-2 py-1 pr-6 rounded border border-border
            text-text text-sm focus:outline-none focus:border-blue-400 w-full bg-transparent"
        />
        <button
            v-if="localSearchText"
            class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
            @click="localSearchText = ''"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- 右侧：排序 + 大小 -->
      <div class="relative flex items-center gap-2 text-sm">
        <!-- 排序按钮 -->
        <button
            class="flex items-center p-1 rounded hover:text-primary"
            @click="toggleSort"
        >
          <svgIcon :name="sortOrder === 'asc' ? 'common-sort' : 'common-sort-converse'" class-name="w-4 h-4 icon"/>
        </button>

        <!-- 大小按钮 -->
        <div ref="dropdownRef" class="relative">
          <button
              class="flex items-center p-1 rounded hover:text-primary size-btn"
              @click="toggleDropdown"
          >
            <svgIcon name="common-size" class-name="w-4 h-4 icon"/>
          </button>

          <!-- 弹窗 -->
          <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-32 bg-bg-light border border-border rounded shadow-lg z-50 size-popup"
          >
            <div
                v-for="item in coverSizes"
                :key="item.value"
                class="px-4 py-2 hover:bg-bg-hover cursor-pointer flex justify-between items-center"
                @click="emit('updateSize', item.value); showDropdown = false"
            >
              <span>{{ t('cover_size.' + item.label) }}</span>
              <span v-if="item.value === props.size">
                <svgIcon name="common-check" class-name="w-4 h-4 icon"/>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
