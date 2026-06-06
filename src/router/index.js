import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/errors'
import { useSecretStore } from '@/stores/secret'

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      root: () => import('@/views/HomeView.vue'),
    },
  },
  {
    path: '/secret',
    name: 'Secret',
    components: {
      root: () => import('@/views/SecretView.vue'),
    },
  },
  {
    path: '/organizations',
    name: 'Organizations',
    components: {
      root: () => import('@/views/OrganizationsView.vue'),
    },
  },
  {
    path: '/organization',
    name: 'Organization',
    components: {
      root: () => import('@/views/OrganizationView.vue'),
    },
    meta: {
      needSecret: true,
    },
  },
  {
    path: '/teams',
    name: 'Teams',
    components: {
      root: () => import('@/views/TeamsView.vue'),
    },
  },
  {
    path: '/team',
    name: 'Team',
    components: {
      root: () => import('@/views/TeamView.vue'),
    },
    meta: {
      needSecret: true,
    },
  },
  {
    path: '/hero-login',
    name: 'HeroLogin',
    components: {
      root: () => import('@/views/HeroLoginView.vue'),
    },
  },
  {
    path: '/hero-profile',
    name: 'HeroProfile',
    components: {
      root: () => import('@/views/HeroProfileView.vue'),
    },
    meta: {
      needHeroAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    components: {
      root: () => import('@/views/HomeView.vue'),
    },
    meta: {
      is404: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

function checkAccess (to) {
  const secretStore = useSecretStore()
  const authStore = useAuthStore()

  if (to.meta.needSecret && !secretStore.hasSecret) {
    return false
  }

  if (to.meta.needHeroAuth && !authStore.isLogged) {
    return false
  }

  return true
}

router.beforeEach((to, from, next) => {
  const errorStore = useErrorStore()

  if (to.meta.is404) {
    errorStore.pushError('Route inconnue. Redirection vers l’accueil.')
    next('/')
  } else if (checkAccess(to)) {
    next()
  } else if (to.meta.needSecret) {
    errorStore.pushError('Vous devez saisir une phrase secrète avant d’accéder à cette page.')
    next('/secret')
  } else {
    errorStore.pushError('Vous devez vous connecter avec un compte héros avant d’accéder à cette page.')
    next('/hero-login')
  }
})

export default router
