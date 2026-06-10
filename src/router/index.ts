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
        path: 'donantes',
        name: 'DashboardDonantes',
        component: () => import('../views/dashboard/Donantes.vue')
      },
      {
        path: 'entregas',
        name: 'DashboardEntregas',
        component: () => import('../views/dashboard/Entregas.vue')
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