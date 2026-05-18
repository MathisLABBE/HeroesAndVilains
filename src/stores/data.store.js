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
import { useErrorStore } from '@/stores/error.store'

export const useDataStore = defineStore('data', () => {
  const orgs = ref([])
  const currentOrg = ref(null)

  const teams = ref([])
  const currentTeam = ref(null)

  const heroAliases = ref([])
  const currentHero = ref(null)
  const currentTeamHeroes = ref([])

  const errorStore = useErrorStore()

  function showError (context, data) {
    errorStore.pushError(`${context} : ${String(data)}`)
  }

  async function loadOrgs () {
    const response = await getAllOrgs()

    if (response.error === 0) {
      orgs.value = response.data
    } else {
      showError('Erreur organisations', response.data)
    }
  }

  async function createOrg (name, secret) {
    const response = await createOrgService(name, secret)

    if (response.error === 0) {
      await loadOrgs()
    } else {
      showError('Erreur création organisation', response.data)
    }
  }

  async function loadOrgById (id) {
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

  async function loadTeams () {
    const response = await getAllTeams()

    if (response.error === 0) {
      teams.value = response.data
    } else {
      showError('Erreur équipes', response.data)
    }
  }

  async function createTeam (name) {
    const response = await createTeamService(name)

    if (response.error === 0) {
      await loadTeams()
    } else {
      showError('Erreur création équipe', response.data)
    }
  }

  async function addTeamInCurrentOrg (idTeam) {
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

  async function removeTeamFromCurrentOrg (idTeam) {
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

    if (response.error === 0) {
      heroAliases.value = response.data
    } else {
      showError('Erreur alias héros', response.data)
    }
  }

  async function loadHeroById (id) {
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

  async function loadHeroesForCurrentTeam () {
    currentTeamHeroes.value = []

    if (!currentTeam.value) {
      return
    }

    const heroes = []

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

  async function addExistingHeroToCurrentTeam (idHero) {
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

  async function removeHeroFromCurrentTeam (idHero) {
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

  async function createHeroAndAddToCurrentTeam (hero) {
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

  async function updateHeroInCurrentTeam (hero) {
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
