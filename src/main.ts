import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'

import './style.css'
import './services/apiService'; // Import for side effects (initialization)

import App from './App.vue'
import Home from './components/Home.vue'
import Lookup from './components/Lookup.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/lookup', component: Lookup },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faHouse)
library.add(faMagnifyingGlass)

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')