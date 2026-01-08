<script setup lang="ts">
import { computed, unref, onMounted } from 'vue'
import { resolveOptimizedImage } from '~/composables/useOptimizedImage'
import { usePageColors } from '~/composables/usePageColors'

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

// Apply dynamic colors from hero image
const { applyColors } = usePageColors()
onMounted(() => {
  if (heroUrl.value) {
    applyColors(heroUrl.value)
  }
})
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
            <div class="mb-4 flex flex-wrap items-center gap-3">
                <span v-if="page.meta?.year || page.year" class="rounded-full bg-primary/40 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm border border-primary/60">
                    {{ page.meta?.year || page.year }}
                </span>
                <span v-for="tag in page.tags" :key="tag" class="rounded-full bg-primary/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border border-primary/50">
                    {{ tag }}
                </span>
            </div>
            <h1 class="font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">{{ page.title }}</h1>
            <p v-if="page.description" class="mt-4 text-xl text-gray-200">{{ page.description }}</p>
        </div>
      </div>
    </div>

    

    <!-- Main Content & Gallery -->
    <div class="container relative z-10 pt-16">
        <div class="grid gap-16 lg:grid-cols-12">
            <!-- Left: Text Content -->
            <div class="lg:col-span-5">
                 <div class="prose prose-invert prose-lg max-w-none">
                   <ContentRenderer :value="contentForRenderer" />
                 </div>
            </div>

            <!-- Right: Content Image -->
            <div class="lg:col-span-7">
                <!-- Content Image (render at natural height, don't crop vertically) -->
                <div v-if="contentImageUrl" class="sticky top-24 space-y-6">
                  <div class="relative w-full overflow-hidden rounded-xl bg-surface shadow-lg ring-1 ring-white/10">
                    <picture v-if="contentImageMapping">
                      <source type="image/avif" :srcset="contentImageMapping.avif" sizes="(max-width: 768px) 100vw, 50vw" />
                      <source type="image/webp" :srcset="contentImageMapping.webp" sizes="(max-width: 768px) 100vw, 50vw" />
                      <img :src="contentImageMapping.fallback" :alt="page.title + ' content image'" class="w-full h-auto object-contain" loading="lazy" decoding="async" />
                    </picture>
                    <img v-else :src="contentImageUrl" :alt="page.title + ' content image'" class="w-full h-auto object-contain" loading="lazy" decoding="async" />
                  </div>
                </div>

                <div v-else class="flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-surface/20 py-24">
                    <p class="text-muted">Image placeholder</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
