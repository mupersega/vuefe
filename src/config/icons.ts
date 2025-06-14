import type { App } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faHouse,
    faMagnifyingGlass,
    faIndustry,
    faSliders,
    faDraftingCompass,
    faUsers,
    faBook,
    faShieldCat,
    faTrash,
    faNetworkWired,
    faVial,
    faSpinner,
    faDatabase,
    faTools,
    faBug,
    faPlus,
    faListCheck,
    faChevronRight,
    faFilter,
    faAnglesDown,
    faAnglesRight,
    faCog,
    faCogs,
    faLink,
    faTrashAlt,
    faMap,
    faImage,
    faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons'

const icons = [
    faHouse,
    faMagnifyingGlass, 
    faIndustry,
    faSliders,
    faDraftingCompass,
    faUsers,
    faBook,
    faShieldCat,
    faTrash,
    faNetworkWired,
    faVial,
    faSpinner,
    faDatabase,
    faTools,
    faBug,
    faPlus,
    faListCheck,
    faChevronRight,
    faFilter,
    faAnglesDown,
    faAnglesRight,
    faCog,
    faCogs,
    faLink,
    faTrashAlt,
    faMap,
    faImage,
    faMapMarkedAlt
]

library.add(...icons)

export function registerIcons(app: App) {
    app.component('font-awesome-icon', FontAwesomeIcon)
}