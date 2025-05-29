<template>
  <div class="flex min-h-screen bg-theme-bg text-theme-text">

    <!-- 宽屏：固定侧边栏 -->
    <aside
      v-if="!isMobile && isClientReady"
      :class="[
        'fixed', 'top-0', 'left-0', 'z-30', 'h-screen', 'bg-theme-surface',
        'border-r border-theme-border',
        'overflow-x-hidden'
      ]"
      :style="{
        width: `${fixedSidebarPixelWidth}px`,
        transition: 'transform var(--sidebar-transition-duration, 300ms) ease-in-out',
        transform: isDesktopSidebarOpen && isClientReady ? 'translateX(0px)' : `translateX(-${fixedSidebarPixelWidth}px)`
      }"
    >
      <AppSidebar @close-sidebar="closeDesktopSidebar" />
    </aside>

    <!-- 窄屏：抽屉侧边栏 -->
    <USlideover
      v-if="isMobile && isClientReady"
      v-model:open="isMobileDrawerOpen"
      side="left"
      :class="['z-40', 'w-64']"
      :ui="{
        wrapper: 'bg-theme-surface ring-1 ring-theme-border',
        overlay: 'bg-black/75 z-30',
      }"
      aria-label="Mobile Navigation Menu"
      title="菜单"
      description="desc"
    >
      <template #content>
        <AppSidebar @close-sidebar="closeMobileDrawer" class="bg-theme-surface text-theme-text" />
      </template>
    </USlideover>

    <!-- Header + Main + Footer -->
    <div
      class="flex-grow flex flex-col w-full relative"
      :style="mainContentClientStyle"
    >
      <AppHeader 
        @toggle-sidebar="handleToggleSidebar" 
        :is-desktop-sidebar-visible="appHeaderDesktopSidebarVisibleProp"
        :sidebar-width-pixels="sidebarPixelWidth"
      />
      <main class="flex-grow p-0 sm:p-0 pt-16 sm:pt-20 bg-theme-bg">
        <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" :keepalive="true" />
      </main>
      <AppFooter class="border-t" />
    </div>

    <BackToTopButton />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const isClientReady = ref(false)
onMounted(() => {
  isClientReady.value = true
})

const isMobile = useMediaQuery('(max-width: 1023px)') 
const isDesktopSidebarOpen = ref(true)
const fixedSidebarPixelWidth = 256; 

const sidebarPixelWidth = computed(() => {
  return fixedSidebarPixelWidth; 
})

const appHeaderDesktopSidebarVisibleProp = computed(() => {
  const visible = isClientReady.value ? (!isMobile.value && isDesktopSidebarOpen.value) : false;
  return visible;
});

const isMobileDrawerOpen = ref(false)

const handleToggleSidebar = () => {
  if (isMobile.value) {
    isMobileDrawerOpen.value = !isMobileDrawerOpen.value
  } else {
    isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value
  }
}

const closeDesktopSidebar = () => {
  if (!isMobile.value) isDesktopSidebarOpen.value = false
}

const closeMobileDrawer = () => {
  if (isMobile.value) isMobileDrawerOpen.value = false
}

const mainContentClientStyle = computed(() => {
  const transitionStyle = 'margin-left var(--sidebar-transition-duration, 300ms) ease-in-out';
  if (!isClientReady.value) {
    return { 
      marginLeft: '0px', 
      transition: transitionStyle 
    }; 
  }
  if (!isMobile.value && isDesktopSidebarOpen.value) {
    return { 
      marginLeft: `${sidebarPixelWidth.value}px`, 
      transition: transitionStyle 
    }
  }
  return { 
    marginLeft: '0px', 
    transition: transitionStyle 
  }
})

watch(isMobile, (newIsMobile) => {
  if (!newIsMobile && isMobileDrawerOpen.value) { 
    isMobileDrawerOpen.value = false;
  }
})

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

<style>
:root {
  --sidebar-transition-duration: 300ms; 
}
</style>