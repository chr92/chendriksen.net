<script setup lang="ts">
const { data: projectsData } = await useAsyncData('projects-grid-sorted', () => 
  queryCollection('content')
    .where('path', 'LIKE', '/work/%')
    .all()
)

const projects = computed(() => {
  if (!projectsData.value) return []
  return [...projectsData.value]
    .sort((a, b) => {
      const yearA = parseInt(String(a.meta?.year || a.year || 0), 10)
      const yearB = parseInt(String(b.meta?.year || b.year || 0), 10)
      return yearB - yearA
    })
    .slice(0, 6)
})
</script>

<template>
  <section class="py-24 bg-background">
    <div class="container">
      <div class="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Recent Work</h2>
          <p class="mt-2 text-lg text-muted">A selection of latest productions and projects.</p>
        </div>
        <NuxtLink to="/work" class="group flex items-center gap-2 text-primary hover:text-primary/80">
            View All Projects
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300 group-hover:translate-x-1"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </NuxtLink>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard 
            v-for="project in projects" 
            :key="project.path"
            v-bind="project"
        />
      </div>
    </div>
  </section>
</template>
