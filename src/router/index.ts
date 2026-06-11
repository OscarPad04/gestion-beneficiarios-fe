import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import DashboardLayout from '../views/DashboardLayout.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardInicio',
        component: () => import('../views/dashboard/Inicio.vue')
      },
      {
        path: 'usuarios',
        name: 'DashboardUsuarios',
        component: () => import('../views/dashboard/Usuarios.vue')
      },
      {
        path: 'familias',
        name: 'DashboardFamilias',
        component: () => import('../views/dashboard/Familias.vue')
      },
      {
        path: 'personas',
        name: 'DashboardPersonas',
        component: () => import('../views/dashboard/Personas.vue')
      },
      {
        path: 'ubicaciones',
        name: 'DashboardUbicaciones',
        component: () => import('../views/dashboard/Ubicaciones.vue')
      },
      {
        path: 'recursos',
        name: 'DashboardRecursos',
        component: () => import('../views/dashboard/Recursos.vue')
      },
      {
        path: 'traslados-refugios',
        name: 'DashboardTrasladosRefugios',
        component: () => import('../views/dashboard/TrasladosRefugios.vue')
      },
      {
        path: 'donantes',
        name: 'DashboardDonantes',
        component: () => import('../views/dashboard/Donantes.vue')
      },
      {
        path: 'entregas',
        name: 'DashboardEntregas',
        component: () => import('../views/dashboard/Entregas.vue')
      },
      {
        path: 'sandbox',
        name: 'DashboardSandbox',
        component: () => import('../views/dashboard/EstadosSandbox.vue')
      },
      {
        path: 'reportes',
        name: 'DashboardReportes',
        component: () => import('../views/dashboard/Reportes.vue')
      },
      {
        path: 'planes-distribucion',
        name: 'DashboardPlanesDistribucion',
        component: () => import('../views/dashboard/PlanesDistribucion.vue')
      },
      {
        path: 'configuracion-puntaje',
        name: 'DashboardConfiguracionPuntaje',
        component: () => import('../views/dashboard/ConfiguracionPuntaje.vue')
      },
      {
        path: 'focos-sanitarios',
        name: 'DashboardFocosSanitarios',
        component: () => import('../views/dashboard/FocosSanitarios.vue')
      },
      {
        path: 'mapa',
        name: 'DashboardMapa',
        component: () => import('../views/dashboard/Mapa.vue')
      },
      {
        path: 'audit-logs',
        name: 'DashboardAuditLogs',
        component: () => import('../views/dashboard/AuditLogs.vue')
      }
    ] 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('access_token')
  if ((to as any).meta?.requiresAuth && !token) return { path: '/' }
})

export default router
