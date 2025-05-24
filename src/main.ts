import { createApp } from 'vue'
import { registerStore } from './stores/registerStore'
import { registerIcons } from './config/icons'
import { registerRouter } from './config/router'

import './style.css'
import './services/ApiService'

import App from './App.vue'
import { loadStores } from './stores'

const app = createApp(App)

registerIcons(app)
registerStore(app)
registerRouter(app)

loadStores()

app.mount('#app')