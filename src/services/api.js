import axios from 'axios'

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  response => {
    // Convert snake_case to camelCase in response data
    if (response.data && typeof response.data === 'object') {
      response.data = normalizeResponseData(response.data)
    }
    return response
  },
  error => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // If token expired and not trying to login/register
      const url = error.config.url
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = `/login?redirect=${window.location.pathname}`
        }
      }
    }
    
    return Promise.reject(error)
  }
)

// Helper function to normalize response data (convert snake_case to camelCase)
function normalizeResponseData(data) {
  if (data === null || typeof data !== 'object') return data
  
  // If it's an array, normalize each item
  if (Array.isArray(data)) {
    return data.map(item => normalizeResponseData(item))
  }
  
  // For objects, convert keys and recurse for nested objects
  const normalized = {}
  
  Object.entries(data).forEach(([key, value]) => {
    // Convert snake_case keys to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    
    // Recursively normalize nested objects
    normalized[camelKey] = normalizeResponseData(value)
  })
  
  return normalized
}

// Helper methods
const apiService = {
  // Set authorization header with JWT token
  setAuthHeader(token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  
  // Clear authorization header
  clearAuthHeader() {
    delete api.defaults.headers.common['Authorization']
  },
  
  // GET request
  async get(url, config = {}) {
    return api.get(url, config)
  },
  
  // POST request
  async post(url, data = {}, config = {}) {
    return api.post(url, data, config)
  },
  
  // PUT request
  async put(url, data = {}, config = {}) {
    return api.put(url, data, config)
  },
  
  // DELETE request
  async delete(url, config = {}) {
    return api.delete(url, config)
  }
}

export default apiService 