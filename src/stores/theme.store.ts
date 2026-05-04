import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Theme store to manage the application's visual mode.
 * Possible modes: 'hero', 'villain', 'opposition'
 */
export const useThemeStore = defineStore('theme', () => {
  const currentMode = ref<'hero' | 'villain' | 'opposition'>('hero')

  /**
   * Updates the current theme mode.
   * @param mode - The new mode to set
   */
  function setMode(mode: 'hero' | 'villain' | 'opposition') {
    currentMode.value = mode
  }

  return {
    currentMode,
    setMode,
  }
})
