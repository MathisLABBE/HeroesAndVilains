import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  createHero as createHeroService,
  getHeroAliases,
  getHeroById,
  updateHero as updateHeroService,
} from '@/services/hero.service'
import {
  addTeamToOrg,
  createOrg as createOrgService,
  getAllOrgs,
  getOrgById,
  removeTeamFromOrg,
} from '@/services/org.service'
import {
  addHeroesToTeam,
  createTeam as createTeamService,
  getAllTeams,
  removeHeroesFromTeam,
} from '@/services/team.service'
import { useErrorStore } from '@/stores/errors'

export const useDataStore = defineStore('data', () => {
  const orgs = ref([])
  const currentOrg = ref(null)

  const teams = ref([])
  const currentTeam = ref(null)

  const heroAliases = ref([])
  const currentTeamHeroes = ref([])

  const errorStore = useErrorStore()

  function isSuccess (response) {
    return response.error === 0 || response.err === 0
  }

  function firstResult (data) {
    return Array.isArray(data)
      ? data[0]
      : data
  }

  function showError (context, response) {
    errorStore.pushError(`${context} : ${String(response.data)}`)
  }

  async function loadOrgs () {
    const response = await getAllOrgs()

    if (isSuccess(response)) {
      orgs.value = response.data
    } else {
      showError('Erreur organisations', response)
    }
  }

  async function createOrg (name, secret) {
    const response = await createOrgService(name, secret)

    if (isSuccess(response)) {
      await loadOrgs()
    } else {
      showError('Erreur création organisation', response)
    }
  }

  async function loadOrgById (id) {
    const response = await getOrgById(id)

    if (isSuccess(response)) {
      currentOrg.value = firstResult(response.data)
    } else {
      currentOrg.value = null
      showError('Erreur organisation', response)
    }
  }

  async function loadTeams () {
    const response = await getAllTeams()

    if (isSuccess(response)) {
      teams.value = response.data
    } else {
      showError('Erreur équipes', response)
    }
  }

  async function createTeam (name) {
    const response = await createTeamService(name)

    if (isSuccess(response)) {
      await loadTeams()
    } else {
      showError('Erreur création équipe', response)
    }
  }

  async function addTeamInCurrentOrg (idTeam) {
    if (!currentOrg.value) {
      return
    }

    const response = await addTeamToOrg(idTeam)

    if (isSuccess(response)) {
      await loadOrgById(currentOrg.value._id)
    } else {
      showError('Erreur ajout équipe organisation', response)
    }
  }

  async function removeTeamFromCurrentOrg (idTeam) {
    if (!currentOrg.value) {
      return
    }

    const response = await removeTeamFromOrg(idTeam)

    if (isSuccess(response)) {
      await loadOrgById(currentOrg.value._id)
    } else {
      showError('Erreur suppression équipe organisation', response)
    }
  }

  function setCurrentTeamFromOrg (idTeam) {
    if (!currentOrg.value) {
      return
    }

    const team = currentOrg.value.teams.find(t => t._id === idTeam)

    if (team) {
      currentTeam.value = team
      currentTeamHeroes.value = []
    }
  }

  async function loadHeroAliases () {
    const response = await getHeroAliases()

    if (isSuccess(response)) {
      heroAliases.value = response.data
    } else {
      showError('Erreur alias héros', response)
    }
  }

  async function loadHeroesForCurrentTeam () {
    currentTeamHeroes.value = []

    if (!currentTeam.value) {
      return
    }

    const heroes = []

    for (const idHero of currentTeam.value.members) {
      const response = await getHeroById(idHero)

      if (isSuccess(response)) {
        const hero = firstResult(response.data)

        if (hero) {
          heroes.push(hero)
        }
      } else {
        showError('Erreur chargement membre', response)
      }
    }

    currentTeamHeroes.value = heroes
  }

  async function addExistingHeroToCurrentTeam (idHero) {
    if (!currentTeam.value) {
      return
    }

    const response = await addHeroesToTeam(currentTeam.value._id, [idHero])

    if (isSuccess(response)) {
      currentTeam.value = firstResult(response.data)

      await loadHeroesForCurrentTeam()
    } else {
      showError('Erreur ajout héros équipe', response)
    }
  }

  async function removeHeroFromCurrentTeam (idHero) {
    if (!currentTeam.value) {
      return
    }

    const response = await removeHeroesFromTeam(currentTeam.value._id, [idHero])

    if (isSuccess(response)) {
      currentTeam.value = firstResult(response.data)

      await loadHeroesForCurrentTeam()
    } else {
      showError('Erreur suppression héros équipe', response)
    }
  }

  async function createHeroAndAddToCurrentTeam (hero) {
    if (!currentTeam.value) {
      return
    }

    const createResponse = await createHeroService(hero)

    if (!isSuccess(createResponse)) {
      showError('Erreur création héros', createResponse)
      return
    }

    const createdHero = firstResult(createResponse.data)

    if (!createdHero || !createdHero._id) {
      showError('Erreur : héros créé sans identifiant', createResponse)
      return
    }

    const addResponse = await addHeroesToTeam(currentTeam.value._id, [createdHero._id])

    if (isSuccess(addResponse)) {
      currentTeam.value = firstResult(addResponse.data)

      await loadHeroAliases()
      await loadHeroesForCurrentTeam()
    } else {
      showError('Erreur ajout du nouveau héros à l’équipe', addResponse)
    }
  }

  async function updateHeroInCurrentTeam (hero) {
    if (!hero._id) {
      errorStore.pushError('Impossible de modifier un héros sans identifiant')
      return
    }

    const response = await updateHeroService(hero)

    if (isSuccess(response)) {
      await loadHeroAliases()
      await loadHeroesForCurrentTeam()
    } else {
      showError('Erreur modification héros', response)
    }
  }

  return {
    orgs,
    currentOrg,

    teams,
    currentTeam,

    heroAliases,
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
    loadHeroesForCurrentTeam,

    addExistingHeroToCurrentTeam,
    removeHeroFromCurrentTeam,
    createHeroAndAddToCurrentTeam,
    updateHeroInCurrentTeam,
  }
})
