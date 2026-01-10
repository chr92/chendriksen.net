import posthog from 'posthog-js'

export function usePostHog() {
  posthog.init('phc_p2IGBuJ9kNKI5TocCqZ9aZ6yV2Kxe3AsUYZ9gZxgmtx', {
    api_host: 'https://eu.i.posthog.com',
    defaults: '2025-11-30',
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
  })

  return { posthog }
}
