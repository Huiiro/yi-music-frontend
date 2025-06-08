import {ref, onMounted, onBeforeUnmount, nextTick, type Ref, watch} from 'vue';

/**
 * 封装公共函数 -- 获取菜单展开方向
 * @param triggerRef
 * @param visibleRef
 */
export function useMenuDirection(
    triggerRef: Ref<HTMLElement | null>,
    visibleRef: Ref<boolean>
) {
    const direction = ref<'top' | 'bottom'>('bottom');

    const updateDirection = () => {
        nextTick(() => {
            const el = triggerRef.value;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // 如果底部空间不足 300px，改为向上展开
            direction.value = (windowHeight - rect.bottom < 300) ? 'top' : 'bottom';
        }).then(() => {
        });
    };

    onMounted(() => {
        window.addEventListener('resize', updateDirection);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', updateDirection);
    });

    // 每次菜单打开时重新判断方向
    watch(visibleRef, (val) => {
        if (val) updateDirection();
    });

    return {
        menuDirection: direction,
    };
}
