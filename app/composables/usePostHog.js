/**
 * PostHog Analytics Composable
 * 
 * Initializes PostHog for user analytics tracking.
 * Only runs client-side via the posthog.client.js plugin.
 * 
 * To disable analytics, remove or comment out the plugin in app/plugins/
 */
import posthog from 'posthog-js'

export function usePostHog() {
  posthog.init('phc_p2IGBuJ9kNKI5TocCqZ9aZ6yV2Kxe3AsUYZ9gZxgmtx', {
    api_host: 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
  })

  return { posthog }
}
