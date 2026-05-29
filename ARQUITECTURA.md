# 📖 Guía de Estructura - Proyecto Frontend

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                      Vue 3 Frontend                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Pages/Views                                   │
│  ┌──────────────┐           ┌──────────────┐                    │
│  │  Login.vue   │           │ Dashboard.vue│                    │
│  └──────────────┘           └──────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Composables                                   │
│              (Estado reactivo y lógica)                          │
│  ┌────────────────────────────────────────────────────┐         │
│  │  useAuth()                                         │         │
│  │  - usuario                                         │         │
│  │  - isAuthenticated                                 │         │
│  │  - login(), logout(), refreshToken()              │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Services                                      │
│        (Lógica de negocio y acceso a datos)                     │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ auth.ts      │  │ familia.ts   │  │ usuarios.ts  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ubicaciones.ts│  │operaciones.ts│                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                 API Client (api.ts)                              │
│         Axios con interceptores automáticos                      │
│         - Agrega Authorization: Bearer token                    │
│         - Configura baseURL                                     │
│         - Maneja errores globales                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│           FastAPI Backend (localhost:8000)                       │
│  POST   /auth/login                                              │
│  POST   /auth/refresh-token                                      │
│  GET    /users/, /familias/, /personas/, ...                    │
│  POST   /entregas/, /focos-sanitarios/, ...                    │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Estructura de Directorios Detallada

```
gestion-beneficiarios-fe/
│
├── src/
│   ├── components/              # Componentes reutilizables
│   │   └── (a crear según necesidad)
│   │
│   ├── composables/             # Composables (lógica reactiva)
│   │   └── useAuth.ts           ✨ Hook de autenticación
│   │
│   ├── services/                # Servicios (lógica de negocio)
│   │   ├── api.ts               🔌 Cliente Axios centralizado
│   │   ├── auth.ts              🔐 Autenticación
│   │   ├── familia.ts           👨‍👩‍👧‍👦 Familias y personas
│   │   ├── usuarios.ts          👥 Gestión de usuarios
│   │   ├── ubicaciones.ts       📍 Zonas, refugios, bodegas
│   │   └── operaciones.ts       📦 Entregas, inventario, focos
│   │
│   ├── types/                   # Interfaces TypeScript
│   │   └── index.ts             📋 Todos los tipos
│   │
│   ├── views/                   # Páginas principales
│   │   ├── Login.vue            🔐 Login
│   │   └── Dashboard.vue        📊 Panel principal
│   │
│   ├── router/
│   │   └── index.ts             🗺️ Rutas y protección
│   │
│   ├── assets/
│   │   └── styles.css           🎨 Estilos globales
│   │
│   ├── App.vue                  🎬 Componente raíz
│   ├── main.ts                  📍 Punto de entrada
│   └── config.ts                ⚙️ Configuración
│
├── .gitignore                   🚫 Archivos ignorados
├── package.json                 📦 Dependencias
├── tsconfig.json                🔧 Config TypeScript
├── vite.config.ts               ⚡ Config Vite
│
├── API_SETUP.md                 📖 Documentación API
├── EJEMPLOS_USO.ts              💡 Ejemplos de código
├── ARQUITECTURA.md              🏗️ Esta. guía
│
└── index.html                   🌐 HTML principal
```

## 🔄 Flujo de Datos - Ejemplo: Login

```
Usuario escribe credenciales
        ↓
    [Login.vue]
        ↓
  useAuth().login()
        ↓
   authService.login()
        ↓
   api.post('/auth/login', data)
        ↓
   Interceptor agrega token
        ↓
   FastAPI
        ↓
   Retorna { access_token, usuario }
        ↓
   Guarda en localStorage
        ↓
   Router navega a /dashboard
        ↓
   Dashboard.vue accede a usuario()
```

## 🔐 Protección de Rutas

```typescript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  
  if (to.meta?.requiresAuth && !token) {
    // Ruta protegida sin token
    return { path: '/' }  // Redirige a login
  }
})
```

## 📡 Patrón: Service + Composable

### Setup Mínimo (Login)
```
┌──────────────┐
│  Login.vue   │
└──────┬───────┘
       │ useAuth()
       ↓
┌──────────────────┐
│  useAuth.ts      │
└──────┬───────────┘
       │ calls
       ↓
┌──────────────────┐
│  authService     │
└──────┬───────────┘
       │ calls
       ↓
┌──────────────────┐
│  api.post()      │
└──────────────────┘
```

