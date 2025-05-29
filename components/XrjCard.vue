<script setup lang="ts">
const props = defineProps({
  rawTitle: {
    type: String,
    default: '',
  },
  collapsible: {
    type: Boolean,
    default: false
  },
  defaultCollapsed: {
    type: Boolean,
    default: false
  }
})

const isCollapsed = ref(props.defaultCollapsed)

const toggleCollapse = () => {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<template>
  <UCard
    :ui="{
      root: 'bg-white rounded-xl shadow-[1px_5px_22px] shadow-theme-primary-active overflow-hidden',
      header: 'pt-7 pb-0 sm:px-6 border-b-0',
      body: 'p-3.5 sm:p-6',
      footer: 'p-0 sm:px-6' 
    }"
  >
    <template #header v-if="rawTitle">
      <div 
        class="flex items-center justify-between cursor-pointer" 
        @click="toggleCollapse"
      >
        <p class="font-sans text-xl font-semibold text-theme-text">
          {{ rawTitle }}
        </p>
        <UIcon
          v-if="collapsible"
          :name="isCollapsed ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          class="transition-all duration-300 p-1 rounded-full bg-gray-300 hover:bg-gray-900"
        />
      </div>
    </template>

    <div 
      v-show="!isCollapsed || !collapsible"
      class="transition-all duration-300"
    >
      <slot />
    </div>

  </UCard>
</template>
