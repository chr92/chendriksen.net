<template>
  <div class="min-h-screen bg-background">
    <section class="py-24">
      <div class="container">
        <div class="mb-12">
          <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Work</h1>
          <p class="mt-2 text-lg text-muted">A selection of recent productions and projects.</p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard 
            v-for="project in projects" 
            :key="project.path"
            v-bind="project"
          />
        </div>

        <!-- Empty State -->
        <div v-if="!projects || projects.length === 0" class="text-center py-12">
          <p class="text-muted">No work items found.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: projectsData } = await useAsyncData('work-items-sorted', () =>
  queryCollection('content')
    .where('path', 'LIKE', '/work/%')
    .where('path', '!=', '/work')
    .all()
)

const projects = computed(() => {
  if (!projectsData.value) return []
  return [...projectsData.value].sort((a, b) => {
    const yearA = parseInt(String(a.meta?.year || a.year || 0), 10)
    const yearB = parseInt(String(b.meta?.year || b.year || 0), 10)
    return yearB - yearA
  })
})
</script>
