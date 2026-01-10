<template>
  <footer class="border-t border-surface/50 bg-background py-8">
    <div class="container flex flex-col items-center justify-between gap-4 md:flex-row">
      <p class="text-sm text-muted">
        &copy; {{ new Date().getFullYear() }} Christiaan Hendriksen
      </p>
      <div class="flex items-center gap-4">
        <a 
          href="https://www.instagram.com/chendriksen/" 
          target="_blank" 
          class="text-muted hover:text-primary transition-colors"
          aria-label="Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
        <a 
          href="https://www.youtube.com/@chendriksen" 
          target="_blank" 
          class="text-muted hover:text-primary transition-colors"
          aria-label="YouTube"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
        </a>
      </div>
    </div>
  </footer>
</template>
