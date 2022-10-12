import { RouteRecordRaw } from 'vue-router'

const routes:Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        redirect: '/live'
    },
    {
        path: '/match',
        name: 'match',
        component: () => import('@/pages/match.vue')
    },
    {
        path: '/information',
        name: 'information',
        component: () => import('@/pages/information.vue')
    },
    {
        path: '/live',
        name: 'live',
        component: () => import('@/pages/live.vue')
    },
    {
        path: '/live-room/:roomId',
        name: 'live-room',
        component: () => import('@/pages/live-room.vue')
    },
    // {
    //     path: '/eyes',
    //     name: 'eyes',
    //     component: () => import('@/pages/eyes.vue')
    // },
    {
        path: '/user',
        name: 'user',
        component: () => import('@/pages/user.vue')
    },
    {
        path: '/setting',
        name: 'setting',
        component: () => import('@/pages/setting.vue')
    },
    {
        path: '/download',
        name: 'download',
        component: () => import('@/pages/download/index.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/register.vue')
    },
    {
        path: '/invite',
        name: 'invite',
        component: () => import('@/pages/invite.vue')
    },
    {
        path: '/invite-details',
        name: 'invite-details',
        component: () => import('@/pages/invite-details.vue')
    },
    {
        path: '/protocol/:id',
        name: 'protocol',
        component: () => import('@/pages/protocol/index.vue')
    },
    {
        path: '/help/:tab',
        name: 'help',
        component: () => import('@/pages/help/index.vue')
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/live'
    }
]

// @ts-ignore
export default routes;
