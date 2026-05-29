import api from './api'
import type { Familia, FamiliaCreate, Persona, PersonaCreate } from '../types'

// Familias
export class FamiliaService {
  async list(skip: number = 0, limit: number = 100): Promise<Familia[]> {
    const response = await api.get<Familia[]>('/familias/', { params: { skip, limit } })
    return response.data
  }

  async listByZona(): Promise<Familia[]> {
    const response = await api.get<Familia[]>('/familias/')
    return response.data
  }

  async get(id: number): Promise<Familia> {
    const response = await api.get<Familia>(`/familias/${id}`)
    return response.data
  }

  async create(data: FamiliaCreate): Promise<Familia> {
    const response = await api.post<Familia>('/familias/', data)
    return response.data
  }

  async calcularPuntaje(familiaId: number): Promise<any> {
    const response = await api.post(`/configuracion-puntaje/familias/${familiaId}/calcular-puntaje`)
    return response.data
  }
}

// Personas
export class PersonaService {
  async list(): Promise<Persona[]> {
    const response = await api.get<Persona[]>('/personas/')
    return response.data
  }

  async get(id: number): Promise<Persona> {
    const response = await api.get<Persona>(`/personas/${id}`)
    return response.data
  }

  async create(data: PersonaCreate): Promise<Persona> {
    const response = await api.post<Persona>('/personas/', data)
    return response.data
  }

  async update(id: number, data: Partial<PersonaCreate>): Promise<Persona> {
    const response = await api.put<Persona>(`/personas/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/personas/${id}`)
  }

  async getByFamilia(familiaId: number): Promise<Persona[]> {
    const response = await api.get<Persona[]>(`/personas/familias/${familiaId}/personas`)
    return response.data
  }

  async createInFamilia(familiaId: number, data: PersonaCreate): Promise<Persona> {
    const response = await api.post<Persona>(`/personas/familias/${familiaId}/personas`, data)
    return response.data
  }
}

export const familiaService = new FamiliaService()
export const personaService = new PersonaService()
