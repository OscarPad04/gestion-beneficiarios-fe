import api from './api'
import type { UserLoginRequest, UserLoginResponse, Usuario } from '../types'
import { TOKEN_KEY, USER_KEY } from '../config'

export class AuthService {
  
  async login(correo: string, password: string): Promise<UserLoginResponse> {
    try {
      const data: UserLoginRequest = { correo, password }
      const response = await api.post<UserLoginResponse>('/auth/login', data)
      
      // Guardar token y usuario
      if (response.data.access_token) {
        localStorage.setItem(TOKEN_KEY, response.data.access_token)
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.usuario))
      }
      
      return response.data
    } catch (error: any) {
      const errorDetail = error.response?.data?.detail || 'Error al iniciar sesión'
      throw new Error(typeof errorDetail === 'string' ? errorDetail : 'Credenciales inválidas')
    }
  }

  async refreshToken(): Promise<UserLoginResponse> {
    try {
      const response = await api.post<UserLoginResponse>('/auth/refresh-token')
      
      if (response.data.access_token) {
        localStorage.setItem(TOKEN_KEY, response.data.access_token)
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.usuario))
      }
      
      return response.data
    } catch (error) {
      this.logout()
      throw error
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  getUser(): Usuario | null {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
