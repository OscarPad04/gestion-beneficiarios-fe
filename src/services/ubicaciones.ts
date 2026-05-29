import api from './api'
import type { 
  Zona, ZonaCreate, 
  Refugio, RefugioCreate,
  Bodega, BodegaCreate,
  Recurso, RecursoCreate,
  TrasladoCreate, TrasladoResponse
} from '../types'

// Zonas
export class ZonaService {
  async list(): Promise<Zona[]> {
    const response = await api.get<Zona[]>('/zonas/')
    return response.data
  }

  async get(id: number): Promise<Zona> {
    const response = await api.get<Zona>(`/zonas/${id}`)
    return response.data
  }

  async create(data: ZonaCreate): Promise<Zona> {
    const response = await api.post<Zona>('/zonas/', data)
    return response.data
  }
}

// Refugios
export class RefugioService {
  async list(): Promise<Refugio[]> {
    const response = await api.get<Refugio[]>('/refugios/')
    return response.data
  }

  async get(id: number): Promise<Refugio> {
    const response = await api.get<Refugio>(`/refugios/${id}`)
    return response.data
  }

  async create(data: RefugioCreate): Promise<Refugio> {
    const response = await api.post<Refugio>('/refugios/', data)
    return response.data
  }
}

// Bodegas
export class BodegaService {
  async list(): Promise<Bodega[]> {
    const response = await api.get<Bodega[]>('/bodegas/')
    return response.data
  }

  async get(id: number): Promise<Bodega> {
    const response = await api.get<Bodega>(`/bodegas/${id}`)
    return response.data
  }

  async create(data: BodegaCreate): Promise<Bodega> {
    const response = await api.post<Bodega>('/bodegas/', data)
    return response.data
  }
}

// Recursos
export class RecursoService {
  async list(): Promise<Recurso[]> {
    const response = await api.get<Recurso[]>('/recursos/')
    return response.data
  }

  async create(data: RecursoCreate): Promise<Recurso> {
    const response = await api.post<Recurso>('/recursos/', data)
    return response.data
  }

  async updateUmbralAlerta(id: number, umbral: number | null): Promise<Recurso> {
    const response = await api.patch<Recurso>(
      `/recursos/${id}/umbral-alerta`,
      { umbral_alerta: umbral }
    )
    return response.data
  }
}

// Traslados
export class TrasladoService {
  async trasladarFamilia(data: TrasladoCreate): Promise<TrasladoResponse> {
    const response = await api.post<TrasladoResponse>('/traslados/', data)
    return response.data
  }
}

export const zonaService = new ZonaService()
export const refugioService = new RefugioService()
export const bodegaService = new BodegaService()
export const recursoService = new RecursoService()
export const trasladoService = new TrasladoService()
