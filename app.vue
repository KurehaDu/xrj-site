<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const appConfig = useAppConfig()

useHead({
  title: runtimeConfig.public.htmlTitle as string,
  meta: [
    { name: 'description', content: appConfig.seo.description || '' },
    { name: 'keywords', content: appConfig.seo.keywords || '' },
    { name: 'baidu-site-verification', content: runtimeConfig.public.baiduSiteVerification || '' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/xrj.png',
    },
  ],
})
</script>

<template>
  <UApp>
    <NuxtLayout name="base" class="bg-theme-bg text-xl">
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
