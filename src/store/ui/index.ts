import {defineStore} from 'pinia'

export const useUIStore = defineStore('ui', {
    state: () => ({
        // 歌词大小
        lyricFontSizeIndex: 1,
        fontSizeOptions: ['text-sm', 'text-xl', 'text-2xl', 'text-3xl'],
        leadingOptions: ['leading-10', 'leading-12', 'leading-16', 'leading-18'],
        sizeLabels: ['小', '中', '大', '特大'],
        showLyricSizeSlider: false,
        // 大屏模式
        // 0: 默认大屏, 1: 歌词模式, 2: 简洁模式
        displayMode: 0,
        // 沉浸模式
        immerseMode: false,
        // 通透模式
        transparentMode: false,
    }),
    getters: {
        lyricFontSizeClass: (state) =>
            state.fontSizeOptions[state.lyricFontSizeIndex],

        highlightFontSizeClass: (state) => {
            const nextIndex = Math.min(
                state.lyricFontSizeIndex + 1,
                state.fontSizeOptions.length - 1
            )
            return state.fontSizeOptions[nextIndex]
        },

        nextLyricFontSizeClass: (state) =>
            state.fontSizeOptions[Math.max(state.lyricFontSizeIndex - 1, 0)],

        lyricLeadingClass: (state) =>
            state.leadingOptions[state.lyricFontSizeIndex],

        highlightLeadingClass: (state) => {
            const nextIndex = Math.min(
                state.lyricFontSizeIndex + 1,
                state.leadingOptions.length - 1
            )
            return state.leadingOptions[nextIndex]
        }
    },
    actions: {
        toggleSliderVisible() {
            this.showLyricSizeSlider = !this.showLyricSizeSlider
        },
        toggleDisplayMode() {
            if (window.innerWidth < 768) {
                // 小屏下 只支持两种切换方式
                this.displayMode = (this.displayMode + 1) % 2
            } else {
                // 常规模式 支持三种方式切换
                this.displayMode = (this.displayMode + 1) % 3
            }
        },
        toggleImmerseMode() {
            this.immerseMode = !this.immerseMode
        },
        toggleTransparentMode() {
            this.transparentMode = !this.transparentMode
        }
    },
    persist: true
})
