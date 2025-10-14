import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const userService = {
  createUser: (userData) => api.post('/users', userData),
  getUserByEmail: (email) => api.get(`/users/email/${email}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
}

export const goalService = {
  createGoal: (goalData) => api.post('/goals', goalData),
  getUserGoals: (userId) => {
    console.log('Calling getUserGoals with userId:', userId)
    return api.get(`/goals/user/${userId}`)
  },
  getGoalById: (id) => api.get(`/goals/${id}`),
  updateGoal: (id, goalData) => api.put(`/goals/${id}`, goalData),
  updateProgress: (id, progress) => api.put(`/goals/${id}/progress`, { progress }),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
  getCompletedGoalsCount: (userId) => api.get(`/goals/user/${userId}/completed-count`),
}

export const simulationService = {
  runSimulation: (goalId, parameters) => api.post(`/simulations/run/${goalId}`, parameters),
  getGoalSimulations: (goalId) => api.get(`/simulations/goal/${goalId}`),
  getUserSimulations: (userId) => api.get(`/simulations/user/${userId}`),
}

export default api