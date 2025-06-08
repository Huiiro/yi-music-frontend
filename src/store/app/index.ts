import {defineStore} from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => ({
        logoText: 'Yi-Music',
        isSmallScreen: window.innerWidth < 768

    }),
    actions: {
        updateScreenSize() {
            this.isSmallScreen = window.innerWidth < 768;
        }
    },
    persist: true
});
