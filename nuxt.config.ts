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
  
  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      // Web3Forms access key (safe to be public - it's a client-side form)
      web3formsKey: '574d5665-8a48-4ec1-adac-edc4968dd8ed',
    }
  },
  
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