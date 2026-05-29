import api from './api'
import type { 
  Entrega, EntregaCreate,
  InventarioConsultaResponse,
  InventarioAlertasResponse,
  FocoSanitario, FocoSanitarioCreate,
  IndicadoresPanelResponse
} from '../types'

// Entregas
export class EntregaService {
  async registrar(data: EntregaCreate): Promise<Entrega> {
    const response = await api.post<Entrega>('/entregas/', data)
    return response.data
  }

  async get(id: number): Promise<Entrega> {
    const response = await api.get<Entrega>(`/entregas/${id}`)
    return response.data
  }
}

// Inventario
export class InventarioService {
  async consultar(idBodega?: number): Promise<InventarioConsultaResponse> {
    const response = await api.get<InventarioConsultaResponse>('/inventario/', {
      params: { id_bodega: idBodega }
    })
    return response.data
  }

  async obtenerAlertas(idBodega?: number): Promise<InventarioAlertasResponse> {
    const response = await api.get<InventarioAlertasResponse>('/inventario/alertas', {
      params: { id_bodega: idBodega }
    })
    return response.data
  }
}

// Focos Sanitarios
export class FocoSanitarioService {
  async crear(data: FocoSanitarioCreate): Promise<FocoSanitario> {
    const response = await api.post<FocoSanitario>('/focos-sanitarios/', data)
    return response.data
  }

  async listar(estado?: string, nivelRiesgo?: string, idZona?: number): Promise<FocoSanitario[]> {
    const response = await api.get<FocoSanitario[]>('/focos-sanitarios/', {
      params: { estado, nivel_riesgo: nivelRiesgo, id_zona: idZona }
    })
    return response.data
  }

  async get(id: number): Promise<FocoSanitario> {
    const response = await api.get<FocoSanitario>(`/focos-sanitarios/${id}`)
    return response.data
  }

  async actualizar(id: number, data: Partial<FocoSanitarioCreate>): Promise<FocoSanitario> {
    const response = await api.patch<FocoSanitario>(`/focos-sanitarios/${id}`, data)
    return response.data
  }

  async obtenerGeoJSON(incluirResueltos: boolean = false): Promise<any> {
    const response = await api.get('/focos-sanitarios/mapa', {
      params: { incluir_resueltos: incluirResueltos }
    })
    return response.data
  }
}

// Indicadores
export class IndicadoresService {
  async obtenerPanel(): Promise<IndicadoresPanelResponse> {
    const response = await api.get<IndicadoresPanelResponse>('/indicadores/')
    return response.data
  }
}

// Mapa
export class MapaService {
  async obtenerResumen(idZona?: number, limiteEntregas: number = 20): Promise<any> {
    const response = await api.get('/mapa/resumen', {
      params: { id_zona: idZona, limite_entregas: limiteEntregas }
    })
    return response.data
  }
}

// Reportes
export class ReportesService {
  async zonasSinEntregas(): Promise<any[]> {
    const response = await api.get('/reportes/zonas-sin-entregas')
    return response.data
  }
}

// Planes de Distribución
export class PlanDistribucionService {
  async listar(): Promise<any[]> {
    const response = await api.get('/planes-distribucion/')
    return response.data
  }

  async get(id: number): Promise<any> {
    const response = await api.get(`/planes-distribucion/${id}`)
    return response.data
  }

  async generar(): Promise<any> {
    const response = await api.post('/planes-distribucion/generar')
    return response.data
  }
}

export const entregaService = new EntregaService()
export const inventarioService = new InventarioService()
export const focoSanitarioService = new FocoSanitarioService()
export const indicadoresService = new IndicadoresService()
export const mapaService = new MapaService()
export const reportesService = new ReportesService()
export const planDistribucionService = new PlanDistribucionService()
