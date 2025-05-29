<!-- components/ThemeToggle.vue -->
<template>
  <UDropdownMenu
    :items="themeItems"
    arrow
    :content="{ side: 'bottom', align: 'end' }"
    :ui="{
      content: 'ring-1 ring-theme-border bg-theme-surface'
    }"
  >
    <UButton
      :icon="currentThemeIcon || 'i-heroicons-question-mark-circle'"
      color="neutral"
      variant="ghost"
      class="text-theme-primary-text hover:bg-theme-primary-hover/60 focus-visible:ring-2 focus-visible:ring-theme-primary"
      :aria-label="`当前主题: ${currentThemeLabel}`"
    />

    <template #item="{ item }">
      <UIcon :name="item.icon || 'i-heroicons-question-mark-circle'" class="w-4 h-4 flex-shrink-0 text-theme-primary" />
      <span class="truncate">{{ item.label }}</span>
      <UIcon
        v-if="item.value === colorMode.preference"
        name="i-heroicons-check-20-solid"
        class="w-4 h-4 ml-auto text-theme-primary flex-shrink-0"
      />
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { DropdownMenuItem } from '#ui/types'

const colorMode = useColorMode()

// 主题配置
// 图标可以从 https://icones.js.org/ 查找 heroicons
const availableThemes = [
  {
    value: 'xrj',
    label: '泡泡绿',
    // icon: 'i-game-icons-spiked-dragon-head'
    icon: 'i-basil-heart-outline'
  },
  {
    value: 'light',
    label: '钢兰',
    icon: 'i-heroicons-sun-20-solid'
  }
]

const currentTheme = computed(() => {
  return availableThemes.find(theme => theme.value === colorMode.preference) || availableThemes[0];
})

const currentThemeIcon = computed<string>(() => currentTheme.value?.icon || 'i-heroicons-question-mark-circle')
const currentThemeLabel = computed<string>(() => currentTheme.value?.label || '未知主题');

const changeTheme = async (newThemeValue: string) => {
  const applyChange = () => {
    colorMode.preference = newThemeValue;
  };

  if (typeof document !== 'undefined' && (document as any).startViewTransition) {
    (document as any).startViewTransition(applyChange);
  } else {
    applyChange();
  }
}

const themeItems = computed((): DropdownMenuItem[][] => [
  availableThemes.map(theme => ({
    label: theme.label,
    icon: theme.icon,
    slot: 'item',
    onSelect: () => {
      changeTheme(theme.value)
    },
    value: theme.value
  }))
])

watch(() => colorMode.preference, (newPreference, oldPreference) => {
  if (typeof document !== 'undefined') {
    const de = document.documentElement;

    if (oldPreference && oldPreference !== 'light' && oldPreference !== 'dark' && availableThemes.some(t => t.value === oldPreference)) {
      de.classList.remove(oldPreference);
    }

    if (newPreference && newPreference !== 'light' && newPreference !== 'dark' && availableThemes.some(t => t.value === newPreference)) {
      de.classList.add(newPreference);
    }
    if (newPreference === 'light' || newPreference === 'dark') {
        availableThemes.forEach(theme => {
            if (theme.value !== 'light' && theme.value !== 'dark') {
                de.classList.remove(theme.value);
            }
        });
    }
  }
}, { immediate: true });

</script> 