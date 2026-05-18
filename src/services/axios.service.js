import axios from 'axios'
import { useSecretStore } from '@/stores/secret.store'

const axiosAgent = axios.create({
  baseURL: 'https://apidemo.iut-bm.univ-fcomte.fr',
  withCredentials: true,
})

axiosAgent.interceptors.request.use(config => {
  const secretStore = useSecretStore()

  config.headers = config.headers || {}

  if (secretStore.secret) {
    config.headers['org-secret'] = secretStore.secret
  }

  const xsrfToken = localStorage.getItem('xsrfToken')

  if (xsrfToken) {
    config.headers['x-xsrf-token'] = xsrfToken
  }

  return config
})

function handleAxiosError (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      return error.response.data
    }

    return {
      error: 1,
      status: 500,
      data: error.message,
    }
  }

  return {
    error: 1,
    status: 500,
    data: 'Erreur inconnue',
  }
}

async function getRequest (url) {
  try {
    const response = await axiosAgent.get(url)
    return response.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

async function postRequest (url, data) {
  try {
    const response = await axiosAgent.post(url, data)
    return response.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

async function putRequest (url, data) {
  try {
    const response = await axiosAgent.put(url, data)
    return response.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

async function patchRequest (url, data) {
  try {
    const response = await axiosAgent.patch(url, data)
    return response.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export {
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
}
