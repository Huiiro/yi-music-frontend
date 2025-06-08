import {defineStore} from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => ({
        locale: 'zh',
        logoText: 'Yi-Music',
        isSmallScreen: window.innerWidth < 768

    }),
    actions: {
        updateScreenSize() {
            this.isSmallScreen = window.innerWidth < 768;
        },
        setLocale(lang: string) {
            this.locale = lang
        },
    },
    persist: true
});
