<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types'

const runtimeConfig = useRuntimeConfig()
const emit = defineEmits(['closeSidebar'])

const menuItems = computed<NavigationMenuItem[]>(() => [
  {
    label: '主页',
    icon: 'i-material-symbols-home-rounded',
    to: '/',
    exact: true,
    ui: {
      linkLeadingIcon: 'text-theme-primary'
    }
  },
  {
    label: '泡泡龙个人空间',
    icon: 'i-simple-icons-bilibili',
    to: `https://space.bilibili.com/${runtimeConfig.public.biliUid}`,
    target: '_blank',
    ui: {
      linkLeadingIcon: 'text-theme-primary'
    }
  },
  {
    label: '泡泡龙直播间',
    icon: 'i-ant-design-bilibili-outlined',
    to: `https://live.bilibili.com/${runtimeConfig.public.biliLiveUid}`,
    target: '_blank',
    ui: {
      linkLeadingIcon: 'text-theme-primary'
    }
  },
  // {
  //   label: '更新日志',
  //   icon: 'i-material-symbols-history',
  //   to: '/changelog',
  //   ui: {
  //     linkLeadingIcon: 'text-theme-primary'
  //   }
  // },
  {
    label: '关于',
    icon: 'i-iconamoon-information-circle-bold',
    to: '/about',
    ui: {
      linkLeadingIcon: 'text-theme-primary'
    }
  },
  // {
  //   label: '下载音频',
  //   icon: 'i-heroicons-arrow-down-tray',
  //   to: `${runtimeConfig.public.cdnPath || ''}${runtimeConfig.public.baseUrl}voices.zip`,
  //   target: '_blank',
  //   external: true,
  //   ui: {
  //     linkLeadingIcon: 'text-theme-primary'
  //   }
  // },
])
</script>

<template>
  <UCard 
    :ui="{ 
      root: 'ring-0 shadow-none divide-y divide-gray-200 dark:divide-gray-700 rounded-none',
      body: 'flex-grow overflow-y-auto p-0',
      header: 'p-4',
      footer: 'p-4' 
    }" 
    class="h-full flex flex-col bg-theme-surface"
  >
    <UNavigationMenu
      :items="menuItems"
      orientation="vertical"
      :ui="{
        item: 'relative p-0 border-b border-theme-border last:border-b-0 text-theme-text',
        link: 'flex items-center gap-x-6 w-full px-0 py-5 text-base font-medium text-theme-text  hover:bg-theme-primary-hover'
      }"
    />

    <template #footer v-if="runtimeConfig.public.enableQrCode">
      <div class="mt-auto space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <img src="~/assets/wx.png" alt="微信支付" class="w-full max-w-[200px] mx-auto rounded-lg" />
        <img src="~/assets/zfb.png" alt="支付宝" class="w-full max-w-[200px] mx-auto rounded-lg" />
      </div>
    </template>
  </UCard>
</template>
