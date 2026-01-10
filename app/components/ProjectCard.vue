<script setup lang="ts">
import { computed } from 'vue'
import optimized from '~/assets/optimized-images.json'

const props = defineProps<{
  title: string
  description: string
  image?: string
  path: string
  role?: string
  meta?: { image?: string; year?: number }
}>()

// Nuxt Content stores custom frontmatter fields in meta object
const imageUrl = props.image || props.meta?.image
const year = props.meta?.year

const imageKey = computed(() => {
  if (!imageUrl) return null
  return imageUrl.split('/').pop()
})

const imageMapping = computed(() => (imageKey.value ? optimized[imageKey.value] : null))
</script>

<template>
  <NuxtLink :to="path" class="group relative block overflow-hidden rounded-lg bg-surface" :data-testid="'project-card'">
    <!-- Image -->
    <div class="aspect-[3/4] w-full overflow-hidden">
        <picture v-if="imageMapping">
          <source type="image/avif" :srcset="imageMapping.avif" sizes="(max-width: 768px) 100vw, 33vw" />
          <source type="image/webp" :srcset="imageMapping.webp" sizes="(max-width: 768px) 100vw, 33vw" />
          <img :src="imageMapping.fallback" :alt="title" class="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110" loading="lazy" decoding="async"/>
        </picture>
        <img v-else :src="imageUrl" :alt="title" class="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110" loading="lazy" decoding="async"/>
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40"></div>
    </div>

    <!-- Content Slide-up -->
    <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-all duration-500 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div class="relative z-10">
            <div v-if="year" class="mb-3 flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-white bg-primary/50 px-2.5 py-1 rounded-full">{{ year }}</span>
              <div class="h-px flex-1 bg-primary/60"></div>
            </div>
            <span v-if="role" class="mb-2 block text-xs font-bold uppercase tracking-wider text-primary">{{ role }}</span>
            <h3 class="mb-1 text-2xl font-bold text-white">{{ title }}</h3>
            <p class="line-clamp-2 text-sm text-gray-200">{{ description }}</p>
        </div>
    </div>
  </NuxtLink>
</template>
