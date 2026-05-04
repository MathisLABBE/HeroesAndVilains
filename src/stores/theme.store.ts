import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeMode = 'hero' | 'villain' | 'opposition'

export const useThemeStore = defineStore('theme', () => {
  const currentMode = ref<ThemeMode>('opposition') // Set default to opposition

  function setMode(mode: ThemeMode) {
    currentMode.value = mode
  }

  return {
    currentMode,
    setMode,
  }
})
