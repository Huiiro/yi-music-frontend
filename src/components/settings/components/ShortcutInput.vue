<!-- 快捷键输入组件 -->
<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/store/settings'
import {useI18n} from 'vue-i18n'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  action: keyof typeof settingsStore.shortcutKeys
}>()

const {t} = useI18n()
const settingsStore = useSettingsStore()
const inputRef = ref<HTMLInputElement | null>(null)

// 格式化快捷键显示
const formatKey = (key: string) => {
  if (!key) return ''
  const isMac = /mac/i.test(navigator.platform)

  return key
      .split('+')
      .map(k => {
        const lower = k.toLowerCase()
        const map: Record<string, string> = {
          'ctrl': isMac ? '⌃' : 'Ctrl',
          'shift': isMac ? '⇧' : 'Shift',
          'alt': isMac ? '⌥' : 'Alt',
          'meta': isMac ? '⌘' : 'Meta',
          ' ': 'Space',
          'arrowleft': '←',
          'arrowright': '→',
          'arrowup': '↑',
          'arrowdown': '↓',
        }
        return map[lower] || k.toUpperCase()
      })
      .join(isMac ? '' : ' + ')
}

const isModifierOnly = (e: KeyboardEvent): boolean => {
  return (
      e.key === 'Shift' ||
      e.key === 'Control' ||
      e.key === 'Alt' ||
      e.key === 'Meta'
  )
}

const normalizeKey = (e: KeyboardEvent): string => {
  const keys: string[] = []

  if (e.ctrlKey) keys.push('ctrl')
  if (e.altKey) keys.push('alt')
  if (e.metaKey) keys.push('meta')
  if (e.shiftKey) keys.push('shift')

  const key = e.key.toLowerCase()

  if (isModifierOnly(e)) return ''

  keys.push(key)
  return keys.join('+')
}

// 判断是否重复
const isKeyInUse = (key: string, except?: string): boolean => {
  return Object.entries(settingsStore.shortcutKeys).some(
      ([k, v]) => v === key && k !== except
  )
}

const onKeydown = (e: KeyboardEvent) => {
  // 阻止浏览器事件 和 监听器事件传递
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()

  if (isModifierOnly(e)) return

  const key = normalizeKey(e)
  if (!key) return

  if (isKeyInUse(key, props.action)) {
    ElMessage.warning(`"${formatKey(key)}" ${t('shortcut_keys_repeat')}`)
    return
  }

  settingsStore.shortcutKeys[props.action] = key
  inputRef.value?.blur()
}
</script>

<template>
  <div class="relative w-32">
    <input
        ref="inputRef"
        class="shortcut-input w-full text-text text-center border border-border rounded
        outline-none px-1 py-1 focus:border-primary"
        :value="formatKey(settingsStore.shortcutKeys[props.action])"
        @keydown="onKeydown"
        readonly
    />
    <button
        class="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-red-400 hover:text-red-600 pr-2"
        @click="settingsStore.shortcutKeys[props.action] = ''"
        :title="t('shortcut_keys_clear')"
    >
      ✕
    </button>
  </div>
</template>