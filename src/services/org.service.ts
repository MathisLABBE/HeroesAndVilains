import { getRequest, postRequest, patchRequest } from '@/services/axios.service'

async function getAllOrgs() {
  return getRequest('/herocorp/orgs/get')
}

async function createOrg(name: string, secret: string) {
  return postRequest('/herocorp/orgs/create', {
    name,
    secret,
  })
}

async function getOrgById(id: string) {
  return getRequest(`/herocorp/orgs/getbyid/${id}`)
}

async function addTeamToOrg(idTeam: string) {
  return patchRequest('/herocorp/orgs/addteam', {
    idTeam,
  })
}

async function removeTeamFromOrg(idTeam: string) {
  return patchRequest('/herocorp/orgs/removeteam', {
    idTeam,
  })
}

export {
  getAllOrgs,
  createOrg,
  getOrgById,
  addTeamToOrg,
  removeTeamFromOrg,
}