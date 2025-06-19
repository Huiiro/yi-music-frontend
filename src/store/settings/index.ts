import {defineStore} from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        // 设置 歌词 打开顶部歌词
        showTopLyrics: false,
        // 定时休眠组件
        sleepTimerEnabled: false,
        // timestamp（单位：毫秒）
        sleepTimerEndTime: 0,
        endAfterCurrentSong: false,
        customSleepTime: 10,
        // darkMode
        darkMode: false,
        // 底部控制栏区分
        distinctFromBottomControl: false,
    }),
    actions: {
        toggleTopLyrics() {
            this.showTopLyrics = !this.showTopLyrics
        },
        setCustomSleepTime(time: number) {
            this.customSleepTime = time
        },
        toggleDarkMode() {
            this.darkMode = !this.darkMode
        },
        toggleDistinctFromBottomControl() {
          this.distinctFromBottomControl = !this.distinctFromBottomControl
        },
        setSleepTimer(minutes: number, endAfterCurrentSong: boolean) {
            const now = Date.now()
            this.sleepTimerEndTime = now + minutes * 60 * 1000
            this.sleepTimerEnabled = true
            this.endAfterCurrentSong = endAfterCurrentSong
        },
        cancelSleepTimer() {
            this.sleepTimerEnabled = false
            this.sleepTimerEndTime = 0
            this.endAfterCurrentSong = false
        }
    },
    persist: true
})
