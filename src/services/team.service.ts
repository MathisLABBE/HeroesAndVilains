import { getRequest, postRequest, patchRequest } from '@/services/axios.service'

async function getAllTeams() {
  return getRequest('/herocorp/teams/get')
}

async function createTeam(name: string) {
  return postRequest('/herocorp/teams/create', {
    name,
  })
}

async function addHeroesToTeam(idTeam: string, idHeroes: string[]) {
  return patchRequest('/herocorp/teams/addheroes', {
    idTeam,
    idHeroes,
  })
}

async function removeHeroesFromTeam(idTeam: string, idHeroes: string[]) {
  return patchRequest('/herocorp/teams/removeheroes', {
    idTeam,
    idHeroes,
  })
}

export {
  getAllTeams,
  createTeam,
  addHeroesToTeam,
  removeHeroesFromTeam,
}