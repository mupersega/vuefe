import { createApp } from 'vue'
import { registerIcons } from './scripts/icons'
import { registerStore } from './scripts/store'
import { registerRouter } from './scripts/router'

import './style.css'
import './services/apiService'

import App from './App.vue'

const app = createApp(App)

registerIcons(app)
registerStore(app)
registerRouter(app)

app.mount('#app')