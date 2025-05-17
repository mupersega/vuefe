import { createApp } from 'vue'
import { registerIcons } from './lib/setup/icons'
import { registerStore } from './lib/setup/pinia'
import { registerRouter } from './lib/setup/router'

import './style.css'
import './services/apiService'

import App from './App.vue'

const app = createApp(App)

registerIcons(app)
registerStore(app)
registerRouter(app)

app.mount('#app')