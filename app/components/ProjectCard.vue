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
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
    </div>

    <!-- Always-visible title at bottom -->
    <div class="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <div class="relative z-10">
            <div v-if="year" class="mb-2 inline-block">
              <span class="text-xs font-bold uppercase tracking-wider text-white/80">{{ year }}</span>
            </div>
            <h3 class="text-xl font-bold text-white sm:text-2xl">{{ title }}</h3>
            <!-- Description shown on hover (desktop) -->
            <p class="mt-1 line-clamp-2 text-sm text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden sm:block">{{ description }}</p>
        </div>
    </div>
  </NuxtLink>
</template>
