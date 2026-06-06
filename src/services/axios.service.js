import axios from 'axios'
import { useSecretStore } from '@/stores/secret'

const axiosAgent = axios.create({
  baseURL: 'https://apidemo.iut-bm.univ-fcomte.fr',
  withCredentials: true,
})

let xsrfToken = ''

function setXsrfToken (token) {
  xsrfToken = token
}

function getHeaders () {
  const secretStore = useSecretStore()
  const headers = {}

  if (secretStore.secret !== '') {
    headers['org-secret'] = secretStore.secret
  }

  if (xsrfToken !== '') {
    headers['x-xsrf-token'] = xsrfToken
  }

  return headers
}

function handleAxiosError (error) {
  if (axios.isAxiosError(error)) {
    if (error.response && error.response.data) {
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
    const response = await axiosAgent.get(url, {
      headers: getHeaders(),
    })
    return response.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

async function postRequest (url, data) {
  try {
    const response = await axiosAgent.post(url, data, {
      headers: getHeaders(),
    })
    return response.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

async function putRequest (url, data) {
  try {
    const response = await axiosAgent.put(url, data, {
      headers: getHeaders(),
    })
    return response.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

async function patchRequest (url, data) {
  try {
    const response = await axiosAgent.patch(url, data, {
      headers: getHeaders(),
    })
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
  setXsrfToken,
}
