<template>
  <UContainer 
    class="py-0 px-0 sm:px-3 lg:px-8 max-w-screen-3xl"
  >
    <XrjCard class="mt-5">
      <div class="flex flex-col md:flex-row gap-4 p-4">
        <div class="flex-shrink-0 w-full md:w-1/4 lg:w-1/5 xl:w-1/6 flex justify-center md:justify-start">
          <img src="~/assets/xrj.png" alt="shabao" class="rounded-lg w-full h-auto object-contain" />
        </div>
        <div class="flex-grow space-y-3 text-sm md:text-base">
          <p>
            欢迎来到 泡泡龙按钮 复刻项目，这个项目从
            <UButton
              to="https://haruka.cmyr.ltd/"
              target="_blank"
              variant="link"
              :padded="false"
              class="text-theme-primary hover:text-theme-accent p-0"
            >
              https://haruka.cmyr.ltd/
            </UButton>
            获得灵感，加上本人工作上需要学习一些前端技术，就用nuxt3复刻了下。
          </p>
          <p>
            前端初学者，尽力了，边学边写，有空会优化。
          </p>
          <p>
            <b>使用指南</b>：点击按钮即可播放对应音声；多次点击可以造成相当鬼畜的效果；开启洗脑循环将会一直播放一个音频。
          </p>
          <p>
            <b>新增音声</b>：如果会一点编程的可以直接上
            <UButton
              :to="runtimeConfig.public.githubLink"
              target="_blank"
              variant="link"
              :padded="false"
              class="text-theme-primary hover:text-theme-accent p-0"
            >
              GitHub
            </UButton>
            提 pull request ，不会的可以提个 issue，或者想办法直接联系我。
          </p>
          <p><b>声明</b>：本项目仅为 DD 作品，和 其他任何主播、官方、个人没有关联。</p>
          <p>
            更多内容请参考
            <UButton
            target="_blank"
            variant="link"
            :padded="false"
            class="text-theme-primary hover:text-theme-accent p-0"
            :to="runtimeConfig.public.githubLink + '#readme'"
            >README
            </UButton>
            。
          </p>

          <XrjButton
            path="网站介绍1.mp3"
            rawTitle="真人朗读"
            :isLoop="isGlobalLoopActive"
            :stopAll="globalStopTrigger"
            size="md"
            class="mr-2 mb-2 bg-theme-primary text-theme-primary-text"
          />
          <XrjButton
            path="网站介绍2.mp3"
            rawTitle="一"
            :isLoop="isGlobalLoopActive"
            :stopAll="globalStopTrigger"
            size="md"
            class="mr-2 mb-2 bg-theme-primary text-theme-primary-text"
          />
          <XrjButton
            path="网站介绍3.mp3"
            rawTitle="二"
            :isLoop="isGlobalLoopActive"
            :stopAll="globalStopTrigger"
            size="md"
            class="mr-2 mb-2 bg-theme-primary text-theme-primary-text"
          />
          <XrjButton
            path="网站介绍4.mp3"
            rawTitle="三"
            :isLoop="isGlobalLoopActive"
            :stopAll="globalStopTrigger"
            size="md"
            class="mr-2 mb-2 bg-theme-primary text-theme-primary-text"
          />

          <UAlert
            v-if="runtimeConfig.public.enableNotice"
            icon="i-heroicons-exclamation-triangle"
            color="warning"
            variant="subtle"
            class="mt-3"
          >
            <template #title>
              <span class="font-bold">迁移公告</span>
            </template>
            <template #description>
              本网站未来将迁移到 <UButton to="https://xiaoroujiao.com" target="_blank" variant="link" :padded="false" class="text-yellow-600 hover:text-yellow-500 p-0">https://xiaoroujiao.com</UButton>，届时请访问新域名。
            </template>
          </UAlert>

          <UAlert
            v-if="runtimeConfig.public.enableQrCode"
            icon="i-heroicons-credit-card"
            color="primary"
            variant="subtle"
            class="mt-3"
          >
             <template #title>
              <span class="font-bold">赞助项目</span>
            </template>
            <template #description>
                欢迎赞助本项目！赞助资金将用于本网站的日常运营！也将为作者继续维护项目提供信心~
            </template>
          </UAlert>
        </div>
      </div>
    </XrjCard>

    <div class="py-5 space-y-5">

      <XrjCard rawTitle="最新动态">
        <!-- 加载状态 -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="p-4 rounded-xl animate-pulse">
            <div class="h-4 bg-gray-800 rounded mb-2"></div>
            <div class="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="p-4 rounded-xl bg-red-50 text-red-600">
          {{ error }}
          <UButton 
            @click="refresh" 
            size="sm" 
            variant="ghost" 
            class="ml-2"
            label="重试"
          />
        </div>
        
        <!-- 动态内容 -->
        <div v-else-if="enableDynamic && dynamic.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-theme-text">
          <div 
            v-for="item in dynamic" 
            :key="item.guid" 
            class="py-2 space-y-2 rounded-l transition-colors text-sm"
          >
            <!-- 动态标题 -->
            <h3 v-if="item.title" class="font-bold text-theme-text d line-clamp-4 pb-1">
              {{ item.title }}
            </h3>
            
            <!-- 动态内容 -->
            <p class="text-theme-text line-clamp-10 leading-7 whitespace-pre-line">
              {{ item.contentSnippet }}
            </p>
            
            <!-- 动态链接和时间 -->
            <div v-if="item.link">
              <span>动态链接：</span>
              <UButton
                :to="item.link"
                target="_blank"
                variant="link"
                :padded="false"
                class="text-theme-primary hover:text-theme-accent p-0"
              >
                {{ item.link }}
              </UButton>
            </div>
            <div v-if="item.isoDate" class="pt-1">
              发布时间：{{ item.isoDate }}
            </div>
          </div>
        </div>
        
        <!-- 无动态状态 -->
        <div v-else-if="enableDynamic" class="p-4 rounded-xl text-center text-gray-500 dark:text-gray-400">
          暂无最新动态
        </div>
        
        <!-- 功能未启用 -->
        <div v-else class="p-4 rounded-xl text-center text-gray-500 dark:text-gray-400">
          最新动态功能未启用
        </div>
      </XrjCard>

      <XrjCard rawTitle="播放控制">
        <div class="flex flex-wrap gap-2 items-center">
          <UButton
            icon="i-heroicons-play-circle"
            label="列表循环播放"
            @click="handleOverallPlayLoop"
            class="relative rounded-3xl bg-theme-primary text-theme-primary-text"
          />
          <UButton
            icon="i-heroicons-arrow-path-rounded-square"
            label="随机播放"
            @click="handleOverallRandomPlay"
            class="relative rounded-3xl bg-theme-primary text-theme-primary-text"
          />
          <UButton
            icon="i-heroicons-stop-circle"
            label="停止播放"
            @click="stopAllPageAudio"
            color="primary"
            class="relative rounded-3xl bg-theme-primary text-theme-primary-text"
          />
          <UButton
            :label="isGlobalLoopActive ? '洗脑循环开启中' : '洗脑循环已关闭'"
            :icon="isGlobalLoopActive ? 'i-heroicons-check-circle' : 'i-heroicons-no-symbol'"
            @click="toggleGlobalLoop"
            :class="isGlobalLoopActive ? 'relative rounded-3xl bg-theme-primary text-theme-primary-text' : 'relative rounded-3xl bg-theme-primary-hover text-theme-primary-text'"
          />
        </div>
      </XrjCard>

      <!-- 音频按钮组 -->
      <XrjCard v-for="group in sampleVoiceGroups" :key="group.tag" :rawTitle="group.tag">
        <div class="flex flex-wrap">
          <XrjButton
            v-for="voice in group.voices"
            :key="voice.id"
            :path="voice.path"
            :rawTitle="voice.title"
            :isLoop="isGlobalLoopActive"
            :stopAll="globalStopTrigger"
            v-model:isPlay="voice.isPlaying"
            size="md"
            class="mr-2 mb-2 bg-theme-primary text-theme-primary-text"
          />
        </div>
      </XrjCard>

      <XrjCard 
        rawTitle="隐藏内容，不建议打开"
        :collapsible="true"
        :defaultCollapsed="true"
      >
        <div class="flex flex-wrap">
          <XrjButton
            path="爱库库.mp3"
            rawTitle="个人奖励"
            :isLoop="isGlobalLoopActive"
            :stopAll="globalStopTrigger"
            size="md"
            class="mr-2 mb-2 bg-theme-primary text-theme-primary-text"
          />
        </div>
      </XrjCard>

    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed, onUnmounted } from 'vue'
