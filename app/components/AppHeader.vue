<template>
  <header class="sticky top-0 z-50 w-full border-b border-surface/50 bg-background/80 backdrop-blur-md">
    <div class="container flex h-16 items-center justify-between">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <span class="font-heading text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          CH
        </span>
      </NuxtLink>

      <nav class="hidden md:flex gap-6">
        <div 
          v-for="link in navigation" 
          :key="link.path"
          class="relative group"
        >
          <NuxtLink 
            :to="link.path"
            class="flex items-center gap-1 py-4 text-sm font-medium text-muted hover:text-primary transition-colors"
            active-class="text-primary font-bold"
          >
            {{ link.name }}
            <!-- Chevron Icon if children exist -->
            <svg v-if="link.children && link.children.length" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
          </NuxtLink>

          <!-- Dropdown Menu -->
          <div 
            v-if="link.children && link.children.length"
            class="absolute left-0 top-full hidden w-64 pt-2 group-hover:block"
          >
            <div class="rounded-xl border border-surface/50 bg-background/95 p-2 backdrop-blur-xl shadow-xl">
              <NuxtLink 
                v-for="child in link.children" 
                :key="child.path"
                :to="child.path"
                class="block rounded-lg px-4 py-3 text-sm text-muted hover:bg-surface hover:text-primary transition-colors"
                active-class="bg-surface text-primary font-bold"
              >
                {{ child.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
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
const { data: navigation } = await useAsyncData('navigation', async () => {
  // Fetch all content items
  const allContent = await queryCollection('content').select('title', 'path').all()

  // Helper to get children for a path
  const getChildren = (prefix: string) => 
    allContent
      .filter(c => c.path.startsWith(prefix + '/') && c.path !== prefix)
      .map(c => ({ name: c.title, path: c.path }))

  return [
    { name: 'Home', path: '/' },
    { 
      name: 'Current Projects', 
      path: '/current-projects', 
      children: getChildren('/current-projects')
    },
    { 
      name: 'Previous Work', 
      path: '/previous-work',
      children: getChildren('/previous-work')
    },
    { name: 'About', path: '/about' },
  ]
})
</script>
