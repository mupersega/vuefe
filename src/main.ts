import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'

import './style.css'

import App from './App.vue'
import Counter from './components/Counter.vue'
import Home from './components/Home.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/counter', component: Counter },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')