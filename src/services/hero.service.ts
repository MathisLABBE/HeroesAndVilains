import { getRequest, postRequest, putRequest } from '@/services/axios.service'

type Power = {
  name: string
  type: number
  level: number
}

type HeroPayload = {
  _id?: string
  publicName: string
  realName: string
  powers: Power[]
}

async function getHeroAliases() {
  return getRequest('/herocorp/heroes/getaliases')
}

async function getHeroById(id: string) {
  return getRequest(`/herocorp/heroes/getbyid/${id}`)
}

async function createHero(hero: HeroPayload) {
  return postRequest('/herocorp/heroes/create', hero)
}

async function updateHero(hero: HeroPayload) {
  return putRequest('/herocorp/heroes/update', hero)
}

async function authUpdateHero(hero: HeroPayload) {
  return putRequest('/herocorp/heroes/authupdate', hero)
}

export {
  getHeroAliases,
  getHeroById,
  createHero,
  updateHero,
  authUpdateHero,
}

export type {
  HeroPayload,
  Power,
}