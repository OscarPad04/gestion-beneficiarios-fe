// Auth Types
export interface UserLoginRequest {
  correo: string
  password: string
}

export interface UserLoginResponse {
  access_token: string
  token_type: string
  usuario: Usuario
}

export interface Usuario {
  id_usuario: number
  nombre_completo: string
  correo: string
  rol: UserRole
  activo: boolean
  fecha_creacion: string
  fecha_actualizacion: string
}

export type UserRole =
  | 'ADMIN'
  | 'CENSADOR'
  | 'OPERADOR_ENTREGAS'
  | 'COORDINADOR_LOGISTICA'
  | 'FUNCIONARIO_CONTROL'
  | 'REGISTRADOR_DONACIONES'

// Familia Types
export interface Familia {
  id_familia: number
  codigo_familia: string
  acepta_privacidad: boolean
  id_representante?: number
  fecha_registro: string
  puntaje_prioridad: number
  id_zona?: number
}

export interface FamiliaCreate {
  acepta_privacidad: boolean
  id_zona?: number
}

// Persona Types
export interface Persona {
  id_persona: number
  id_familia?: number
  nombre: string
  edad?: number
  es_nino: boolean
  es_anciano: boolean
  es_embarazada: boolean
  tipo_documento?: string
  numero_documento?: string
  tiene_discapacidad: boolean
  tiene_enfermedad_cronica: boolean
  es_cabeza_familia: boolean
}

export interface PersonaCreate {
  id_familia?: number
  nombre: string
  edad?: number
  es_nino?: boolean
  es_anciano?: boolean
  es_embarazada?: boolean
  tipo_documento?: string
  numero_documento?: string
  tiene_discapacidad?: boolean
  tiene_enfermedad_cronica?: boolean
  es_cabeza_familia?: boolean
}

// Zona Types
export type NivelRiesgo = 'bajo' | 'medio' | 'alto' | 'crítico'

export interface Zona {
  id_zona: number
  nombre: string
  nivel_riesgo: NivelRiesgo
}

export interface ZonaCreate {
  nombre: string
  nivel_riesgo: NivelRiesgo
}

// Bodega Types
export interface Bodega {
  id_bodega: number
  nombre: string
  latitud: number
  longitud: number
  capacidad_max_kg: string
  peso_actual_kg: string
  zona_id: number
  peso_porcentaje: number
  has_alerta: boolean
}

export interface BodegaCreate {
  nombre: string
  latitud: number
  longitud: number
  capacidad_max_kg: number
  peso_actual_kg?: number
  zona_id: number
}

// Refugio Types
export interface Refugio {
  id: number
  nombre: string
  ubicacion_textual?: string
  latitud: number
  longitud: number
  capacidad_maxima_personas: number
  ocupacion_actual: number
  zona_id?: number
  fecha_registro: string
  ocupacion_porcentaje: number
  has_alerta: boolean
}

export interface RefugioCreate {
  nombre: string
  ubicacion_textual?: string
  latitud: number
  longitud: number
  capacidad_maxima_personas: number
  ocupacion_actual?: number
  zona_id?: number
}

// Recurso Types
export type CategoriaRecurso = 'ALIMENTOS' | 'COBIJA' | 'COLCHONETA' | 'ASEO' | 'MEDICAMENTO'
export type UnidadMedida = 'KG' | 'UNIDAD' | 'LITRO'

export interface Recurso {
  id_recurso: number
  nombre: string
  categoria: CategoriaRecurso
  unidad_medida: UnidadMedida
  peso_unitario_kg?: number
  activo: boolean
  id_origen?: number
  umbral_alerta?: number
}

export interface RecursoCreate {
  nombre: string
  categoria: CategoriaRecurso
  unidad_medida: UnidadMedida
  peso_unitario_kg: number
  id_origen?: number
  umbral_alerta?: number
}

// Donante Types
export interface Donante {
  id_donante: number
  nombre: string
  tipo_donante: string
  fecha_registro?: string
}

export interface DonanteCreate {
  nombre: string
  tipo_donante: string
}

// Entrega Types
export type EstadoEntrega = 'PENDIENTE' | 'ENTREGADA' | 'ANULADA'

export interface DetalleEntregaItem {
  id_recurso: number
  cantidad: number
}

export interface Entrega {
  id_entrega: number
  codigo?: string
  estado: EstadoEntrega
  fecha?: string
  fecha_efectiva: string
  id_familia?: number
  id_bodega?: number
  coordenadas?: string
  firma_digital?: string
  detalles: DetalleEntregaResponse[]
}

export interface DetalleEntregaResponse {
  id_detalle: number
  id_recurso: number
  nombre_recurso?: string
  cantidad: number
}

