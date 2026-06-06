import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const isError = ref(false)
  const errorMsg = ref('')

  function pushError (message) {
    errorMsg.value = message
    isError.value = true
  }

  function popError () {
    isError.value = false
    errorMsg.value = ''
  }

  return {
    isError,
    errorMsg,
    pushError,
    popError,
  }
})
