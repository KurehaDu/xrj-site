<template>
  <header
    class="fixed top-0 z-40 w-full bg-theme-primary text-theme-primary-text shadow-md"
    :style="headerDynamicStyle"
  >
    <UContainer class="flex items-center h-12 sm:h-16 px-4 max-w-none">
      <UButton
        icon="i-fa-solid-bars"
        variant="ghost"
        class="mr-2 text-theme-primary-text hover:bg-theme-primary-hover/60"
        @click="$emit('toggleSidebar')"
        aria-label="Toggle sidebar"
      />
      <NuxtLink to="/" class="text-lg sm:text-xl font-semibold mr-auto truncate hover:bg-theme-primary-hover/10">
        {{ runtimeConfig.public.htmlTitle }}
      </NuxtLink>

      <ClientOnly>
        <ThemeToggle class="mr-2" />
        <template #fallback>
          <div class="mr-2 w-8 h-8 text-theme-primary-text hover:bg-theme-primary-hover/60"></div> 
        </template>
      </ClientOnly>

      <UTooltip text="项目地址">
        <UButton
          icon="i-simple-icons-github"
          variant="ghost"
          class="text-theme-primary-text hover:bg-theme-primary-hover/60"
          target="_blank"
          aria-label="GitHub Project"
          :to="runtimeConfig.public.githubLink as string"
        />
      </UTooltip>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  isDesktopSidebarVisible: {
    type: Boolean,
    default: false
  },
  sidebarWidthPixels: {
    type: Number,
    default: 256
  }
})

const runtimeConfig = useRuntimeConfig()
defineEmits(['toggleSidebar'])

const headerDynamicStyle = computed(() => {
  const styles: Record<string, string> = {
    transition: 'left var(--sidebar-transition-duration, 300ms) ease-in-out, width var(--sidebar-transition-duration, 300ms) ease-in-out'
  };

  if (props.isDesktopSidebarVisible) {
    styles.left = `${props.sidebarWidthPixels}px`;
    styles.width = `calc(100% - ${props.sidebarWidthPixels}px)`;
  } else {
    styles.left = '0px';
    styles.width = '100%';
  }
  return styles;
});

</script>
