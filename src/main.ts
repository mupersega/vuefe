import { createApp } from 'vue'
import { registerPinia } from './stores/registerPinia'
import { registerIcons } from './config/icons'
import { registerRouter } from './config/router'

import vImgLoaded from './directives/v-img-loaded'

import './services/apiService'

import App from './App.vue'

const app = createApp(App)

registerIcons(app)
registerPinia(app)
registerRouter(app)
registerTippy(app)

app.directive('img-loaded', vImgLoaded)

import './style.css'

app.mount('#app')
import './config/tooltips'
import { registerTippy } from './config/tooltips'
