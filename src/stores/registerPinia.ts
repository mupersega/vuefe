// stores/registerStore.ts
import { createPinia } from 'pinia'
import type { App } from 'vue'

const pinia = createPinia()

export function registerPinia(app: App) {
  app.use(pinia)
}