import type { App } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

import HomeView from '@views/HomeView.vue'
import LibraryView from '@views/LibraryView.vue'

const routes: RouteRecordRaw[] = [
    { path: '/', component: HomeView },
    { path: '/lookup', component: LibraryView },
    { path: '/admin', component: () => import('@views/AdminView.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export function registerRouter(app: App) {
    app.use(router)
}