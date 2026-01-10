/**
 * Nuxt Configuration
 * 
 * Key settings:
 * - Static site generation for Vercel (nitro.preset)
 * - Tailwind CSS + Google Fonts for styling
 * - Nuxt Content for markdown-based pages
 * 
 * @see https://nuxt.com/docs/api/configuration/nuxt-config
 */
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // Modules: Content (markdown), Tailwind (styles), Google Fonts
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  
  css: ['~/assets/css/main.css'],
  
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],      // Body text
      Outfit: [500, 700, 800],          // Headings
    },
    display: 'swap',
  },
  
  // Static generation for Vercel deployment
  nitro: {
    preset: 'vercel_static',
  },
  
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
})