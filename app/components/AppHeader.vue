<template>
  <header 
    class="fixed top-0 z-50 w-full transition-all duration-300"
    :class="[
      isScrolled 
        ? 'border-b border-surface/50 bg-background/80 backdrop-blur-md' 
        : 'border-b border-transparent bg-transparent backdrop-blur-none'
    ]"
  >
    <div class="container flex h-16 items-center justify-between">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <span class="font-heading text-xl font-bold text-text">
          CH
        </span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink to="/" class="text-sm font-medium text-muted hover:text-primary transition-colors">Home</NuxtLink>
        
        <!-- Work Dropdown -->
        <div class="relative group">
            <NuxtLink to="/work" class="flex items-center gap-1 text-sm font-medium text-muted hover:text-primary transition-colors py-4">
                Work
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300 group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
            </NuxtLink>
            
            <!-- Dropdown Menu -->
            <div class="absolute left-1/2 -translate-x-1/2 top-full hidden min-w-[200px] pt-2 group-hover:block">
                <div class="rounded-xl border border-surface/50 bg-background/95 p-2 backdrop-blur-xl shadow-xl">
                    <NuxtLink 
                        v-for="item in workItems" 
                        :key="item.path" 
                        :to="item.path"
                        class="block rounded-lg px-4 py-3 text-sm text-muted hover:bg-surface hover:text-primary transition-colors"
                    >
                        {{ item.title }}
                    </NuxtLink>
                </div>
            </div>
        </div>

        <NuxtLink to="/#about" class="text-sm font-medium text-muted hover:text-primary transition-colors">About</NuxtLink>
        <NuxtLink to="/contact" class="text-sm font-medium text-muted hover:text-primary transition-colors">Contact</NuxtLink>
      </nav>
      
      <!-- Mobile Menu Button (Placeholder) -->
      <button class="md:hidden p-2 text-muted hover:text-text">
        <span class="sr-only">Menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const { data: workItems } = await useAsyncData('work-nav', () =>
  queryCollection('content')
    .where('path', 'LIKE', '/work/%')
    .select('title', 'path')
    .all()
)

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initialize on mount
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
