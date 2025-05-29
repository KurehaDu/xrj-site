<template>
  <div class="container max-w-4xl mx-auto p-6">
    <UCard class="text-center text-theme-text">
      <template #header>
        <h1 class="text-3xl font-bold">关于</h1>
      </template>

      <div class="space-y-8">
        <div>
          <h3 class="text-xl mb-4">
            本网站由 {{ runtimeConfig.public.author }}(
            <UButton
              variant="ghost"
              target="_blank"
              class="inline-flex items-center align-middle text-theme-primary p-0 text-xl"
              :to="runtimeConfig.public.githubLink"
            >
              <UIcon name="i-simple-icons-github" class="items-center w-5 h-5 p-0" />
              github
            </UButton>
            <!-- 、
            <template v-if="runtimeConfig.public.authorBiliUid">
              <UButton
                variant="ghost"
                size="sm"
                :to="`https://space.bilibili.com/${runtimeConfig.public.authorBiliUid}`"
                target="_blank"
                class="inline-flex items-center text-theme-primary blue-500 p-0"
              >
                <UIcon name="i-simple-icons-bilibili" class="w-5 h-5 p-0" />
                bilibili
              </UButton>
            </template> -->
            )
            开发并提供技术支持
          </h3>
        </div>

        <div>
          <h2 class="text-2xl font-semibold mb-4">使用技术</h2>
          <div class="space-y-3">
            <div v-for="item in useList" :key="item.url" class="text-lg">
              <h3>
                {{ item.msg }}，官网：
                <UButton
                  variant="link"
                  :to="item.url"
                  target="_blank"
                  class="p-0 text-theme-primary text-lg"
                >
                  {{ item.url }}
                </UButton>
              </h3>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-semibold mb-4">参考项目</h2>
          <div class="space-y-3">
            <div v-for="item in referList" :key="item.url" class="text-lg">
              <h3>
                {{ item.msg }}，地址：
                <UButton
                  variant="link"
                  :to="item.url"
                  target="_blank"
                  class="p-0 text-theme-primary text-lg"
                >
                  {{ item.url }}
                </UButton>
              </h3>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-semibold mb-4">友情链接</h2>
          <div class="space-y-3">
            <div v-for="item in friendshipLinksData" :key="item.url" class="text-lg">
              <h3>
                {{ item.msg }}，地址：
                <UButton
                  variant="link"
                  :to="item.url"
                  target="_blank"
                  class="p-0 text-theme-primary text-lg"
                >
                  {{ item.url }}
                </UButton>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="text-center">
          <UButton
            size="lg"
            to="/"
            class="px-8 bg-theme-primary"
          >
            返回首页
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'base',
  title: '关于'
})

const runtimeConfig = useRuntimeConfig()

import { friendshipLinks, referenceProjects } from '~/config/links'

const packageInfo = await $fetch<{
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}>('/api/package-info').catch(() => null)

const useList = computed(() => {
  const deps = packageInfo?.dependencies || {}
  const devDeps = packageInfo?.devDependencies || {}
  
  return [
    {
      msg: `框架：Nuxt.js (${deps['nuxt'] || '3.x'})`,
      url: 'https://nuxt.com/',
    },
    {
      msg: `Vue框架：Vue.js (${deps['vue'] || '3.x'})`,
      url: 'https://cn.vuejs.org/',
    },
    {
      msg: `UI组件库：Nuxt UI (${deps['@nuxt/ui'] || '3.x'})`,
      url: 'https://ui.nuxt.com/',
    },
    {
      msg: `CSS框架：Tailwind CSS (${devDeps['tailwindcss'] || '4.x'})`,
      url: 'https://tailwindcss.com/',
    },
    {
      msg: `图标：Iconify`,
      url: 'https://iconify.design/',
    },
    {
      msg: 'RSS服务：RSSHub',
      url: 'https://docs.rsshub.app/',
    },
  ]
})

const referList = ref(referenceProjects)

const friendshipLinksData = ref(friendshipLinks)

useSeoMeta({
  title: '关于',
  description: `关于 ${runtimeConfig.public.htmlTitle} - 技术栈、参考项目和友情链接`,
})
</script>