export interface EntregaCreate {
  id_familia: number
  fecha_efectiva?: string
  id_bodega?: number
  coordenadas?: string
  firma_digital?: string
  detalles: DetalleEntregaItem[]
}

// Inventario Types
export interface InventarioLineaRecurso {
  id_recurso: number
  nombre: string
  categoria: CategoriaRecurso
  unidad_medida: UnidadMedida
  cantidad_disponible: number
  umbral_alerta?: number
  alerta_activa?: boolean
}

export interface InventarioPorBodega {
  id_bodega: number
  nombre: string
  lineas: InventarioLineaRecurso[]
}

export interface InventarioConsultaResponse {
  bodegas: InventarioPorBodega[]
  consolidado: InventarioConsolidadoLinea[]
}

export interface InventarioConsolidadoLinea {
  id_recurso: number
  nombre: string
  categoria: CategoriaRecurso
  unidad_medida: UnidadMedida
  cantidad_total: number
}

export interface InventarioAlertaItem {
  id_recurso: number
  nombre: string
  cantidad_disponible: number
  umbral_alerta: number
  bodega?: string
}

export interface InventarioAlertasResponse {
  total_alertas: number
  alertas: InventarioAlertaItem[]
}

// Foco Sanitario Types
export type TipoVector = 'AGUA_CONTAMINADA' | 'INSECTOS' | 'ROEDORES' | 'RESIDUOS' | 'OTRO'
export type EstadoFoco = 'ACTIVO' | 'EN_ATENCION' | 'RESUELTO'

export interface FocoSanitario {
  id_foco: number
  id_zona?: number
  id_refugio?: number
  tipo_vector: TipoVector
  nivel_riesgo: string
  acciones_tomadas?: string
  estado: EstadoFoco
  latitud?: number
  longitud?: number
  fecha_registro: string
  fecha_actualizacion: string
}

export interface FocoSanitarioCreate {
  id_zona?: number
  id_refugio?: number
  tipo_vector: TipoVector
  nivel_riesgo: string
  acciones_tomadas?: string
  latitud?: number
  longitud?: number
}

// Traslado Types
export interface TrasladoCreate {
  id_familia: number
  id_refugio_destino: number
}

export interface RefugioOcupacion {
  id_refugio: number
  nombre?: string
  capacidad_maxima: number
  ocupacion_actual: number
}

export interface TrasladoResponse {
  id_familia: number
  id_familia_refugio: number
  id_refugio_origen: number
  id_refugio_destino: number
  personas_trasladadas: number
  fecha_traslado: string
  origen: RefugioOcupacion
  destino: RefugioOcupacion
}

// Indicadores Panel
export interface RecursoDisponible {
  nombre: string
  cantidad: number
}

export interface IndicadoresPanelResponse {
  total_familias: number
  familias_atendidas: number
  familias_pendientes: number
  planes_programados: number
  planes_entregados: number
  focos_sanitarios_activos: number
  focos_sanitarios_en_atencion: number
  recursos_disponibles: RecursoDisponible[]
}

// Planes de Distribución Types
export type EstadoPlan = 'PROGRAMADO' | 'EN_PROCESO' | 'COMPLETADO' | 'ANULADO'

export interface PlanDistribucion {
  id_plan: number
  fecha_generacion: string
  estado: EstadoPlan
  id_familia: number
  puntaje_al_generar: number
  prioridad_orden: number
}

export interface GenerarPlanResponse {
  mensaje: string
  total_familias: number
}

export interface ConfiguracionPuntaje {
  id_config: number
  clave: string
  valor: number
  descripcion: string
}

export interface ConfiguracionPuntajeUpdate {
  valor: number
}

// Audit Log Types
export interface AuditLog {
  id_audit_log: number
  username: string | null
  method: string
  endpoint: string
  action: string
  status_code: number
  ip_address: string | null
  payload: Record<string, any> | null
  created_at: string
}

export interface AuditLogFilters {
  method?: string
  status_code?: number
  limit?: number
  offset?: number
}

// Mapa geográfico unificado (GET /mapa/resumen)
export type TipoMapaFeature = 'refugio' | 'bodega' | 'entrega' | 'familia' | 'zona'

export interface MapaFeatureProperties {
  id: number
  tipo: TipoMapaFeature | string
  estado?: string
  color?: string
  nombre?: string | null
  porcentaje?: number | null
  tiene_alerta?: boolean
  zona_id?: number | null
  codigo?: string | null
}

export interface MapaGeoFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: MapaFeatureProperties
}

export interface MapaResumenResponse {
  type: 'FeatureCollection'
  features: MapaGeoFeature[]
}

// API Response Types
export interface ApiErrorResponse {
  detail?: string | { loc: string[]; msg: string; type: string }[]
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
