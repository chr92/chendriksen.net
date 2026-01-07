<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description
})
</script>

<template>
  <div class="container py-24">
    <article v-if="page" class="mx-auto max-w-4xl">
      <header class="mb-12 text-center">
        <h1 class="font-heading text-4xl font-bold text-text sm:text-5xl md:text-6xl">
          {{ page.title }}
        </h1>
        <p v-if="page.description" class="mt-4 text-xl text-muted">
          {{ page.description }}
        </p>
      </header>
      
      <div class="prose prose-invert prose-lg mx-auto">
        <ContentRenderer :value="page" />
      </div>
    </article>
  </div>
</template>
