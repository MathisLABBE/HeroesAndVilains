import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  getAllOrgs,
  createOrg as createOrgService,
  getOrgById,
  addTeamToOrg,
  removeTeamFromOrg,
} from '@/services/org.service'

import {
  getAllTeams,
  createTeam as createTeamService,
  addHeroesToTeam,
  removeHeroesFromTeam,
} from '@/services/team.service'

import {
  getHeroAliases,
  getHeroById,
  createHero as createHeroService,
  updateHero as updateHeroService,
  type HeroPayload,
} from '@/services/hero.service'

import { useErrorStore } from '@/stores/error.store'

type Power = {
  _id?: string
  name: string
  type: number
  level: number
}

type HeroAlias = {
  _id: string
  publicName: string
}

type Hero = {
  _id: string
  publicName: string
  realName: string
  powers: Power[]
}

type TeamAlias = {
  _id: string
  name: string
  nbAffiliations: number
}

type Team = {
  _id: string
  name: string
  members: string[]
}

type OrganizationAlias = {
  _id: string
  name: string
}

type Organization = {
  _id: string
  name: string
  secret: string
  teams: Team[]
}

export const useDataStore = defineStore('data', () => {
  const orgs = ref<OrganizationAlias[]>([])
  const currentOrg = ref<Organization | null>(null)

  const teams = ref<TeamAlias[]>([])
  const currentTeam = ref<Team | null>(null)

  const heroAliases = ref<HeroAlias[]>([])
  const currentHero = ref<Hero | null>(null)
  const currentTeamHeroes = ref<Hero[]>([])

  const errorStore = useErrorStore()

  function showError(context: string, data: unknown) {
    errorStore.pushError(`${context} : ${String(data)}`)
  }

  async function loadOrgs() {
    const response = await getAllOrgs()

    if (response.error === 0) {
      orgs.value = response.data
    } else {
      showError('Erreur organisations', response.data)
    }
  }

  async function createOrg(name: string, secret: string) {
    const response = await createOrgService(name, secret)

    if (response.error === 0) {
      await loadOrgs()
    } else {
      showError('Erreur création organisation', response.data)
    }
  }

  async function loadOrgById(id: string) {
    const response = await getOrgById(id)

    if (response.error === 0) {
      currentOrg.value = Array.isArray(response.data)
        ? response.data[0]
        : response.data
    } else {
      currentOrg.value = null
      showError('Erreur organisation', response.data)
    }
  }

  async function loadTeams() {
    const response = await getAllTeams()

    if (response.error === 0) {
      teams.value = response.data
    } else {
      showError('Erreur équipes', response.data)
    }
  }

  async function createTeam(name: string) {
    const response = await createTeamService(name)

    if (response.error === 0) {
      await loadTeams()
    } else {
      showError('Erreur création équipe', response.data)
    }
  }

  async function addTeamInCurrentOrg(idTeam: string) {
    if (!currentOrg.value) {
      return
    }

    const response = await addTeamToOrg(idTeam)

    if (response.error === 0) {
      await loadOrgById(currentOrg.value._id)
    } else {
      showError('Erreur ajout équipe organisation', response.data)
    }
  }

  async function removeTeamFromCurrentOrg(idTeam: string) {
    if (!currentOrg.value) {
      return
    }

    const response = await removeTeamFromOrg(idTeam)

    if (response.error === 0) {
      await loadOrgById(currentOrg.value._id)
    } else {
      showError('Erreur suppression équipe organisation', response.data)
    }
  }

  function setCurrentTeamFromOrg(idTeam: string) {
    if (!currentOrg.value) {
      return
    }

    const team = currentOrg.value.teams.find((t) => t._id === idTeam)

    if (team) {
      currentTeam.value = team
      currentTeamHeroes.value = []
    }
  }

  async function loadHeroAliases() {
    const response = await getHeroAliases()

    if (response.error === 0) {
      heroAliases.value = response.data
    } else {
      showError('Erreur alias héros', response.data)
    }
  }

  async function loadHeroById(id: string) {
    const response = await getHeroById(id)

    if (response.error === 0) {
      currentHero.value = Array.isArray(response.data)
        ? response.data[0]
        : response.data
    } else {
      currentHero.value = null
      showError('Erreur héros', response.data)
    }
  }

  async function loadHeroesForCurrentTeam() {
    currentTeamHeroes.value = []

    if (!currentTeam.value) {
      return
    }

    const heroes: Hero[] = []

    for (const idHero of currentTeam.value.members) {
      const response = await getHeroById(idHero)

      if (response.error === 0) {
        const hero = Array.isArray(response.data)
          ? response.data[0]
          : response.data

        if (hero) {
          heroes.push(hero)
        }
      } else {
        showError('Erreur chargement membre', response.data)
      }
    }

    currentTeamHeroes.value = heroes
  }

  async function addExistingHeroToCurrentTeam(idHero: string) {
  if (!currentTeam.value) {
    return
  }

  const response = await addHeroesToTeam(currentTeam.value._id, [idHero])

  if (response.error === 0) {
    currentTeam.value = Array.isArray(response.data)
      ? response.data[0]
      : response.data

    await loadHeroesForCurrentTeam()
  } else {
    showError('Erreur ajout héros équipe', response.data)
  }
}

async function removeHeroFromCurrentTeam(idHero: string) {
  if (!currentTeam.value) {
    return
  }

  const response = await removeHeroesFromTeam(currentTeam.value._id, [idHero])

  if (response.error === 0) {
    currentTeam.value = Array.isArray(response.data)
      ? response.data[0]
      : response.data

    await loadHeroesForCurrentTeam()
  } else {
    showError('Erreur suppression héros équipe', response.data)
  }
}

async function createHeroAndAddToCurrentTeam(hero: HeroPayload) {
  if (!currentTeam.value) {
    return
  }

  const createResponse = await createHeroService(hero)

  if (createResponse.error !== 0) {
    showError('Erreur création héros', createResponse.data)
    return
  }

  const createdHero = Array.isArray(createResponse.data)
    ? createResponse.data[0]
    : createResponse.data

  if (!createdHero?._id) {
    showError('Erreur : héros créé sans identifiant', createResponse.data)
    return
  }

  const addResponse = await addHeroesToTeam(currentTeam.value._id, [createdHero._id])

  if (addResponse.error === 0) {
    currentTeam.value = Array.isArray(addResponse.data)
      ? addResponse.data[0]
      : addResponse.data

    await loadHeroAliases()
    await loadHeroesForCurrentTeam()
  } else {
    showError('Erreur ajout du nouveau héros à l’équipe', addResponse.data)
  }
}

async function updateHeroInCurrentTeam(hero: HeroPayload) {
  if (!hero._id) {
    showError('Impossible de modifier un héros sans identifiant', '')
    alert('Impossible de modifier un héros sans identifiant.')
    return
  }

  const response = await updateHeroService(hero)

  if (response.error === 0) {
    await loadHeroAliases()
    await loadHeroesForCurrentTeam()
  } else {
    showError('Erreur modification héros', response.data)
    alert('Erreur modification héros : ' + response.data)
  }
}

  return {
    orgs,
    currentOrg,

    teams,
    currentTeam,

    heroAliases,
    currentHero,
    currentTeamHeroes,

    loadOrgs,
    createOrg,
    loadOrgById,

    loadTeams,
    createTeam,

    addTeamInCurrentOrg,
    removeTeamFromCurrentOrg,
    setCurrentTeamFromOrg,

    loadHeroAliases,
    loadHeroById,
    loadHeroesForCurrentTeam,

    addExistingHeroToCurrentTeam,
    removeHeroFromCurrentTeam,
    createHeroAndAddToCurrentTeam,
    updateHeroInCurrentTeam,
  }
})