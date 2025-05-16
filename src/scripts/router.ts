import type { App } from 'vue'
import { createMemoryHistory, createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

import Home from '../components/Home.vue'
import Lookup from '../components/library/Library.vue'

const routes: RouteRecordRaw[] = [
    { path: '/', component: Home },
    { path: '/lookup', component: Lookup },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export function registerRouter(app: App) {
    app.use(router)
}