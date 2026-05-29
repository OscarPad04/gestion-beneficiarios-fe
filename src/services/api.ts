import axios from 'axios'
import { BASE_URL } from '../config'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` }
  config.baseURL = BASE_URL
  return config
})

export default api