import rawVoicesData from '~/public/voices/voiceList'
const runtimeConfig = useRuntimeConfig()

interface Voice {
  id: string
  path: string
  title: string
  isPlaying: boolean
}

interface VoiceGroup {
  tag: string
  voices: Voice[]
}

const { dynamic, loading, error, enableDynamic, refresh } = useBiliDynamic(runtimeConfig.public.biliUid)

definePageMeta({
  layout: 'base'
})

const isGlobalLoopActive = ref(false)
const globalStopTrigger = ref(false)

const playbackState = ref({
  mode: 'none' as 'none' | 'sequence' | 'random', 
  currentIndex: 0,
  isActive: false
})

const currentVoice = computed(() => {
  if (playbackState.value.isActive && 
      playbackState.value.currentIndex >= 0 && 
      playbackState.value.currentIndex < allVoicesFlat.value.length) {
    return allVoicesFlat.value[playbackState.value.currentIndex]
  }
  return null
})

let playbackWatcher: (() => void) | null = null

function toggleGlobalLoop() {
  isGlobalLoopActive.value = !isGlobalLoopActive.value
}

async function stopAllPageAudio() {
  if (playbackWatcher) {
    playbackWatcher()
    playbackWatcher = null
  }
  
  playbackState.value.mode = 'none'
  playbackState.value.isActive = false
  
  globalStopTrigger.value = true
  await nextTick()

  sampleVoiceGroups.value.forEach((group: VoiceGroup) => {
    group.voices.forEach((voice: Voice) => {
      voice.isPlaying = false
    })
  })
  
  globalStopTrigger.value = false
}

