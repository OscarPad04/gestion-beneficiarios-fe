// Matriz de permisos por rol según los requerimientos del SGAH (RF-43).
// Cada acción se evalúa de forma independiente. El sidebar y las vistas
// usan estas funciones para mostrar solo lo que el rol puede hacer.

export type Rol = 'ADMIN' | 'CENSADOR' | 'OPERADOR_ENTREGAS' | 'COORDINADOR_LOGISTICA' | 'FUNCIONARIO_CONTROL' | 'REGISTRADOR_DONACIONES'

export type Accion =
  | 'usuarios.crear'
  | 'usuarios.listar'
  | 'usuarios.actualizar'
  | 'familias.crear'
  | 'familias.listar'
  | 'personas.crear'
  | 'ubicaciones.crear'
  | 'recursos.crear'
  | 'recursos.inventario'
  | 'donantes.crear'
  | 'traslados.crear'
  | 'entregas.registrar'
  | 'entregas.listar'
  | 'reportes.ver'
  | 'planes.listar'
  | 'planes.generar'
  | 'configuracion_puntaje.ver'
  | 'configuracion_puntaje.editar'
  | 'focos.crear'
  | 'focos.listar'
  | 'focos.actualizar'
  | 'mapa.ver'
  | 'audit_logs.ver'

export const ACCIONES_POR_ROL: Record<Rol, Accion[]> = {
  ADMIN: [
    'usuarios.crear', 'usuarios.listar', 'usuarios.actualizar',
    'familias.crear', 'familias.listar',
    'personas.crear',
    'ubicaciones.crear',
    'recursos.crear', 'recursos.inventario',
    'donantes.crear',
    'traslados.crear',
    'entregas.registrar', 'entregas.listar',
    'reportes.ver',
    'planes.listar', 'planes.generar',
    'configuracion_puntaje.ver', 'configuracion_puntaje.editar',
    'focos.crear', 'focos.listar', 'focos.actualizar',
    'mapa.ver',
    'audit_logs.ver'
  ],
  CENSADOR: [
    'familias.crear', 'familias.listar',
    'personas.crear',
    'focos.crear', 'focos.listar',
    'mapa.ver'
  ],
  OPERADOR_ENTREGAS: [
    'familias.listar',
    'entregas.registrar', 'entregas.listar',
    'mapa.ver'
  ],
  COORDINADOR_LOGISTICA: [
    'familias.listar',
    'ubicaciones.crear',
    'recursos.crear', 'recursos.inventario',
    'entregas.listar',
    'planes.listar', 'planes.generar',
    'mapa.ver'
  ],
  FUNCIONARIO_CONTROL: [
    'familias.listar',
    'entregas.listar',
    'reportes.ver',
    'focos.listar', 'focos.actualizar',
    'mapa.ver'
  ],
  REGISTRADOR_DONACIONES: [
    'recursos.crear',
    'donantes.crear',
    'mapa.ver'
  ]
}

export type Modulo = 'usuarios' | 'familias' | 'personas' | 'ubicaciones' | 'recursos' | 'donantes' | 'traslados' | 'entregas' | 'reportes' | 'planes' | 'configuracion_puntaje' | 'focos' | 'mapa' | 'audit_logs'

export interface ModuloConfig {
  key: Modulo
  to: string
  label: string
  icon: string
  acciones: Accion[]
}

