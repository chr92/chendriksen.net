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