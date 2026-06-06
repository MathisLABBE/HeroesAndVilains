import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  getUser,
  signIn,
} from '@/services/auth.service'
import {
  authUpdateHero,
} from '@/services/hero.service'
import { setXsrfToken } from '@/services/axios.service'
import { useErrorStore } from '@/stores/errors'

export const useAuthStore = defineStore('auth', () => {
  const login = ref('')
  const xsrfToken = ref('')
  const refreshToken = ref('')
  const currentUser = ref(null)
  const isLogged = ref(false)

  const errorStore = useErrorStore()

  function isSuccess (response) {
    return response.err === 0 || response.error === 0
  }

  function saveSession (userData) {
    login.value = userData.name
    xsrfToken.value = userData.xsrfToken
    refreshToken.value = userData.refreshtoken
    isLogged.value = true
    setXsrfToken(xsrfToken.value)
  }

  function clearSession () {
    login.value = ''
    xsrfToken.value = ''
    refreshToken.value = ''
    currentUser.value = null
    isLogged.value = false
    setXsrfToken('')
  }

  async function loginUser (loginValue, passwordValue) {
    const response = await signIn(loginValue, passwordValue)

    if (isSuccess(response)) {
      saveSession(response.data)
      await loadCurrentUser()

      return true
    }

    errorStore.pushError(`Erreur connexion : ${String(response.data)}`)
    return false
  }

  async function loadCurrentUser () {
    if (!login.value) {
      errorStore.pushError('Aucun utilisateur connecté.')
      return
    }

    const response = await getUser(login.value)

    if (isSuccess(response)) {
      currentUser.value = response.data
    } else {
      currentUser.value = null

      if (handleExpiredJwt(response.data)) {
        return
      }

      errorStore.pushError(`Erreur chargement profil : ${String(response.data)}`)
    }
  }

  function logout () {
    clearSession()
  }

  async function updateCurrentHero (hero) {
    if (!isLogged.value) {
      errorStore.pushError('Vous devez être connecté pour modifier votre héros.')
      return false
    }

    const response = await authUpdateHero(hero)

    if (isSuccess(response)) {
      await loadCurrentUser()
      return true
    }

    if (handleExpiredJwt(response.data)) {
      return false
    }

    errorStore.pushError(`Erreur modification héros : ${String(response.data)}`)
    return false
  }

  function handleExpiredJwt (message) {
    const text = String(message).toLowerCase()

    if (text.includes('jwt') && text.includes('expir')) {
      logout()
      errorStore.pushError('Votre session a expiré. Veuillez vous reconnecter.')
      return true
    }

    return false
  }

  return {
    login,
    xsrfToken,
    refreshToken,
    currentUser,
    isLogged,

    loginUser,
    loadCurrentUser,
    updateCurrentHero,
    logout,
  }
})
