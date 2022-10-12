import { createRouter, createWebHistory, createWebHashHistory, Router } from 'vue-router';
import routes from "@/router/routes";

const router:Router = createRouter({
    // history: createWebHistory('/'),
    history: createWebHashHistory(),
    routes
})

// demo演示页
if (__ENV__ === 'dev') {
    router.addRoute({
        path: '/demo',
        component: () => import('@/pages/demo.vue')
    })
}

export default router
