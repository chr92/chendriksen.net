<template>
  <div class="flex min-h-screen flex-col bg-background font-sans text-text antialiased selection:bg-primary/20 selection:text-primary">
    <AppHeader />
    <main class="flex-1">
      <Transition name="fade" mode="out-in">
        <slot />
      </Transition>
    </main>
    <AppFooter />
  </div>
</template>
