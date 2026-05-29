import api from './api'
import type { Usuario, UserRole } from '../types'

export class UserService {
  async list(skip: number = 0, limit: number = 100): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>('/users/', { params: { skip, limit } })
    return response.data
  }

  async get(id: number): Promise<Usuario> {
    const response = await api.get<Usuario>(`/users/${id}`)
    return response.data
  }

  async create(data: {
    nombre_completo: string
    correo: string
    rol: UserRole
    password: string
  }): Promise<Usuario> {
    const response = await api.post<Usuario>('/users/', data)
    return response.data
  }

  async update(
    id: number,
    data: Partial<{ nombre_completo: string; rol: UserRole; activo: boolean }>
  ): Promise<Usuario> {
    const response = await api.put<Usuario>(`/users/${id}`, data)
    return response.data
  }

  async deactivate(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
  }

  async activate(id: number): Promise<Usuario> {
    const response = await api.post<Usuario>(`/users/${id}/activate`)
    return response.data
  }
}

export const userService = new UserService()
