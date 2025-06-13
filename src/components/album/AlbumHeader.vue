<script setup lang="ts">
import {ref, onBeforeUnmount, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useClickOutside} from '@/utils/useClickOutside.ts'

import size from '@/assets/svg/common/size.svg'
import check from '@/assets/svg/common/check.svg'
import sortAsc from '@/assets/svg/common/sort.svg'
import sortDesc from '@/assets/svg/common/sort-converse.svg'
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
  <div class="text-white border-b border-gray-700 sticky top-0 backdrop-blur z-30">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- 左侧：搜索框 -->
      <div class="relative w-48">
        <input
            v-model="localSearchText"
            type="text"
            :placeholder="t('search_placeholder')"
            class="px-2 py-1 pr-6 rounded border border-gray-600 text-sm focus:outline-none focus:border-blue-400 w-full bg-transparent"
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

      <!-- 右侧：排序 + 大小 -->
      <div class="relative flex items-center gap-2 text-sm">
        <!-- 排序按钮 -->
        <button
            class="flex items-center p-1 rounded hover:border-blue-400"
            @click="toggleSort"
        >
          <img :src="sortOrder === 'asc' ? sortAsc : sortDesc" alt="sort" class="w-4 h-4"/>
        </button>

        <!-- 大小按钮 -->
        <div ref="dropdownRef" class="relative">
          <button
              class="flex items-center p-1 rounded hover:border-green-400 size-btn"
              @click="toggleDropdown"
          >
            <img :src="size" :alt="t('cover_size_alt')" class="w-4 h-4"/>
          </button>

          <!-- 弹窗 -->
          <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-600 rounded shadow-lg z-50 size-popup"
          >
            <div
                v-for="item in coverSizes"
                :key="item.value"
                class="px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                @click="emit('updateSize', item.value); showDropdown = false"
            >
              <span>{{ t('cover_size.' + item.label) }}</span>
              <span v-if="item.value === props.size">
                <img :src="check" alt="" class="w-4 h-4"/>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
