import { createApp } from 'vue'
import { registerPinia } from './stores/registerPinia'
import { registerIcons } from './config/icons'
import { registerRouter } from './config/router'

import './style.css'
import './services/ApiService'

import App from './App.vue'
import { loadStores } from './stores'

const app = createApp(App)

registerIcons(app)
registerPinia(app)
registerRouter(app)

loadStores()

app.mount('#app')