/**
 * router/index.ts
 */

import { createRouter, createWebHistory } from 'vue-router'

import { useSecretStore } from '@/stores/secret.store'
import { useErrorStore } from '@/stores/error.store'
import { useUserStore } from '@/stores/user.store'

import Index from '@/pages/index.vue'
import HomePage from '@/pages/HomePage.vue'
import SecretPage from '@/pages/SecretPage.vue'
import OrganizationsPage from '@/pages/OrganizationsPage.vue'
import OrganizationPage from '@/pages/OrganizationPage.vue'
import TeamsPage from '@/pages/TeamsPage.vue'
import TeamPage from '@/pages/TeamPage.vue'
import HeroLoginPage from '@/pages/HeroLoginPage.vue'
import HeroProfilePage from '@/pages/HeroProfilePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/secret',
      name: 'secret',
      component: SecretPage,
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: OrganizationsPage,
    },
    {
      path: '/organization',
      name: 'organization',
      component: OrganizationPage,
      meta: {
        needSecret: true,
      },
    },
    {
      path: '/teams',
      name: 'teams',
      component: TeamsPage,
    },
    {
      path: '/team',
      name: 'team',
      component: TeamPage,
      meta: {
        needSecret: true,
      },
    },
    {
      path: '/hero-login',
      name: 'hero-login',
      component: HeroLoginPage,
    },
    {
      path: '/hero-profile',
      name: 'hero-profile',
      component: HeroProfilePage,
      meta: {
        needHeroAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: Index,
      meta: {
        is404: true,
      },
    },
  ],
})

router.beforeEach((to) => {
  const secretStore = useSecretStore()
  const userStore = useUserStore()
  const errorStore = useErrorStore()

  if (to.meta.is404) {
    errorStore.pushError('Route inconnue. Redirection vers l’accueil.')
    return {
      name: 'home',
    }
  }

  if (to.meta.needSecret && !secretStore.hasSecret) {
    errorStore.pushError('Vous devez saisir une phrase secrète avant d’accéder à cette page.')
    return {
      name: 'secret',
    }
  }

  if (to.meta.needHeroAuth && !userStore.isLogged) {
    errorStore.pushError('Vous devez vous connecter avec un compte héros avant d’accéder à cette page.')
    return {
      name: 'hero-login',
    }
  }

  return true
})

export default router