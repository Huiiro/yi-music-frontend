import {defineStore} from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        // 打开顶部歌词
        showTopLyrics: false,
        // 打开定时休眠
        sleepTimerEnabled: false,
        // timestamp（单位：毫秒）
        sleepTimerEndTime: 0,
        // 自定义睡眠时间（单位：分钟）
        customSleepTime: 10,
        // 播放完当前歌曲后停止
        endAfterCurrentSong: false,

        // 暗色模式
        darkMode: false,
        // 底部控制栏颜色区分
        distinctFromBottomControl: false,

        // 开启全局快捷键 （浏览器不支持，需Electron等框架支持）
        enableGlobalShortcutKeys: false,
        shortcutKeys: {
            play: '', // 播放暂停
            prev: '', // 上一首
            next: '', // 下一首
            iv: '', //增加音量
            dv: '', // 减少音量
            it: '', // 增加时间
            dt: '', // 减少时间
            tp: '' // 切换播放模式
        },
        globalShortcutKeys: {
            play: '',
            prev: '',
            next: '',
            iv: '',
            dv: '',
            it: '',
            dt: '',
            tp: ''
        }
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