export const MODULOS: ModuloConfig[] = [
  { key: 'usuarios', to: '/dashboard/usuarios', label: 'Usuarios', acciones: ['usuarios.crear', 'usuarios.listar', 'usuarios.actualizar'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { key: 'familias', to: '/dashboard/familias', label: 'Familias', acciones: ['familias.crear', 'familias.listar'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { key: 'personas', to: '/dashboard/personas', label: 'Personas', acciones: ['personas.crear'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { key: 'ubicaciones', to: '/dashboard/ubicaciones', label: 'Ubicaciones', acciones: ['ubicaciones.crear'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' },
  { key: 'recursos', to: '/dashboard/recursos', label: 'Recursos', acciones: ['recursos.crear', 'recursos.inventario'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' },
  { key: 'donantes', to: '/dashboard/donantes', label: 'Donantes', acciones: ['donantes.crear'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
  { key: 'traslados', to: '/dashboard/traslados-refugios', label: 'Traslados', acciones: ['traslados.crear'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>' },
  { key: 'entregas', to: '/dashboard/entregas', label: 'Entregas', acciones: ['entregas.registrar', 'entregas.listar'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' },
  { key: 'reportes', to: '/dashboard/reportes', label: 'Reportes', acciones: ['reportes.ver'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' },
  { key: 'planes', to: '/dashboard/planes-distribucion', label: 'Planes', acciones: ['planes.listar', 'planes.generar'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="15" x2="8" y2="15"/><line x1="16" y1="11" x2="8" y2="11"/><path d="M10 19h4"/></svg>' },
  { key: 'configuracion_puntaje', to: '/dashboard/configuracion-puntaje', label: 'Config. Puntaje', acciones: [ 'configuracion_puntaje.ver', 'configuracion_puntaje.editar' ], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22"/><path d="M17 5H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7"/></svg>' },
  { key: 'focos', to: '/dashboard/focos-sanitarios', label: 'Focos Sanitarios', acciones: ['focos.crear', 'focos.listar', 'focos.actualizar'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
  { key: 'mapa', to: '/dashboard/mapa', label: 'Mapa', acciones: ['mapa.ver'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>' },
  { key: 'audit_logs', to: '/dashboard/audit-logs', label: 'Auditoría', acciones: ['audit_logs.ver'], icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' },
]

export function puede(rol: string | null | undefined, accion: Accion): boolean {
  if (!rol) return false
  const acciones = ACCIONES_POR_ROL[rol as Rol]
  if (!acciones) return false
  return acciones.includes(accion)
}

export function modulosParaRol(rol: string | null | undefined): ModuloConfig[] {
  if (!rol) return []
  return MODULOS.filter(m => m.acciones.some(a => puede(rol, a)))
}

export function accionesParaModulo(rol: string | null | undefined, modulo: Modulo): Accion[] {
  const cfg = MODULOS.find(m => m.key === modulo)
  if (!cfg) return []
  return cfg.acciones.filter(a => puede(rol, a))
}

export const ROL_LABELS: Record<Rol, string> = {
  ADMIN: 'Administrador',
  CENSADOR: 'Censador',
  OPERADOR_ENTREGAS: 'Operador de Entregas',
  COORDINADOR_LOGISTICA: 'Coordinador de Logística',
  FUNCIONARIO_CONTROL: 'Funcionario de Control',
  REGISTRADOR_DONACIONES: 'Registrador de Donaciones'
}

export const ACCION_LABELS: Record<Accion, string> = {
  'usuarios.crear': 'Crear usuario',
  'usuarios.listar': 'Listar usuarios',
  'usuarios.actualizar': 'Actualizar usuario',
  'familias.crear': 'Registrar familia',
  'familias.listar': 'Consultar familias',
  'personas.crear': 'Registrar persona',
  'ubicaciones.crear': 'Crear ubicación',
  'recursos.crear': 'Crear recurso',
  'recursos.inventario': 'Consultar inventario',
  'donantes.crear': 'Registrar donante',
  'traslados.crear': 'Registrar traslado',
  'entregas.registrar': 'Registrar entrega',
  'entregas.listar': 'Consultar entregas',
  'reportes.ver': 'Ver reportes',
  'planes.listar': 'Listar planes',
  'planes.generar': 'Generar plan',
  'configuracion_puntaje.ver': 'Ver configuración de puntaje',
  'configuracion_puntaje.editar': 'Editar configuración de puntaje',
  'focos.crear': 'Registrar foco sanitario',
  'focos.listar': 'Consultar focos sanitarios',
  'focos.actualizar': 'Actualizar foco sanitario',
  'mapa.ver': 'Ver mapa geográfico',
  'audit_logs.ver': 'Ver registros de auditoría'
}