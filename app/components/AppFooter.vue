<template>
  <footer class="border-t border-surface/50 bg-background py-8">
    <div class="container flex flex-col items-center justify-between gap-4 md:flex-row">
      <p class="text-sm text-muted">
        &copy; {{ new Date().getFullYear() }} Christiaan Hendriksen. All rights reserved.
      </p>
      <div class="flex gap-4">
        <!-- Social Links Placeholder -->
        <a href="#" class="text-muted hover:text-primary transition-colors">
          <span class="sr-only">GitHub</span>
          <!-- GitHub Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 3C6.72 2 4 3 2 6c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 14.5c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        </a>
      </div>
    </div>
  </footer>
</template>
