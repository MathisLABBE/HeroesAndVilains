import { getRequest, postRequest } from '@/services/axios.service'

async function signIn (login, password) {
  return postRequest('/authapi/auth/signin', {
    login,
    password,
  })
}

async function getUser (login) {
  return getRequest(`/authapi/user/getuser/${login}`)
}

export {
  getUser,
  signIn,
}
