import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  getUser,
  signIn,
} from '@/services/auth.service'
import {
  authUpdateHero,
} from '@/services/hero.service'
import { useErrorStore } from '@/stores/error.store'

export const useUserStore = defineStore('user', () => {
  const login = ref(localStorage.getItem('login') || '')
  const xsrfToken = ref(localStorage.getItem('xsrfToken') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')

  const currentUser = ref(null)

  const errorStore = useErrorStore()

  const isLogged = computed(() => {
    return login.value.trim() !== '' && xsrfToken.value.trim() !== ''
  })

  async function loginUser (loginValue, passwordValue) {
    const response = await signIn(loginValue, passwordValue)

    if (response.err === 0 || response.error === 0) {
      login.value = response.data.name
      xsrfToken.value = response.data.xsrfToken
      refreshToken.value = response.data.refreshtoken

      localStorage.setItem('login', login.value)
      localStorage.setItem('xsrfToken', xsrfToken.value)
      localStorage.setItem('refreshToken', refreshToken.value)

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

    if (response.err === 0 || response.error === 0) {
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
    login.value = ''
    xsrfToken.value = ''
    refreshToken.value = ''
    currentUser.value = null

    localStorage.removeItem('login')
    localStorage.removeItem('xsrfToken')
    localStorage.removeItem('refreshToken')
  }

  async function updateCurrentHero (hero) {
    if (!isLogged.value) {
      errorStore.pushError('Vous devez être connecté pour modifier votre héros.')
      return false
    }

    const response = await authUpdateHero(hero)

    if (response.err === 0 || response.error === 0) {
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