function playNextInSequence() {
  if (!playbackState.value.isActive || allVoicesFlat.value.length === 0) {
    return
  }

  if (playbackState.value.mode === 'sequence') {
    playbackState.value.currentIndex = (playbackState.value.currentIndex + 1) % allVoicesFlat.value.length
  } else if (playbackState.value.mode === 'random') {
    let randomIndex
    if (allVoicesFlat.value.length === 1) {
      randomIndex = 0
    } else {
      do {
        randomIndex = Math.floor(Math.random() * allVoicesFlat.value.length)
      } while (randomIndex === playbackState.value.currentIndex)
    }
    playbackState.value.currentIndex = randomIndex
  }

  const nextVoice = allVoicesFlat.value[playbackState.value.currentIndex]
  if (nextVoice) {
    nextVoice.isPlaying = true
  }
}

async function handleOverallPlayLoop() {
  await stopAllPageAudio()
  
  if (allVoicesFlat.value.length === 0) return

  playbackState.value.mode = 'sequence'
  playbackState.value.currentIndex = 0
  playbackState.value.isActive = true

  allVoicesFlat.value[0].isPlaying = true

  if (playbackWatcher) {
    playbackWatcher()
  }
  
  playbackWatcher = watch(
    () => {
      const current = currentVoice.value
      return current ? current.isPlaying : null
    },
    (isPlaying: boolean | null, oldIsPlaying: boolean | null) => {
      if (oldIsPlaying === true && isPlaying === false && playbackState.value.isActive) {
        if (playbackState.value.mode === 'sequence') {
          nextTick(() => {
            playNextInSequence()
          })
        } else if (playbackState.value.mode === 'random') {
          playbackState.value.isActive = false
          playbackState.value.mode = 'none'
        }
      }
    }
  )
}

// 开始随机播放
async function handleOverallRandomPlay() {
  await stopAllPageAudio()
  
  if (allVoicesFlat.value.length === 0) return

  playbackState.value.mode = 'random'
  playbackState.value.currentIndex = Math.floor(Math.random() * allVoicesFlat.value.length)
  playbackState.value.isActive = true

  allVoicesFlat.value[playbackState.value.currentIndex].isPlaying = true

  if (playbackWatcher) {
    playbackWatcher()
  }
  
  playbackWatcher = watch(
    () => {
      const current = currentVoice.value
      return current ? current.isPlaying : null
    },
    (isPlaying: boolean | null, oldIsPlaying: boolean | null) => {
      if (oldIsPlaying === true && isPlaying === false && playbackState.value.isActive) {
        // 随机播放完一个后停止
        playbackState.value.isActive = false
        playbackState.value.mode = 'none'
      }
    }
  )
}


// 根据 tag 分组
const groupedVoices = rawVoicesData.reduce((acc, voice) => {
  const { tag, path, messages } = voice;
  if (!acc[tag]) {
    acc[tag] = [];
  }
  acc[tag].push({
    id: path,
    path: path,
    title: messages.zh,
    isPlaying: false
  });
  return acc;
}, {} as Record<string, { id: string; path: string; title: string; isPlaying: boolean }[]>);

const sampleVoiceGroups = ref(
  Object.entries(groupedVoices).map(([tag, voices]) => ({
    tag: tag,
    voices: voices
  }))
);

const allVoicesFlat = computed(() => sampleVoiceGroups.value.flatMap((g: VoiceGroup) => g.voices));

onUnmounted(() => {
  if (playbackWatcher) {
    playbackWatcher()
  }
})
</script>