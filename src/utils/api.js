// src/utils/api.js

const API_BASE_URL = 'http://localhost:3001/api'; // URL base do seu backend

const getToken = () => {
  return localStorage.getItem('token');
};

const makeAuthenticatedRequest = async (endpoint, method = 'GET', data = null) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Se a resposta não for OK, tenta ler a mensagem de erro do backend
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || `Erro na requisição: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Se não houver conteúdo (ex: DELETE), retorna vazio
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`API Request Error [${method} ${endpoint}]:`, error);
    // Relança o erro para ser tratado pelo componente que chamou
    throw error;
  }
};

export const api = {
  get: (endpoint) => makeAuthenticatedRequest(endpoint, 'GET'),
  post: (endpoint, data) => makeAuthenticatedRequest(endpoint, 'POST', data),
  put: (endpoint, data) => makeAuthenticatedRequest(endpoint, 'PUT', data),
  delete: (endpoint) => makeAuthenticatedRequest(endpoint, 'DELETE'),
};