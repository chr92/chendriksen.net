<template>
  <footer class="border-t border-surface/50 bg-background py-8">
    <div class="container flex flex-col items-center justify-between gap-4 md:flex-row">
      <p class="text-sm text-muted">
        &copy; {{ new Date().getFullYear() }} Christiaan Hendriksen. All rights reserved.
      </p>
        <a href="https://www.instagram.com/chendriksen/" target="_blank" rel="noopener noreferrer" class="text-muted hover:text-primary transition-colors">
          <span class="sr-only">Instagram</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
        </a>
        <a href="https://www.youtube.com/@chendriksen" target="_blank" rel="noopener noreferrer" class="text-muted hover:text-primary transition-colors">
          <span class="sr-only">YouTube</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
        </a>
    </div>
  </footer>
</template>
