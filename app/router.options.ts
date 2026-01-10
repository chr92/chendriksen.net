import type { RouterConfig } from '@nuxt/schema'

// Custom router options to fix scroll behavior during page transitions
// https://nuxt.com/docs/guide/recipes/custom-routing#router-options
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Don't scroll at all - this prevents the scroll-before-fade issue
    // The new page will naturally start at whatever scroll position makes sense
    // For most navigations, this means starting at top (since page is new)
    
    // Return a promise that resolves after the transition duration (350ms)
    // This delays any scroll behavior until the fade transition completes
    return new Promise((resolve) => {
      setTimeout(() => {
        // After transition, scroll to top (or saved position for back/forward)
        resolve(savedPosition || { top: 0, left: 0 })
      }, 350) // Match the fade transition duration in main.css
    })
  }
}