### Setup Avanzado (Listar Familias)
```
┌─────────────────────────┐
│    Componente.vue       │
│  familias.value         │
│  loading.value          │
└──────────┬──────────────┘
           │
      ↙────┴────┐
     │          │ 
┌────▼──────┐   │    ┌─────────────────┐
│onMounted()│   └───→│familiaService   │
└────┬──────┘        │.list()          │
     │               └────────┬────────┘
     │                        │
     │                 ┌──────▼──────┐
     │                 │  api.get()  │
     │                 └──────┬──────┘
     │                        │
     └────────────────────────┴──→ actualizaReactividad
```

## 🎯 Flujo Típico de Componente

```typescript
// 1. Imports
import { defineComponent, ref, onMounted } from 'vue'
import { familiaService } from '@/services/familia'
import { useAuth } from '@/composables/useAuth'

// 2. Componente
export default defineComponent({
  name: 'MisComponente',
  
  // 3. Setup
  setup() {
    // Estado reactivo
    const familias = ref([])
    const loading = ref(false)
    const { usuario } = useAuth()  // Acceso a autenticado
    
    // Funciones
    const loadFamilias = async () => {
      loading.value = true
      try {
        familias.value = await familiaService.list()
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // Ejecutar al montar
    onMounted(() => loadFamilias())
    
    // Exportar
    return { familias, loading, usuario }
  }
})
```

## 🔗 Conexiones Clave

### 1. Auth ↔ Router
```
Componente checa: isAuthenticated
        ↓
useAuth() devuelve estado
        ↓
router.beforeEach() protege rutas
        ↓
Redirige a login si no hay token
```

### 2. Services ↔ API Client
```
familiaService.list()
        ↓
api.get('/familias/')
        ↓
Interceptor agrega token
        ↓
Devuelve resultado tipado
```

### 3. Componente ↔ Composable
```
<template>
  {{ usuario?.nombre }}
</template>

setup() {
  const { usuario } = useAuth()
  return { usuario }
}
```

## 💡 Patrones Usados

### 1. **Singleton Pattern** (Servicios)
```typescript
export const familiaService = new FamiliaService()
// La misma instancia siempre
```

### 2. **Interceptor Pattern** (API)
```typescript
api.interceptors.request.use((config) => {
  // Modifica cada petición
})
```

### 3. **Composable Pattern** (Estado)
```typescript
export function useAuth() {
  // Lógica reactiva
  return { usuario, login, logout, ... }
}
```

### 4. **Service Locator** (Inyección)
```typescript
const { familiaService } = setup()
// Via import directo
```

## 🚀 Inicialización

### 1. main.ts
```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css'

createApp(App)
  .use(router)
  .mount('#app')
```

### 2. App.vue
```vue
<template>
  <router-view />
</template>
```

### 3. router/index.ts
```typescript
const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
]

router.beforeEach((to) => {
  const token = localStorage.getItem('access_token')
  if (to.meta?.requiresAuth && !token) return '/'
})
```

## 🎨 Estilos

- **Scoped CSS** en componentes
- **Tailwind/Utility** minimalista en clases
- **BEM Convention** para nombres
- **CSS Variables** para temas (opcional)

## 🔍 TypeScript

- **Interface** para cada modelo
- **Type** para uniones (roles, estados)
- **Generics** en métodos API
- **Strict Mode** habilitado

```typescript
// ✅ Correcto
const familias: Familia[] = await familiaService.list()
const usuario: Usuario | null = authService.getUser()

// ❌ Evitar
const familias = await familiaService.list() // any
const response: any = await api.get() // any
```

## 📊 Dependencias Clave

```json
{
  "vue": "^3.5.35",
  "vue-router": "^4.6.4",
  "axios": "^1.16.1",
  "typescript": "^5.2.2"
}
```

## 🧪 Testing (Futuro)

```
__tests__/
├── unit/
│   ├── services/
│   ├── composables/
│   └── components/
└── e2e/
    └── auth.spec.ts
```

## 📚 Recursos

- [Vue 3 API](https://vuejs.org/api/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Última actualización:** 29 de mayo de 2026
