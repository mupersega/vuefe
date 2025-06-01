import type { App } from 'vue'

import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
// Import custom EVE theme instead of material theme
import '@ui/style/tooltip.css'

export function registerTippy(app: App) {
    app.use(VueTippy,
  {
    directive: 'tippy',
    component: 'tippy',
    componentSingleton: 'tippy-singleton',
    defaultProps: {
      placement: 'top',
      allowHTML: true,
      delay: [300, 0], // Reduced delay for better user experience
      theme: 'eve-theme',
      animation: 'fade',
      duration: 150, // Match the standard transitions from style guide
    },
  })
}