// src/utils/api.js

const API_BASE_URL = 'http://localhost:3001/api' // URL base do seu backend

const getToken = () => {
  return localStorage.getItem('token')
}

// Modificado para aceitar um objeto configOptions que pode conter 'params'
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

  // --- NOVO: Lógica para adicionar parâmetros de query à URL para requisições GET ---
  let url = `${API_BASE_URL}${endpoint}`
  if (configOptions.params && method === 'GET') {
    const queryParams = new URLSearchParams(configOptions.params).toString()
    if (queryParams) {
      // Apenas adicione se houver parâmetros reais
      url += `?${queryParams}`
    }
  }
  // --- Fim da nova lógica ---

  try {
    const response = await fetch(url, config) // Use a URL que foi construída

    // Se a resposta não for OK, tenta ler a mensagem de erro do backend
    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage =
        errorData.message ||
        `Erro na requisição: ${response.status} ${response.statusText}`
      throw new Error(errorMessage)
    }

    // Se não houver conteúdo (ex: DELETE), retorna vazio
    if (
      response.status === 204 ||
      response.headers.get('content-length') === '0'
    ) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error(`API Request Error [${method} ${endpoint}]:`, error)
    // Relança o erro para ser tratado pelo componente que chamou
    throw error
  }
}

export const api = {
  // Ajuste o método 'get' para passar configOptions (que conterá 'params')
  get: (endpoint, configOptions) =>
    makeAuthenticatedRequest(endpoint, 'GET', null, configOptions),
  post: (endpoint, data) => makeAuthenticatedRequest(endpoint, 'POST', data),
  put: (endpoint, data) => makeAuthenticatedRequest(endpoint, 'PUT', data),
  delete: endpoint => makeAuthenticatedRequest(endpoint, 'DELETE')
}
