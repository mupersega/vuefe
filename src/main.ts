import { createApp } from 'vue'
import { registerIcons } from './scripts/setup/icons'
import { registerStore } from './scripts/setup/pinia'
import { registerRouter } from './scripts/setup/router'

import './style.css'
import './services/apiService'

import App from './App.vue'

const app = createApp(App)

registerIcons(app)
registerStore(app)
registerRouter(app)

app.mount('#app')