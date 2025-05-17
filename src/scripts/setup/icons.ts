import type { App } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faIndustry } from '@fortawesome/free-solid-svg-icons'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { faDraftingCompass } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { faBook } from '@fortawesome/free-solid-svg-icons'

library.add(faHouse)
library.add(faMagnifyingGlass)
library.add(faIndustry)
library.add(faSliders)
library.add(faDraftingCompass)
library.add(faUsers)
library.add(faBook)

export function registerIcons(app: App) {
    app.component('font-awesome-icon', FontAwesomeIcon)
}