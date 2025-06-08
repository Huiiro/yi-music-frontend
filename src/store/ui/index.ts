import {defineStore} from 'pinia';

export const useUIStore = defineStore('ui', {
    state: () => ({
        // 颜色
        mainColor: 'rgb(0, 0, 0)',
        topColor: '#000',
        bottomColor: '#000',
        // 歌词大小
        lyricFontSizeIndex: 1,
        fontSizeOptions: ['text-sm', 'text-xl', 'text-2xl', 'text-3xl'],
        leadingOptions: ['leading-10', 'leading-12', 'leading-16', 'leading-18'],
        sizeLabels: ['小', '中', '大', '特大'],
        showLyricSizeSlider: false,
        displayMode: 0, // 0: 默认大屏, 1: 小屏模式布局, 2: 歌词上图下文
    }),
    getters: {
        lyricFontSizeClass: (state) =>
            state.fontSizeOptions[state.lyricFontSizeIndex],

        // 高亮歌词大小：永远比当前大一号，但不超过 options 范围
        highlightFontSizeClass: (state) => {
            const nextIndex = Math.min(
                state.lyricFontSizeIndex + 1,
                state.fontSizeOptions.length - 1
            );
            return state.fontSizeOptions[nextIndex];
        },

        nextLyricFontSizeClass: (state) =>
            state.fontSizeOptions[Math.max(state.lyricFontSizeIndex - 1, 0)],

        lyricLeadingClass: (state) =>
            state.leadingOptions[state.lyricFontSizeIndex],

        highlightLeadingClass: (state) => {
            const nextIndex = Math.min(
                state.lyricFontSizeIndex + 1,
                state.leadingOptions.length - 1
            );
            return state.leadingOptions[nextIndex];
        },
        sizeLabel: (state) => state.sizeLabels[state.lyricFontSizeIndex],
    },
    actions: {
        /**
         * colors
         */
        setMainColor(color: string) {
            this.mainColor = color;
        },
        setGradientColors(top: string, bottom: string) {
            this.topColor = top;
            this.bottomColor = bottom;
        },
        toggleSliderVisible() {
            this.showLyricSizeSlider = !this.showLyricSizeSlider;
        },
        toggleDisplayMode() {
            if (window.innerWidth < 768) {
                // 小屏下 只支持两种切换方式
                this.displayMode = (this.displayMode + 1) % 2;
            } else {
                // 常规模式 支持三种方式切换
                this.displayMode = (this.displayMode + 1) % 3;
            }
        },
    }
});
