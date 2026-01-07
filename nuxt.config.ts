// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  nitro: {
    preset: 'vercel_static',
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})