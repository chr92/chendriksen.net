<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
}) as { data: Ref<any> }

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const path = route.path
import ProjectLayout from '~/components/layouts/ProjectLayout.vue'
import { computed } from 'vue'

// Serialize the `page` data into a plain object so it is safe for SSR
const pagePlain = computed(() => (page?.value ? JSON.parse(JSON.stringify(page.value)) : {}))

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
})
</script>

<template>
  <div>
    <!-- Dynamic Layout Switching -->
    <ProjectLayout 
        v-if="path.startsWith('/work')" 
        :page="pagePlain" 
    />

    <!-- Fallback Generic Layout -->
    <article v-else class="container max-w-4xl py-24">
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
