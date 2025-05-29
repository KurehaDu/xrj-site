<template>
  <span class="xrj-button-wrapper relative inline-block box-border mr-[15px] mb-[15px] rounded-3xl overflow-hidden">
    <UTooltip :text="props.rawTitle" :disabled="!rawTitleIsLong" :popper="{ placement: 'top' }">
      <UButton
        :label="props.rawTitle"
        :color="props.color"
        :size="props.size"
        @click="handleClick"
        :disabled="isButtonDisabled"
        class="relative rounded-3xl bg-theme-primary text-theme-primary-text"
      />
    </UTooltip>

    <div
      v-for="mask in activeMasks"
      :key="mask.id"
      class="absolute top-0 left-0 h-full bg-black/20 rounded-3xl cursor-pointer z-10"
      :class="mask.animationClass"
      :style="{ animationDuration: `${mask.duration}s`, ...maskStyle }"
      @click="handleClick"
    />
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import type { PropType } from 'vue'

const runtimeConfig = useRuntimeConfig()

type ButtonUISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type StrictButtonUIColor = 
  'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  rawTitle: {
    type: String,
    required: true,
  },
  isPlay: {
    type: Boolean,
    default: false,
  },
  isLoop: {
    type: Boolean,
    default: false,
  },
  stopAll: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<ButtonUISize>,
    default: 'md',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String as PropType<StrictButtonUIColor>,
    default: 'primary',
  }
})

const emit = defineEmits(['update:isPlay'])

const isLoading = ref(false) 
const internalDisabled = ref(false)

const activeSounds = ref<HTMLAudioElement[]>([])
const activeMasks = ref<{ id: number; duration: number; animationClass: string }[]>([])
let nextMaskId = 0

const isButtonDisabled = computed(() => props.disabled || internalDisabled.value)
const rawTitleIsLong = computed(() => props.rawTitle.length > 20) 

const finalAudioPath = computed(() => {
  const voiceFile = `voices/${props.path}`
  const cdnURL = runtimeConfig.public.cdnURL as string | undefined;

  if (cdnURL) {
    const cdnBase = cdnURL.endsWith('/') ? cdnURL.slice(0, -1) : cdnURL;
    const pathPart = voiceFile.startsWith('/') ? voiceFile.slice(1) : voiceFile;
    return `${cdnBase}/${pathPart}`;
  }
  return `/${voiceFile.startsWith('/') ? voiceFile.slice(1) : voiceFile}`;
})

const maskStyle = {};


function playInstance() {
  if (internalDisabled.value && !props.isLoop) return

  internalDisabled.value = true;
  isLoading.value = true; 

  const audio = new Audio()
  audio.preload = 'metadata'

  const currentMaskId = nextMaskId++
  let maskDuration = 1;

  audio.onloadedmetadata = () => {
    maskDuration = audio.duration > 0 && isFinite(audio.duration) ? audio.duration : 1;
  }

  audio.oncanplaythrough = async () => {
    internalDisabled.value = false;
    isLoading.value = false;
    try {
      await audio.play()
      activeSounds.value.push(audio)
      activeMasks.value.push({
        id: currentMaskId,
        duration: maskDuration,
        animationClass: 'animate-playing-mask',
      })
      if (!props.isPlay) {
        emit('update:isPlay', true)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      internalDisabled.value = false;
      isLoading.value = false;
       if (activeSounds.value.length === 0 && props.isPlay) {
           emit('update:isPlay', false)
       }
    }
  }

  audio.onended = () => {
    const index = activeSounds.value.indexOf(audio)
    if (index > -1) activeSounds.value.splice(index, 1)
    const maskIndex = activeMasks.value.findIndex(m => m.id === currentMaskId)
    if (maskIndex > -1) activeMasks.value.splice(maskIndex, 1)

    if (props.isLoop && !props.stopAll) {
      nextTick(() => {
        const wasGloballyDisabled = props.disabled || internalDisabled.value;
        internalDisabled.value = false;
        playInstance();
        internalDisabled.value = wasGloballyDisabled && !props.disabled ? true : props.disabled;
      })
    } else {
      if (activeSounds.value.length === 0 && props.isPlay) {
        emit('update:isPlay', false)
      }
    }
  }

  audio.onerror = (e) => {
    console.error('Audio error:', e, 'Path:', finalAudioPath.value)
    internalDisabled.value = false;
    isLoading.value = false;
    const index = activeSounds.value.indexOf(audio)
    if (index > -1) activeSounds.value.splice(index, 1)
    const maskIndex = activeMasks.value.findIndex(m => m.id === currentMaskId)
    if (maskIndex > -1) activeMasks.value.splice(maskIndex, 1)
    if (activeSounds.value.length === 0 && props.isPlay) {
        emit('update:isPlay', false)
    }
  }

  audio.src = finalAudioPath.value
  audio.load()
}

function handleClick() {
  if (props.disabled || internalDisabled.value) return;
  playInstance()
}

watch(() => props.isPlay, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    if(activeSounds.value.length === 0) {
        playInstance()
    }
  }
})

watch(() => props.stopAll, (newVal) => {
  if (newVal) {
    activeSounds.value.forEach(audio => {
      audio.pause()
      audio.src = ""
      audio.load()
      audio.onended = null
      audio.oncanplaythrough = null
      audio.onerror = null
      audio.onloadedmetadata = null
    })
    activeSounds.value = []
    activeMasks.value = []
    if (props.isPlay) {
        emit('update:isPlay', false)
    }
    isLoading.value = false;
    internalDisabled.value = false;
  }
})

onUnmounted(() => {
  activeSounds.value.forEach(audio => {
    audio.pause();
    audio.src = "";
    audio.load();
    audio.onended = null;
    audio.oncanplaythrough = null;
    audio.onerror = null;
    audio.onloadedmetadata = null;
  });
  activeSounds.value = [];
  activeMasks.value = [];
});
</script>
