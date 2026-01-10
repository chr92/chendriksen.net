/**
 * Custom Router Options
 * 
 * Fixes scroll behavior during page transitions.
 * Without this, the page scrolls to top BEFORE the fade-out completes,
 * causing a jarring flash of content.
 * 
 * Solution: Delay scroll until after the transition (350ms).
 * 
 * @see https://nuxt.com/docs/guide/recipes/custom-routing#router-options
 */
import type { RouterConfig } from '@nuxt/schema'

const TRANSITION_DURATION = 350 // Must match .fade transition in main.css

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Handle hash links (e.g., /#about)
        if (to.hash) {
          resolve({ 
            el: to.hash, 
            behavior: 'smooth',
            top: 80 // Offset for fixed header (h-16 = 64px + some padding)
          })
          return
        }
        // Use saved position for back/forward, otherwise scroll to top
        resolve(savedPosition || { top: 0, left: 0 })
      }, TRANSITION_DURATION)
    })
  }
}
