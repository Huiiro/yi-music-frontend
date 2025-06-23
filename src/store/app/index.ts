import {defineStore} from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        locale: 'zh',
        logoText: 'Yi-Music',
        isSmallScreen: window.innerWidth < 768,
        shouldReloadPlaylist: false
    }),
    actions: {
        updateScreenSize() {
            this.isSmallScreen = window.innerWidth < 768
        },
        setLocale(lang: string) {
            this.locale = lang
            localStorage.setItem('locale', lang)
        },
        notifyBToReload() {
            this.shouldReloadPlaylist = true
        },
        markBReloaded() {
            this.shouldReloadPlaylist = false
        }
    },
    persist: true
})
