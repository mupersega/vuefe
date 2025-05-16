import type { App } from 'vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

export function registerStore(app: App) {
    app.use(pinia)
}