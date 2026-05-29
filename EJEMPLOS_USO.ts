/**
 * EJEMPLOS DE USO - Servicios API
 * 
 * Este archivo muestra cómo usar los diferentes servicios en componentes Vue
 */

// ============================================
// 1. AUTENTICACIÓN
// ============================================

import { useAuth } from '@/composables/useAuth'

export function loginExample() {
  const { login, logout, usuario, isAuthenticated } = useAuth()

  // Iniciar sesión
  await login('usuario@ejemplo.com', 'contraseña123')

  // Ver datos del usuario
  console.log(usuario.value) // { id_usuario, nombre_completo, correo, rol, ... }

  // Verificar autenticación
  if (isAuthenticated.value) {
    console.log('Usuario autenticado')
  }

  // Cerrar sesión
  logout() // Borra token y redirige a login
}

// ============================================
// 2. FAMILIAS Y PERSONAS
// ============================================

import { familiaService, personaService } from '@/services/familia'
import type { FamiliaCreate, PersonaCreate } from '@/types'

export async function familiaExample() {
  // Listar familias
  const familias = await familiaService.list(0, 50)

  // Crear familia
  const nuevaFamilia = await familiaService.create({
    acepta_privacidad: true,
    id_zona: 1
  })

  // Obtener familia específica
  const familia = await familiaService.get(nuevaFamilia.id_familia)

  // Calcular puntaje de prioridad
  await familiaService.calcularPuntaje(familia.id_familia)
}

export async function personaExample() {
  // Listar todas las personas
  const personas = await personaService.list()

  // Crear persona
  const nuevaPersona = await personaService.create({
    nombre: 'Juan Pérez',
    edad: 35,
    es_cabeza_familia: true,
    id_familia: 1
  })

  // Personas de una familia
  const personasDelFamilia = await personaService.getByFamilia(1)

  // Crear persona dentro de una familia
  const personaEnFamilia = await personaService.createInFamilia(1, {
    nombre: 'María',
    edad: 8,
    es_nino: true
  })
}

// ============================================
// 3. UBICACIONES (ZONAS, REFUGIOS, BODEGAS)
// ============================================

import {
  zonaService,
  refugioService,
  bodegaService,
  recursoService
} from '@/services/ubicaciones'

export async function ubicacionesExample() {
  // ZONAS
  const zonas = await zonaService.list()
  const nuevaZona = await zonaService.create({
    nombre: 'Zona Centro',
    nivel_riesgo: 'alto'
  })

  // REFUGIOS
  const refugios = await refugioService.list()
  const refugio = await refugioService.get(1)
  const nuevoRefugio = await refugioService.create({
    nombre: 'Refugio Principal',
    latitud: 4.7110,
    longitud: -74.0721,
    capacidad_maxima_personas: 100,
    zona_id: 1
  })

  // BODEGAS
  const bodegas = await bodegaService.list()
  const nuevaBodega = await bodegaService.create({
    nombre: 'Bodega 1',
    latitud: 4.7110,
    longitud: -74.0721,
    capacidad_max_kg: 1000,
    zona_id: 1
  })

  // RECURSOS
  const recursos = await recursoService.list()
  const nuevoRecurso = await recursoService.create({
    nombre: 'Arroz',
    categoria: 'ALIMENTOS',
    unidad_medida: 'KG',
    peso_unitario_kg: 1,
    umbral_alerta: 50
  })

  // Actualizar umbral de alerta
  await recursoService.updateUmbralAlerta(1, 100)
}

// ============================================
// 4. ENTREGAS
// ============================================

import {
  entregaService,
  inventarioService,
  focoSanitarioService
} from '@/services/operaciones'

export async function entregasExample() {
  // Registrar entrega
  const entrega = await entregaService.registrar({
    id_familia: 1,
    fecha_efectiva: new Date().toISOString().split('T')[0],
    id_bodega: 1,
    detalles: [
      { id_recurso: 1, cantidad: 10 },
      { id_recurso: 2, cantidad: 5 }
    ]
  })

  // Obtener detalle de entrega
  const detalleEntrega = await entregaService.get(entrega.id_entrega)

  console.log(`Entrega ${detalleEntrega.codigo} registrada`)
}

// ============================================
// 5. INVENTARIO
// ============================================

