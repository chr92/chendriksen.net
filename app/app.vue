<!--
  Root App Component
  
  Wraps all pages with:
  - HTML lang attribute for accessibility
  - Page transitions (fade effect between routes)
  - NuxtLayout for consistent header/footer
  
  Related files:
  - assets/css/main.css (fade transition CSS)
  - router.options.ts (scroll behavior during transitions)
-->
<script setup>
useHead({
  htmlAttrs: { lang: 'en' }
})
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <Transition name="fade" mode="out-in">
      <NuxtPage />
    </Transition>
  </NuxtLayout>
</template>