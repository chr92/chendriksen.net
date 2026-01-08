<script setup lang="ts">
import { computed, unref } from 'vue'
import { resolveOptimizedImage } from '~/composables/useOptimizedImage'

const props = defineProps<{
  page: any
}>()

// Make `page` robust to being passed as either a Ref or a plain object
// Default to an empty object to avoid SSR property access errors when undefined
const page = computed(() => unref(props.page) || {})

// Hero image: allow a per-page `headerImage` (frontmatter) and fall back to `image`
const heroUrl = computed(() => page.value?.headerImage || page.value?.meta?.headerImage || page.value?.image || page.value?.meta?.image)
const heroMapping = computed(() => resolveOptimizedImage(heroUrl.value))

// Content image (thumbnail used on homepage/cards): use `image` field so the same image appears on homepage and here
const contentImageUrl = computed(() => page.value?.image || page.value?.meta?.image)
const contentImageMapping = computed(() => resolveOptimizedImage(contentImageUrl.value))
const galleryItems = computed(() => (page.value?.gallery || []).map((g: string) => ({ original: g, mapping: resolveOptimizedImage(g) })))

// Trim the first-level heading from the rendered body so the title doesn't repeat
const trimmedBody = computed(() => {
  const body = page.value?.body
  if (!body || !Array.isArray(body.value)) return body
  const nodes = body.value
  const first = nodes[0]
  if (Array.isArray(first) && first[0] === 'h1') {
    return { ...body, value: nodes.slice(1) }
  }
  return body
})

// Provide a content object for the renderer with the trimmed body
const contentForRenderer = computed(() => ({ ...page.value, body: trimmedBody.value }))
</script>

<template>
  <div class="min-h-screen bg-background pb-24">
    <!-- Project Hero -->
    <div class="relative h-[60vh] w-full overflow-hidden">
      <div class="absolute inset-0">
         <picture v-if="heroMapping">
           <source type="image/avif" :srcset="heroMapping.avif" sizes="100vw" />
           <source type="image/webp" :srcset="heroMapping.webp" sizes="100vw" />
           <img :src="heroMapping.fallback" :alt="page.title" class="h-full w-full object-cover" loading="eager" decoding="async" fetchpriority="high" />
         </picture>
         <img v-else :src="page.image || page.meta?.image" :alt="page.title" class="h-full w-full object-cover" />

         <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
      </div>
      
      <div class="container relative flex h-full items-end pb-12">
        <div class="max-w-4xl">
            <div class="mb-4 flex flex-wrap gap-2" v-if="page.tags">
                <span v-for="tag in page.tags" :key="tag" class="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                    {{ tag }}
                </span>
            </div>
            <h1 class="font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">{{ page.title }}</h1>
            <p v-if="page.description" class="mt-4 text-xl text-gray-200">{{ page.description }}</p>
        </div>
      </div>
    </div>

    <!-- Metadata Bar -->
    <div class="border-b border-white/10 bg-surface/30 backdrop-blur">
        <div class="container grid max-w-5xl grid-cols-2 gap-8 py-8 sm:grid-cols-4">
            <div v-if="page.role">
                <span class="block text-xs font-bold uppercase tracking-wider text-muted">Role</span>
                <span class="text-lg font-medium text-white">{{ page.role }}</span>
            </div>
            <div v-if="page.director">
                <span class="block text-xs font-bold uppercase tracking-wider text-muted">Director</span>
                <span class="text-lg font-medium text-white">{{ page.director }}</span>
            </div>
            <div v-if="page.year">
                <span class="block text-xs font-bold uppercase tracking-wider text-muted">Year</span>
                <span class="text-lg font-medium text-white">{{ page.year }}</span>
            </div>
             <div v-if="page.company">
                <span class="block text-xs font-bold uppercase tracking-wider text-muted">Company</span>
                <span class="text-lg font-medium text-white">{{ page.company }}</span>
            </div>
        </div>
    </div>

    <!-- Main Content & Gallery -->
    <div class="container relative z-10 pt-16">
        <div class="grid gap-16 lg:grid-cols-12">
            <!-- Left: Text Content -->
            <div class="lg:col-span-5">
                 <div class="prose prose-invert prose-lg">
                   <ContentRenderer :value="contentForRenderer" />
                 </div>
            </div>

            <!-- Right: Content Image + Gallery -->
            <div class="lg:col-span-7 space-y-12">
                <!-- Primary Content Image (render at natural height, don't crop vertically) -->
                <div v-if="contentImageUrl" class="relative w-full overflow-hidden rounded-lg bg-surface">
                  <picture v-if="contentImageMapping">
                    <source type="image/avif" :srcset="contentImageMapping.avif" sizes="(max-width: 768px) 100vw, 50vw" />
                    <source type="image/webp" :srcset="contentImageMapping.webp" sizes="(max-width: 768px) 100vw, 50vw" />
                    <img :src="contentImageMapping.fallback" :alt="page.title + ' content image'" class="w-full h-auto object-contain" loading="lazy" decoding="async" />
                  </picture>
                  <img v-else :src="contentImageUrl" :alt="page.title + ' content image'" class="w-full h-auto object-contain" loading="lazy" decoding="async" />
                </div>

                <!-- Gallery Section -->
                <div v-if="page.gallery" class="grid gap-4 sm:grid-cols-2">
                     <div 
                        v-for="(item, idx) in galleryItems" 
                        :key="idx"
                        class="group relative overflow-hidden rounded-lg bg-surface"
                        :class="{ 'sm:col-span-2': idx % 3 === 0 }"
                    >
                      <picture v-if="item.mapping">
                        <source type="image/avif" :srcset="item.mapping.avif" sizes="(max-width: 768px) 100vw, 50vw" />
                        <source type="image/webp" :srcset="item.mapping.webp" sizes="(max-width: 768px) 100vw, 50vw" />
                        <img :src="item.mapping.fallback" alt="Gallery Image" class="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" decoding="async" />
                      </picture>
                      <img v-else :src="item.original" alt="Gallery Image" class="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" decoding="async" />
                     </div>
                </div>
                <div v-else-if="!contentImageUrl" class="flex h-64 items-center justify-center rounded-lg border border-dashed border-white/10 bg-surface/20">
                    <p class="text-muted">Image placeholder</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
