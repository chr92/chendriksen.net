/**
 * PostHog Analytics Plugin (client-side only)
 * 
 * The .client.js suffix ensures this only runs in the browser.
 * Remove this file to disable analytics.
 */
import { usePostHog } from '~/composables/usePostHog.js'

export default defineNuxtPlugin(() => {
  usePostHog()
})
