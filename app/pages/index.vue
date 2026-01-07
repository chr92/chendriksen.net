<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('content').path('/').first())

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})
</script>

<template>
  <div v-if="page" class="bg-background">
    <!-- Hero Section -->
    <section class="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-surface text-center">
      <!-- Background Image with Overlay -->
      <!-- Background Slideshow -->
      <HomeSlideshow />

      <!-- Hero Content -->
      <div class="container relative z-10 px-4 py-24">
        <h1 class="mb-6 font-heading text-5xl font-extrabold tracking-tight text-text sm:text-7xl">
          Hi, I'm <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Christiaan</span>
        </h1>
        <p class="mx-auto mb-10 max-w-2xl text-lg text-muted sm:text-xl md:text-2xl">
          {{ page.description }}
        </p>
        <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <NuxtLink 
            to="/contact" 
            class="rounded-full bg-primary px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            Get in Touch
          </NuxtLink>
           <NuxtLink 
            to="/about" 
            class="rounded-full border border-surface bg-surface/50 px-8 py-3 text-lg font-medium text-text backdrop-blur transition-all hover:bg-surface hover:text-white"
          >
            More About Me
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <!-- Recent Work Grid -->
    <ProjectGrid />

    <!-- Content Section (About Teaser or SEO text) -->
    <section class="container py-12">
      <div class="prose prose-invert prose-lg mx-auto max-w-4xl text-center text-muted">
        <ContentRenderer :value="page">
           <template #empty>
              <p>No content found.</p>
           </template>
        </ContentRenderer>
      </div>
    </section>
  </div>
</template>
