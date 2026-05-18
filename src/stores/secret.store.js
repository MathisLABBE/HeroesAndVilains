import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSecretStore = defineStore('secret', () => {
  const secret = ref('')

  const hasSecret = computed(() => {
    return secret.value.trim() !== ''
  })

  function setSecret (value) {
    secret.value = value
  }

  function clearSecret () {
    secret.value = ''
  }

  return {
    secret,
    hasSecret,
    setSecret,
    clearSecret,
  }
})
