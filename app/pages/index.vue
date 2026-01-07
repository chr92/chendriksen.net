<script setup lang="ts">
// Fetch content from 'homepage.md' to populate both the Hero and About sections.
// This file serves as the single source of truth for the homepage text.
const { data: page } = await useAsyncData('home-content', () => queryCollection('content').path('/homepage').first())

useSeoMeta({
  title: 'Home',
  description: page.value?.description,
})
</script>

<template>
  <div v-if="page" class="bg-background">
    <!-- Hero Section -->
    <section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface text-center">
      <!-- Background Slideshow -->
      <HomeSlideshow />

      <!-- Hero Content -->
      <div class="container relative z-10 px-4 py-24">
        <h1 class="mb-6 font-heading text-5xl font-extrabold tracking-tight text-text sm:text-7xl">
          {{ page?.hero_title || "Hi, I'm Christiaan" }}
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
            to="/#about" 
            class="rounded-full border border-surface bg-surface/50 px-8 py-3 text-lg font-medium text-text backdrop-blur transition-all hover:bg-surface hover:text-white"
          >
            More About Me
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Recent Work Grid -->
    <ProjectGrid />

    <!-- About Section -->
    <section id="about" class="container py-32 scroll-mt-32">
      <div class="grid gap-16 lg:grid-cols-2 lg:items-center">
        <!-- Content -->
        <div class="order-2 lg:order-1">
           <h2 class="mb-8 font-heading text-4xl font-bold text-white sm:text-5xl">About Me</h2>
           <div class="prose prose-invert prose-lg max-w-none text-muted leading-relaxed">
              <ContentRenderer v-if="page" :value="page" />
              
              <div class="mt-12 flex items-center gap-6">
                 <NuxtLink to="https://www.instagram.com/chendriksen/" target="_blank" class="text-muted hover:text-primary transition-all hover:scale-110">
                    <span class="sr-only">Instagram</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </NuxtLink>
                <NuxtLink to="https://www.youtube.com/@chendriksen" target="_blank" class="text-muted hover:text-primary transition-all hover:scale-110">
                    <span class="sr-only">YouTube</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                </NuxtLink>
              </div>
           </div>
        </div>

        <!-- Portrait -->
        <div class="order-1 lg:order-2 relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
          <div class="aspect-[3/4] overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-white/10">
             <img 
               src="/images/christiaan.jpg" 
               alt="Christiaan Hendriksen" 
               class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
             />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

