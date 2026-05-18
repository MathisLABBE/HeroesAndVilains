import { getRequest, patchRequest, postRequest } from '@/services/axios.service'

async function getAllOrgs () {
  return getRequest('/herocorp/orgs/get')
}

async function createOrg (name, secret) {
  return postRequest('/herocorp/orgs/create', {
    name,
    secret,
  })
}

async function getOrgById (id) {
  return getRequest(`/herocorp/orgs/getbyid/${id}`)
}

async function addTeamToOrg (idTeam) {
  return patchRequest('/herocorp/orgs/addteam', {
    idTeam,
  })
}

async function removeTeamFromOrg (idTeam) {
  return patchRequest('/herocorp/orgs/removeteam', {
    idTeam,
  })
}

export {
  addTeamToOrg,
  createOrg,
  getAllOrgs,
  getOrgById,
  removeTeamFromOrg,
}
