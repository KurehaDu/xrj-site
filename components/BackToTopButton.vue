<template>
  <Transition
    v-if="showButton"
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 transform translate-y-2"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-2"
  >
    <div>
      <UTooltip text="回到顶部" :popper="{ placement: 'top-end' }"> 
        <UButton
          icon="i-heroicons-arrow-up"
          variant="solid"
          square
          class="fixed bottom-8 right-8 z-40 !rounded-full p-3 shadow-lg bg-theme-primary"
          aria-label="Back to top"
          @click="scrollToTop"
        />
      </UTooltip>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useWindowScroll, useWindowSize } from '@vueuse/core'
import { useRoute } from '#imports' // Nuxt 3 auto-import for useRoute

const { y: scrollTop } = useWindowScroll()
const { height: windowHeight } = useWindowSize()
const showButton = ref(false)
const route = useRoute()

const checkScroll = () => {
  showButton.value = scrollTop.value >= (windowHeight.value / 3 || 300)
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  checkScroll() 
  window.addEventListener('scroll', checkScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})

watch(() => route.path, () => {
  if (scrollTop.value > 50) {
    scrollToTop()
  }
})
</script> 