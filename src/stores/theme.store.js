import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentMode = ref('opposition') // Set default to opposition

  function setMode (mode) {
    currentMode.value = mode
  }

  return {
    currentMode,
    setMode,
  }
})
