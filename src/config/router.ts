import type { App } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

import HomeView from '@views/HomeView.vue'
import LibraryView from '@/ui/views/ArchiveView.vue'

const routes: RouteRecordRaw[] = [
    { path: '/', component: HomeView },
    { path: '/lookup', component: LibraryView },
    { path: '/bridge', component: () => import('@/ui/views/BridgeView.vue') },
    { path: '/workshop', component: () => import('@/ui/views/WorkshopView.vue') },
    { path: '/archive', component: () => import('@/ui/views/ArchiveView.vue') },
    { path: '/barracks', component: () => import('@/ui/views/BarracksView.vue') },
    { path: '/foundry', component: () => import('@/ui/views/FoundryView.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export function registerRouter(app: App) {
    app.use(router)
}