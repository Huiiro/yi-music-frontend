import {createRouter, createWebHistory} from "vue-router";
import {constRoutes} from "./routes.ts";

const router = createRouter({
    history: createWebHistory('/'),
    routes: [...constRoutes],
    scrollBehavior() {
        return {
            left: 0,
            top: 0
        }
    }
})

//@ts-ignore
router.beforeEach(async (to, from, next) => {
    next();
})

//@ts-ignore
router.afterEach((to, from) => {

})

export default router;