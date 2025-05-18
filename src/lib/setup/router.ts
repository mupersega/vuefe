import type { App } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

import Home from '@/components/pages/Home.vue'
import Lookup from '@/components/pages/Library.vue'

const routes: RouteRecordRaw[] = [
    { path: '/', component: Home },
    { path: '/lookup', component: Lookup },
    { path: '/admin', component: () => import('@/components/pages/AdminPage.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export function registerRouter(app: App) {
    app.use(router)
}