<template>
  <footer class="py-8 text-center text-sm bg-theme-dark-bg text-theme-primary-hover ">
    <UContainer>
      <p>
        <NuxtLink to="/about" class="hover:text-theme-accent transition-colors">
          Copyright &copy; {{ copyrightYear }} {{ runtimeConfig.public.copyright }}. All Rights Reserved.
        </NuxtLink>
      </p>
      <p class="mt-1">
        <NuxtLink to="https://beian.miit.gov.cn/" target="_blank" class="hover:text-theme-accent transition-colors">
          {{ runtimeConfig.public.icp }}
        </NuxtLink>
        <!-- <span class="mx-1">  ||</span>
        <NuxtLink to="http://www.beian.gov.cn/" target="_blank" class="hover:text-theme-accent transition-colors">
          {{ runtimeConfig.public.police }}
        </NuxtLink> -->
      </p>
      <div class="mt-2 flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-3">
        <NuxtLink 
          target="_blank" 
          aria-label="GitHub Project" 
          class="inline-flex items-center hover:text-theme-accent transition-colors"
          :to="runtimeConfig.public.githubLink" 
        >
          <UIcon name="i-simple-icons-github" class="text-lg mr-1" /> 项目地址
        </NuxtLink>
      </div>
      <div class="mt-3 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <a 
          :href="runtimeConfig.public.githubLink" 
          target="_blank" 
          v-if="runtimeConfig.public.repositorieName"
          class="inline-block hover:opacity-80 transition-opacity"
        >
          <img 
            :src="`https://img.shields.io/github/package-json/v/${runtimeConfig.public.repositorieName}?color=${badgesColorHex}`" 
            :alt="`GitHub Version for ${runtimeConfig.public.repositorieName}`"
            class="h-5"
          >
        </a>
        <a 
          :href="runtimeConfig.public.githubLink" 
          target="_blank" 
          v-if="runtimeConfig.public.repositorieName"
          class="inline-block hover:opacity-80 transition-opacity"
        >
          <img 
            :src="`https://img.shields.io/github/watchers/${runtimeConfig.public.repositorieName}?style=social`" 
            :alt="`GitHub Watchers for ${runtimeConfig.public.repositorieName}`"
            class="h-5"
          >
        </a>
        <a 
          :href="runtimeConfig.public.githubLink" 
          target="_blank" 
          v-if="runtimeConfig.public.repositorieName"
          class="inline-block hover:opacity-80 transition-opacity"
        >
          <img 
            :src="`https://img.shields.io/github/stars/${runtimeConfig.public.repositorieName}?style=social`" 
            :alt="`GitHub Stars for ${runtimeConfig.public.repositorieName}`"
            class="h-5"
          >
        </a>
        <a 
          :href="`${runtimeConfig.public.githubLink}/blob/main/LICENSE`" 
          target="_blank" 
          v-if="runtimeConfig.public.repositorieName"
          class="inline-block hover:opacity-80 transition-opacity"
        >
          <img 
            :src="`https://img.shields.io/github/license/${runtimeConfig.public.repositorieName}?style=flat-square&color=${badgesColorHex}`" 
            :alt="`License for ${runtimeConfig.public.repositorieName}`"
            class="h-5"
          >
        </a>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const appConfig = useAppConfig()

const copyrightYear = computed(() => {
  const currentYear = new Date().getFullYear()
  return currentYear === 2025 ? '2025' : `2025 - ${currentYear}`
})

// badges 颜色的十六进制值
const badgesColorHex = computed(() => {
  // return appConfig.badges?.primaryColor || '00a63e'
  return '00a63e'
})

</script>