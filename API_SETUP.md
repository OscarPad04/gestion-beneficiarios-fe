# Proyecto: Gestión de Beneficiarios - Frontend Vue

Sistema frontend Vue 3 para gestionar beneficiarios, conectado a API FastAPI en `localhost:8000`.

## ✨ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── composables/         # Composables (useAuth, etc.)
├── services/           # Servicios (autenticación, API, etc.)
│   ├── api.ts         # Cliente Axios centralizado
│   ├── auth.ts        # Servicio de autenticación
│   ├── familia.ts     # Familias y personas
│   ├── ubicaciones.ts # Zonas, refugios, bodegas
│   └── operaciones.ts # Entregas, inventario, focos, etc.
├── types/             # Interfaces TypeScript
│   └── index.ts       # Todos los tipos
├── views/
│   ├── Login.vue      # Pantalla de login
│   └── Dashboard.vue  # Panel principal
├── router/            # Configuración de rutas
├── config.ts          # Configuración (URL API, etc.)
└── main.ts            # Punto de entrada
```

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
# o
pnpm install
```

### 2. Configurar servidor API

Asegúrate de que tu API esté corriendo en `http://localhost:8000`

La URL se configura en [src/config.ts](src/config.ts):

```typescript
export const BASE_URL: string = 'http://localhost:8000'
```

### 3. Ejecutar servidor de desarrollo

```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173` (o ver en terminal)

### 4. Build para producción

```bash
npm run build
pnpm build
```

## 🔐 Autenticación

### Login

Los usuarios se autentican con:
- **Email**: correo del usuario
- **Contraseña**: contraseña del usuario

El token JWT se almacena en `localStorage` y se incluye automáticamente en todas las peticiones.

Endpoints:
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh-token` - Refrescar token

### Uso en componentes

```typescript
import { useAuth } from '@/composables/useAuth'

export default {
  setup() {
    const { usuario, login, logout, isAuthenticated } = useAuth()
    
    const handleLogin = async () => {
      await login('correo@ejemplo.com', 'contraseña')
    }

    return { usuario, login, logout, isAuthenticated, handleLogin }
  }
}
```

## 📦 Servicios Disponibles

### Auth Service
```typescript
import { authService } from '@/services/auth'

await authService.login(correo, password)
authService.logout()
authService.getToken()
authService.getUser()
```

### Familia Service
```typescript
import { familiaService } from '@/services/familia'

await familiaService.list()
await familiaService.get(id)
await familiaService.create(data)
```

### Ubicaciones Service
```typescript
import { zonaService, refugioService, bodegaService } from '@/services/ubicaciones'

// Zonas
await zonaService.list()
await zonaService.create(data)

// Refugios
await refugioService.list()
await refugioService.get(id)

// Bodegas
await bodegaService.list()
await bodegaService.create(data)
```

### Operaciones Service
```typescript
import { 
  entregaService, 
  inventarioService, 
  focoSanitarioService 
} from '@/services/operaciones'

// Entregas
await entregaService.registrar(data)
await entregaService.get(id)

// Inventario
await inventarioService.consultar(idBodega)
await inventarioService.obtenerAlertas()

// Focos Sanitarios
await focoSanitarioService.crear(data)
await focoSanitarioService.listar()
```

## 🏗️ Arquitectura API

El interceptor de Axios en [src/services/api.ts](src/services/api.ts):
- Agrega automáticamente el token JWT a cada petición
- Configura la URL base
- Maneja errores globalmente

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers = { 
      ...config.headers, 
      Authorization: `Bearer ${token}` 
    }
  }
  return config
})
```

## 📋 Endpoints Disponibles

### Autenticación
- `POST /auth/login` - Login
- `POST /auth/refresh-token` - Refrescar token

### Usuarios
- `GET /users/` - Listar usuarios
- `POST /users/` - Crear usuario
- `GET /users/{user_id}` - Obtener usuario
- `PUT /users/{user_id}` - Actualizar usuario
- `DELETE /users/{user_id}` - Desactivar usuario

