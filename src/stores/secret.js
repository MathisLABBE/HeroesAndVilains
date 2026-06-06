import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSecretStore = defineStore('secret', () => {
  const secret = ref('')
  const hasSecret = ref(false)

  function setSecret (value) {
    secret.value = value
    hasSecret.value = secret.value.trim() !== ''
  }

  function clearSecret () {
    secret.value = ''
    hasSecret.value = false
  }

  return {
    secret,
    hasSecret,
    setSecret,
    clearSecret,
  }
})
