<script setup lang="ts">
const images = [
  '/images/home_slideshow/big_zeus.jpg',
  '/images/home_slideshow/big_zeus_2.jpg',
  '/images/home_slideshow/big_zeus_3.jpg',
  '/images/home_slideshow/big_zeus_4.jpg',
  '/images/home_slideshow/big_zeus_5.jpg',
  '/images/home_slideshow/big_zeus_6.jpg',
  '/images/home_slideshow/big_zeus_7.jpg',
  '/images/home_slideshow/class_shot.jpg',
  '/images/home_slideshow/clown.jpg',
  '/images/home_slideshow/with_philippe.jpg'
]

const currentImageIndex = ref(0)

onMounted(() => {
  if (images.length > 0) {
    setInterval(() => {
      currentImageIndex.value = (currentImageIndex.value + 1) % images.length
    }, 5000)
  }
})
</script>

<template>
  <div class="absolute inset-0 z-0 overflow-hidden bg-background">
    <!-- Slideshow Images -->
    <transition-group name="fade" tag="div" class="absolute inset-0 h-full w-full">
      <div 
        v-for="(image, index) in images" 
        :key="image"
        v-show="currentImageIndex === index"
        class="absolute inset-0"
      >
        <img 
          :src="image" 
          alt="Atmospheric Background" 
          class="h-full w-full object-cover opacity-40 transition-transform duration-[10000ms] ease-linear transform scale-100 animate-ken-burns" 
        />
      </div>
    </transition-group>

    <!-- Overlay Gradient -->
    <div class="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes ken-burns {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.1);
    }
}

.animate-ken-burns {
    animation: ken-burns 10s ease-out forwards;
}
</style>
