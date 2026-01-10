import { onMounted } from 'vue'
import { usePostHog } from '~/composables/usePostHog.js'

export default defineNuxtPlugin(() => {
  onMounted(() => {
    usePostHog()
  })
})
