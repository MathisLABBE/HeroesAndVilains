import { getRequest, postRequest, putRequest } from '@/services/axios.service'

async function getHeroAliases () {
  return getRequest('/herocorp/heroes/getaliases')
}

async function getHeroById (id) {
  return getRequest(`/herocorp/heroes/getbyid/${id}`)
}

async function createHero (hero) {
  return postRequest('/herocorp/heroes/create', hero)
}

async function updateHero (hero) {
  return putRequest('/herocorp/heroes/update', hero)
}

async function authUpdateHero (hero) {
  return putRequest('/herocorp/heroes/authupdate', hero)
}

export {
  authUpdateHero,
  createHero,
  getHeroAliases,
  getHeroById,
  updateHero,
}
