<template>
  <header class="sticky top-0 z-50 w-full border-b border-surface/50 bg-background/80 backdrop-blur-md">
    <div class="container flex h-16 items-center justify-between">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <span class="font-heading text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          CH
        </span>
      </NuxtLink>

      <nav class="hidden md:flex gap-6">
        <NuxtLink 
          v-for="link in navigation" 
          :key="link.path" 
          :to="link.path"
          class="text-sm font-medium text-muted hover:text-primary transition-colors"
          active-class="text-primary font-bold"
        >
          {{ link.name }}
        </NuxtLink>
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
const navigation = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]
</script>
