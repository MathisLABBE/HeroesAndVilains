import { getRequest, patchRequest, postRequest } from '@/services/axios.service'

async function getAllTeams () {
  return getRequest('/herocorp/teams/get')
}

async function createTeam (name) {
  return postRequest('/herocorp/teams/create', {
    name,
  })
}

async function addHeroesToTeam (idTeam, idHeroes) {
  return patchRequest('/herocorp/teams/addheroes', {
    idTeam,
    idHeroes,
  })
}

async function removeHeroesFromTeam (idTeam, idHeroes) {
  return patchRequest('/herocorp/teams/removeheroes', {
    idTeam,
    idHeroes,
  })
}

export {
  addHeroesToTeam,
  createTeam,
  getAllTeams,
  removeHeroesFromTeam,
}
