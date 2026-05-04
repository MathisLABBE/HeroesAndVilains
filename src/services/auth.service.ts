import { getRequest, postRequest } from '@/services/axios.service'

async function signIn(login: string, password: string) {
  return postRequest('/authapi/auth/signin', {
    login,
    password,
  })
}

async function getUser(login: string) {
  return getRequest(`/authapi/user/getuser/${login}`)
}

export {
  signIn,
  getUser,
}