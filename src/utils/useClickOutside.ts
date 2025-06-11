import {onMounted, onBeforeUnmount, type Ref} from 'vue'

/**
 * 封装公共函数 -- 点击外部关闭
 * @param targetEl
 * @param callback
 */
export function useClickOutside(targetEl: Ref<HTMLElement | null>, callback: () => void) {
    const listener = (e: MouseEvent) => {
        if (!targetEl.value) return
        if (!targetEl.value.contains(e.target as Node)) {
            callback()
        }
    }

    onMounted(() => {
        document.addEventListener('click', listener)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('click', listener)
    })
}
