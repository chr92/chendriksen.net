<script setup lang="ts">
defineProps<{
  page: any
}>()
</script>

<template>
  <div class="min-h-screen bg-background pb-24">
    <!-- Project Hero -->
    <div class="relative h-[60vh] w-full overflow-hidden">
      <div class="absolute inset-0">
         <img 
            :src="page.image || page.meta?.image" 
            :alt="page.title" 
            class="h-full w-full object-cover"
         />
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
                <div class="prose prose-invert prose-lg sticky top-32">
                     <ContentRenderer :value="page" />
                </div>
            </div>

            <!-- Right: Gallery -->
            <div class="lg:col-span-7">
                <div v-if="page.gallery" class="grid gap-4 sm:grid-cols-2">
                     <div 
                        v-for="(img, idx) in page.gallery" 
                        :key="idx"
                        class="group relative overflow-hidden rounded-lg bg-surface"
                        :class="{ 'sm:col-span-2': idx % 3 === 0 }"
                    >
                        <img 
                            :src="img" 
                            alt="Gallery Image" 
                            class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                     </div>
                </div>
                <div v-else class="flex h-64 items-center justify-center rounded-lg border border-dashed border-white/10 bg-surface/20">
                    <p class="text-muted">Gallery placeholder</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
