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
      
      <!-- Mobile Menu Button -->
      <button 
        class="md:hidden p-2 text-muted hover:text-text transition-colors"
        @click="isMenuOpen = true"
      >
        <span class="sr-only">Open Menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <div 
          v-if="isMenuOpen" 
          class="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-xl md:hidden"
        >
          <!-- Header in Mobile Menu -->
          <div class="container flex h-16 items-center justify-between border-b border-surface/50">
            <NuxtLink to="/" class="flex items-center space-x-2" @click="isMenuOpen = false">
              <span class="font-heading text-xl font-bold text-text">CH</span>
            </NuxtLink>
            <button 
              class="p-2 text-muted hover:text-text transition-colors"
              @click="isMenuOpen = false"
            >
              <span class="sr-only">Close Menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Links -->
          <div class="container flex flex-col gap-6 py-8 overflow-y-auto">
            <NuxtLink 
              to="/" 
              class="text-2xl font-semibold text-text hover:text-primary transition-colors"
              @click="isMenuOpen = false"
            >
              Home
            </NuxtLink>
            
            <NuxtLink 
              to="/work" 
              class="text-2xl font-semibold text-text hover:text-primary transition-colors"
              @click="isMenuOpen = false"
            >
              Work
            </NuxtLink>

            <NuxtLink 
              to="/#about" 
              class="text-2xl font-semibold text-text hover:text-primary transition-colors"
              @click="isMenuOpen = false"
            >
              About
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              class="text-2xl font-semibold text-text hover:text-primary transition-colors"
              @click="isMenuOpen = false"
            >
              Contact
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>
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
const isMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// Body scroll lock
watch(isMenuOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initialize on mount
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>
