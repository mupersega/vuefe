// stores/registerStore.ts
import { createPinia } from 'pinia'
import type { App } from 'vue'

const pinia = createPinia()

export function registerStore(app: App) {
  app.use(pinia)
}