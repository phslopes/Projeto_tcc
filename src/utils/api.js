const API_BASE_URL = 'http://localhost:3001/api'

const getToken = () => {
  return localStorage.getItem('token')
}

const makeAuthenticatedRequest = async (
  endpoint,
  method = 'GET',
  data = null,
  configOptions = {}
) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    method,
    headers
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  let url = `${API_BASE_URL}${endpoint}`
  if (configOptions.params && method === 'GET') {
    const queryParams = new URLSearchParams(configOptions.params).toString()
    if (queryParams) {
      url += `?${queryParams}`
    }
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage =
        errorData.message ||
        `Erro na requisição: ${response.status} ${response.statusText}`
      throw new Error(errorMessage)
    }

    if (
      response.status === 204 ||
      response.headers.get('content-length') === '0'
    ) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error(`API Request Error [${method} ${endpoint}]:`, error)
    throw error
  }
}

export const api = {
  get: (endpoint, configOptions) =>
    makeAuthenticatedRequest(endpoint, 'GET', null, configOptions),
  post: (endpoint, data) => makeAuthenticatedRequest(endpoint, 'POST', data),
  put: (endpoint, data) => makeAuthenticatedRequest(endpoint, 'PUT', data),
  delete: endpoint => makeAuthenticatedRequest(endpoint, 'DELETE')
}
