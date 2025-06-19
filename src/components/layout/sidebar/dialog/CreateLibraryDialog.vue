<!-- 创建曲库对话框 -->
<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {CONSTANTS} from '@/plugins/consts.ts'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm', name: string): void
}>()

const {t} = useI18n()

const visible = ref(props.modelValue)
watch(() => props.modelValue, (val) => (visible.value = val))
watch(visible, (val) => emit('update:modelValue', val))

const libraryName = ref('')
const maxLength = CONSTANTS.LIBRARY_NAME_MAX_SIZE

const nameError = computed(() => {
  if (!libraryName.value.trim()) return t('error_library_name_required')
  if (libraryName.value.length > maxLength) return t('error_library_name_too_long', {max: maxLength})
  return ''
})

const handleConfirm = () => {
  if (nameError.value) return
  emit('confirm', libraryName.value.trim())
  visible.value = false
  libraryName.value = ''
}

const reset = () => {
  libraryName.value = ''
}
</script>

<template>
  <div class="create-library-dialog">
    <el-dialog
        v-model="visible"
        :title="t('create_library')"
        width="350"
        top="30vh"
        @closed="reset"
    >
      <div class="space-y-2 px-2 py-2">
        <label class="block text-sm text-gray-300">
          <input
              v-model="libraryName"
              type="text"
              :placeholder="t('create_library_placeholder')"
              class="mt-1 w-full px-3 py-2 bg-bg text-text
                     border rounded focus:outline-none focus:ring-2"
              :class="{
              'border-gray-600 focus:ring-blue-500': !nameError,
              'border-red-500 focus:ring-red-500': nameError
            }"
          />
        </label>
        <p v-if="nameError" class="text-xs text-red-500">
          {{ nameError }}
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2 px-4 pb-4">
          <button
              @click="visible = false"
              class="px-4 py-1 rounded border border-gray-500
              text-sm text-text hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {{ t('cancel') }}
          </button>
          <button
              :disabled="!!nameError"
              @click="handleConfirm"
              :class="[
              'px-4 py-1 rounded text-sm',
              nameError
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            {{ t('confirm') }}
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>