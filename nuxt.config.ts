// https://nuxt.com/docs/api/configuration/nuxt-config
// import tailwindcss from "@tailwindcss/vite";


export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [// '@nuxt/fonts',
  '@nuxt/eslint', '@nuxt/ui', '@nuxt/icon', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  ui: {
    fonts: false
  },
  colorMode: {
    preference: 'xrj', 
    fallback: 'light', 
    classSuffix: '', 
    storageKey: 'nuxt-color-mode'
  },
  // // 简化的 Nitro 配置
  // nitro: {
  //   preset: 'node-server',
  //   experimental: {
  //     wasm: true
  //   },
  //   // 外部依赖处理
  //   // rollupConfig: {
  //   //   external: (id) => {
  //   //     // 确保rss-parser及其依赖不被外部化
  //   //     if (id.includes('rss-parser') || id.includes('entities')) {
  //   //       return false
  //   //     }
  //   //     return false
  //   //   }
  //   // },
  //   // 预渲染配置
  //   prerender: {
  //     crawlLinks: false
  //   }
  // },
  // // 标准的构建配置：让 Nuxt 处理 CommonJS 模块转换
  // build: {
  //   transpile: ['rss-parser']
  // },
  // 简化的 Vite 配置：仅处理 SSR 外部化
  // vite: {
  //   // build: {
  //   //   rollupOptions: {
  //   //     // 移除external配置，让依赖正常打包
  //   //   }
  //   // },
  //   optimizeDeps: {
  //     include: ['rss-parser', 'entities']
  //   },
  //   // 添加SSR配置
  //   ssr: {
  //     noExternal: ['rss-parser', 'entities']
  //   },
  //   define: {
  //     global: 'globalThis',
  //   }
  // },
  runtimeConfig: {
    public: {
      htmlTitle: process.env.NUXT_PUBLIC_HTML_TITLE || '按钮 (:3っ)∋',
      biliUid: process.env.NUXT_PUBLIC_BILI_UID || '419290316',
      biliLiveUid: process.env.NUXT_PUBLIC_BILI_LIVE_UID || '',
      enableQrCode: process.env.NUXT_PUBLIC_ENABLE_QR_CODE === 'true',
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || '',
      githubName: process.env.NUXT_PUBLIC_GITHUB_NAME || '',
      githubRepositorie: process.env.NUXT_PUBLIC_GITHUB_REPOSITORIE || '',
      repositorieName: process.env.NUXT_PUBLIC_REPOSITORIE_NAME || `${process.env.NUXT_PUBLIC_GITHUB_NAME || ''}/${process.env.NUXT_PUBLIC_GITHUB_REPOSITORIE || ''}`,
      githubLink: process.env.NUXT_PUBLIC_GITHUB_LINK || `https://github.com/${process.env.NUXT_PUBLIC_GITHUB_NAME || ''}/${process.env.NUXT_PUBLIC_GITHUB_REPOSITORIE || ''}`,
      police: process.env.NUXT_PUBLIC_POLICE || '',
      icp: process.env.NUXT_PUBLIC_ICP || '',
      author: process.env.NUXT_PUBLIC_AUTHOR || '',
      copyright: process.env.NUXT_PUBLIC_COPYRIGHT || '',
      enableNotice: process.env.NUXT_PUBLIC_ENABLE_NOTICE === 'true',
      rssBaseUrl: process.env.NUXT_PUBLIC_RSS_BASE_URL || '/rss',
      authorBiliUid: process.env.NUXT_PUBLIC_AUTHOR_BILI_UID || '',
      baiduSiteVerification: process.env.NUXT_PUBLIC_BAIDU_SITE_VERIFICATION || '',
    }
  },
})