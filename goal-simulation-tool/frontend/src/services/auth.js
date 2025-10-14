import api from './api'

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      const message = error.response?.data || 'Login failed. Please try again.'
      throw new Error(message)
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      const message = error.response?.data || 'Registration failed. Please try again.'
      throw new Error(message)
    }
  },

  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}