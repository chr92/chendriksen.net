import { usePostHog } from '~/composables/usePostHog.js'

export default defineNuxtPlugin(() => {
  usePostHog()
})
