<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../services/api'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, UserCircle } from 'lucide-vue-next'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const usuarios = ref<any[]>([])
const isLoading = ref<boolean>(true)
const isCreating = ref<boolean>(false)
const error = ref<string>('')
const sheetOpen = ref<boolean>(false)

// Formulario reactivo para crear usuario
const newUser = ref({
  nombre_completo: '',
  correo: '',
  password: '',
  rol: ''
})

const ROLES = [
  'ADMIN',
  'COORDINADOR_LOGISTICA',
  'OPERADOR_ENTREGAS',
  'REGISTRADOR_DONACIONES'
]

// Fetch usuarios
const fetchUsuarios = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const res = await api.get('/users/')
    usuarios.value = res.data
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Error al cargar usuarios'
  } finally {
    isLoading.value = false
  }
}

// Crear usuario
const handleCreateUser = async () => {
  if (!newUser.value.nombre_completo || !newUser.value.correo || !newUser.value.password || !newUser.value.rol) {
    return
  }
  isCreating.value = true
  try {
    await api.post('/users/', newUser.value)
    
    // Reset formulario
    newUser.value = { nombre_completo: '', correo: '', password: '', rol: '' }
    sheetOpen.value = false // Cerrar el panel lateral
    
    // Recargar tabla
    await fetchUsuarios()
  } catch (err: any) {
    console.error("Error creating user:", err)
    alert(err.response?.data?.detail || 'Error al crear usuario')
  } finally {
    isCreating.value = false
  }
}

onMounted(() => {
  fetchUsuarios()
})

const getRoleBadgeVariant = (rol: string) => {
  if (rol === 'ADMIN') return 'destructive'
  if (rol === 'COORDINADOR_LOGISTICA') return 'default'
  if (rol === 'REGISTRADOR_DONACIONES') return 'secondary'
  return 'outline'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Gestión de Usuarios</h1>
        <p class="text-gray-500 mt-1">Administra los accesos y roles del sistema.</p>
      </div>

      <Sheet v-model:open="sheetOpen">
        <SheetTrigger as-child>
          <Button class="bg-blue-600 hover:bg-blue-700">
            <Plus class="w-4 h-4 mr-2" /> Nuevo Usuario
          </Button>
        </SheetTrigger>
        <SheetContent class="sm:max-w-[450px]">
          <SheetHeader>
            <SheetTitle>Crear Usuario</SheetTitle>
            <SheetDescription>
              Añade un nuevo miembro al equipo. Selecciona cuidadosamente sus permisos.
            </SheetDescription>
          </SheetHeader>
          
          <form @submit.prevent="handleCreateUser" class="mt-6 flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Nombre completo</label>
              <Input v-model="newUser.nombre_completo" placeholder="Ej. Juan Pérez" required :disabled="isCreating"/>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Correo electrónico</label>
              <Input type="email" v-model="newUser.correo" placeholder="juan@ejemplo.com" required :disabled="isCreating"/>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Contraseña temporal</label>
              <Input type="password" v-model="newUser.password" placeholder="Mínimo 8 caracteres" required minlength="8" :disabled="isCreating"/>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Rol del sistema</label>
              <Select v-model="newUser.rol" required :disabled="isCreating">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="rol in ROLES" :key="rol" :value="rol">
                      {{ rol.replace('_', ' ') }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <Button type="submit" class="w-full" :disabled="isCreating">
                <Loader2 v-if="isCreating" class="w-4 h-4 mr-2 animate-spin" />
                Guardar Usuario
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="flex flex-col items-center justify-center p-12 text-gray-400">
      <Loader2 class="w-8 h-8 animate-spin text-blue-500 mb-4" />
      <p>Cargando usuarios...</p>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white border rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow class="bg-gray-50/50">
            <TableHead class="w-[50px]"></TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead class="text-right">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="u in usuarios" :key="u.id_usuario" class="hover:bg-gray-50">
            <TableCell>
              <UserCircle class="w-8 h-8 text-gray-300" />
            </TableCell>
            <TableCell class="font-medium text-gray-900">{{ u.nombre_completo }}</TableCell>
            <TableCell class="text-muted-foreground">{{ u.correo }}</TableCell>
            <TableCell>
              <Badge :variant="getRoleBadgeVariant(u.rol)">
                {{ u.rol.replace('_', ' ') }}
              </Badge>
            </TableCell>
            <TableCell class="text-right">
              <Badge :variant="u.activo ? 'default' : 'secondary'" :class="u.activo ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' : ''">
                {{ u.activo ? 'Activo' : 'Inactivo' }}
              </Badge>
            </TableCell>
          </TableRow>
          <TableEmpty v-if="usuarios.length === 0" class="py-10 text-gray-500">
            No se encontraron usuarios registrados.
          </TableEmpty>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