### Familias
- `GET /familias/` - Listar familias
- `POST /familias/` - Crear familia
- `GET /familias/{familia_id}` - Obtener familia

### Personas
- `GET /personas/` - Listar personas
- `POST /personas/` - Crear persona
- `GET /personas/{persona_id}` - Obtener persona
- `PUT /personas/{persona_id}` - Actualizar persona
- `GET /personas/familias/{familia_id}/personas` - Personas de una familia

### Zonas
- `GET /zonas/` - Listar zonas
- `POST /zonas/` - Crear zona
- `GET /zonas/{zona_id}` - Obtener zona

### Refugios
- `GET /refugios/` - Listar refugios
- `POST /refugios/` - Crear refugio
- `GET /refugios/{refugio_id}` - Obtener refugio

### Bodegas
- `GET /bodegas/` - Listar bodegas
- `POST /bodegas/` - Crear bodega
- `GET /bodegas/{bodega_id}` - Obtener bodega

### Entregas
- `POST /entregas/` - Registrar entrega
- `GET /entregas/{id_entrega}` - Obtener entrega

### Inventario
- `GET /inventario/` - Consultar inventario
- `GET /inventario/alertas` - Obtener alertas

### Focos Sanitarios
- `GET /focos-sanitarios/` - Listar focos
- `POST /focos-sanitarios/` - Crear foco
- `PATCH /focos-sanitarios/{foco_id}` - Actualizar foco
- `GET /focos-sanitarios/mapa` - Obtener GeoJSON

## 🛡️ Protección de Rutas

El router automáticamente protege rutas que requieren autenticación:

```typescript
// En router/index.ts
const routes = [
  { path: '/', name: 'Login', component: Login },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true }  // ← Ruta protegida
  }
]

router.beforeEach((to) => {
  const token = localStorage.getItem('access_token')
  if (to.meta?.requiresAuth && !token) {
    return { path: '/' }  // Redirige a login
  }
})
```

## 📝 Tipos TypeScript

Todos los tipos están definidos en [src/types/index.ts](src/types/index.ts):

```typescript
// Usuario
interface Usuario {
  id_usuario: number
  nombre_completo: string
  correo: string
  rol: UserRole
  activo: boolean
}

// Familia
interface Familia {
  id_familia: number
  codigo_familia: string
  acepta_privacidad: boolean
  puntaje_prioridad: number
}

// Entrega
interface Entrega {
  id_entrega: number
  codigo: string
  estado: EstadoEntrega
  fecha_efectiva: string
  detalles: DetalleEntregaResponse[]
}

// ... y más tipos
```

## 🔄 Flujo de Peticiones

```
Componente Vue
    ↓
Composable (useAuth, etc.)
    ↓
Servicio (familiaService, etc.)
    ↓
Cliente API (api.ts)
    ↓
Interceptor (Agrega token)
    ↓
FastAPI Backend
```

## 🛠️ Desarrollo

### Agregar un nuevo endpoint

1. **Agregar tipo en** `src/types/index.ts`
2. **Crear servicio en** `src/services/` (o usar existente)
3. **Usar en componente** con composables o directamente del servicio

Ejemplo:
```typescript
// services/ejemplo.ts
export class EjemploService {
  async crearAlgo(data: CreateAlgo): Promise<Algo> {
    const response = await api.post<Algo>('/algo/', data)
    return response.data
  }
}

// En componente
import { ejemploService } from '@/services/ejemplo'

const resultado = await ejemploService.crearAlgo(data)
```

## 📚 Recursos

- [Vue 3 Docs](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [FastAPI Docs](http://localhost:8000/docs) - (cuando esté corriendo el backend)

## ⚠️ IMPORTANTE

La API debe estar ejecutándose en `localhost:8000` para que el frontend funcione correctamente. Puedes probar los endpoints en el dashboard con los botones de prueba.

