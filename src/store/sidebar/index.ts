import {defineStore} from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        activePath: '',
        visible: true,
        defaultWidth: 200,
        width: 200,
    }),
    actions: {
        setActivePath(path: string) {
            this.activePath = path;
        },
        toggleVisibility(force?: boolean) {
            if (typeof force === 'boolean') {
                this.visible = force;
            } else {
                this.visible = !this.visible;
            }
        },
        setWidth(width: number) {
            this.width = width;
        },
    },
    persist: true
});