export async function inventarioExample() {
  // Consultar inventario de todas las bodegas
  const inventarioTotal = await inventarioService.consultar()

  // Consultar inventario de una bodega específica
  const inventarioBodega = await inventarioService.consultar(1)

  // Ver líneas de stock
  inventarioBodega.bodegas.forEach((bodega) => {
    console.log(`Bodega: ${bodega.nombre}`)
    bodega.lineas.forEach((linea) => {
      console.log(`  - ${linea.nombre}: ${linea.cantidad_disponible} ${linea.unidad_medida}`)
    })
  })

  // Obtener alertas de inventario bajo
  const alertas = await inventarioService.obtenerAlertas()
  console.log(`Alertas activas: ${alertas.total}`)
}

// ============================================
// 6. FOCOS SANITARIOS
// ============================================

export async function focosSanitariosExample() {
  // Crear foco sanitario
  const foco = await focoSanitarioService.crear({
    id_zona: 1,
    tipo_vector: 'AGUA_CONTAMINADA',
    nivel_riesgo: 'ALTO',
    acciones_tomadas: 'Se realizó limpieza del área'
  })

  // Listar focos
  const focos = await focoSanitarioService.listar('ACTIVO', 'ALTO', 1)

  // Obtener foco específico
  const detallesFoco = await focoSanitarioService.get(foco.id_foco)

  // Actualizar foco
  await focoSanitarioService.actualizar(foco.id_foco, {
    estado: 'RESUELTO',
    acciones_tomadas: 'Se realizó desinfección completa'
  })

  // Obtener datos en formato GeoJSON para mapas
  const geoJSON = await focoSanitarioService.obtenerGeoJSON(false)
}

// ============================================
// 7. TRASLADOS ENTRE REFUGIOS
// ============================================

import { trasladoService } from '@/services/ubicaciones'

export async function trasladosExample() {
  // Trasladar familia entre refugios
  const traslado = await trasladoService.trasladarFamilia({
    id_familia: 1,
    id_refugio_destino: 2
  })

  console.log(`Familia trasladada de ${traslado.id_refugio_origen} a ${traslado.id_refugio_destino}`)
  console.log(`Personas trasladadas: ${traslado.personas_trasladadas}`)
  console.log(`Ocupación origen: ${traslado.origen.ocupacion_actual}/${traslado.origen.capacidad_maxima}`)
  console.log(`Ocupación destino: ${traslado.destino.ocupacion_actual}/${traslado.destino.capacidad_maxima}`)
}

// ============================================
// 8. USO EN UN COMPONENTE VUE
// ============================================

import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'EjemploComponente',
  setup() {
    const familias = ref([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const loadFamilias = async () => {
      loading.value = true
      error.value = null
      try {
        familias.value = await familiaService.list(0, 100)
      } catch (err: any) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadFamilias()
    })

    return {
      familias,
      loading,
      error,
      loadFamilias
    }
  }
})

// En el template:
// <div v-if="loading">Cargando...</div>
// <div v-if="error" class="error">{{ error }}</div>
// <table v-if="familias.length">
//   <tr v-for="familia in familias" :key="familia.id_familia">
//     <td>{{ familia.codigo_familia }}</td>
//     <td>{{ familia.puntaje_prioridad }}</td>
//   </tr>
// </table>

// ============================================
// 9. MANEJO DE ERRORES
// ============================================

export async function errorHandlingExample() {
  try {
    const familia = await familiaService.get(999) // ID que no existe
  } catch (error: any) {
    // Error de la API (404, 400, etc.)
    if (error.response?.status === 404) {
      console.log('Familia no encontrada')
    } else if (error.response?.status === 401) {
      console.log('No autorizado - redirigir a login')
    } else {
      console.log('Error:', error.response?.data?.detail || error.message)
    }
  }
}

// ============================================
// NOTAS IMPORTANTES
// ============================================

/**
 * 1. Todos los servicios manejan automáticamente el token JWT
 * 2. Usa composables (useAuth) en templates para reactividad
 * 3. Usa servicios directamente en setup() para lógica
 * 4. Los tipos TypeScript garantizan autocomplete en el IDE
 * 5. Las peticiones son asincrónicas - usa async/await
 * 6. El router protege automáticamente rutas con meta: { requiresAuth: true }
 */
