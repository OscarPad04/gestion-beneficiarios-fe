<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmpty
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, Users, Search } from 'lucide-vue-next'
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

const router = useRouter()
const familias = ref<any[]>([])
const zonas = ref<any[]>([])
const isLoading = ref<boolean>(true)
const isCreating = ref<boolean>(false)
const error = ref<string>('')
const sheetOpen = ref<boolean>(false)
const searchQuery = ref<string>('')

// Formulario reactivo para crear familia
const newFamilia = ref({
  id_zona: '' as string | number,
  acepta_privacidad: false
})

// Fetch Data
const fetchData = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const [familiasRes, zonasRes] = await Promise.all([
      api.get('/familias/'),
      api.get('/zonas/')
    ])
    familias.value = familiasRes.data
    zonas.value = zonasRes.data
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Error al cargar las familias y zonas'
  } finally {
    isLoading.value = false
  }
}

// Búsqueda rápida
const filteredFamilias = computed(() => {
  if (!searchQuery.value) return familias.value
  const query = searchQuery.value.toLowerCase()
  return familias.value.filter(f => 
    (f.codigo_familia && f.codigo_familia.toLowerCase().includes(query)) ||
    (f.id_familia && f.id_familia.toString().includes(query))
  )
})

// Obtener nombre de zona por ID
const getZonaName = (zonaId: number) => {
  const zona = zonas.value.find(z => z.id_zona === zonaId)
  return zona ? zona.nombre : 'Desconocida'
}

// Crear familia
const handleCreateFamilia = async () => {
  if (!newFamilia.value.id_zona) return
  
  isCreating.value = true
  try {
    await api.post('/familias/', {
      id_zona: Number(newFamilia.value.id_zona),
      acepta_privacidad: newFamilia.value.acepta_privacidad
    })
    
    // Reset formulario y cerrar panel
    newFamilia.value = { id_zona: '', acepta_privacidad: false }
    sheetOpen.value = false
    
    // Recargar tabla
    await fetchData()
  } catch (err: any) {
    console.error("Error creating familia:", err)
    alert(err.response?.data?.detail || 'Error al registrar la familia')
  } finally {
    isCreating.value = false
  }
}

// Ver Detalle (Placeholder para redireccionar luego)
const viewDetalle = (idFamilia: number) => {
  router.push(`/dashboard/familias/${idFamilia}`)
}

onMounted(() => {
  fetchData()
})

const formatearFecha = (fecha: string) => {
  if (!fecha) return 'N/A'
  return new Date(fecha).toLocaleDateString()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Familias</h1>
        <p class="text-gray-500 mt-1">Gestión de familias beneficiarias e integrantes.</p>
      </div>

      <Sheet v-model:open="sheetOpen">
        <SheetTrigger as-child>
          <Button class="bg-blue-600 hover:bg-blue-700">
            <Plus class="w-4 h-4 mr-2" /> Registrar Familia
          </Button>
        </SheetTrigger>
        <SheetContent class="sm:max-w-[450px]">
          <SheetHeader>
            <SheetTitle>Registrar Nueva Familia</SheetTitle>
            <SheetDescription>
              Abre un nuevo registro familiar vinculándolo a una zona geográfica determinada. 
            </SheetDescription>
          </SheetHeader>
          
          <form @submit.prevent="handleCreateFamilia" class="mt-6 flex flex-col gap-5">
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Zona Geográfica *</label>
              <Select v-model="newFamilia.id_zona" required :disabled="isCreating || zonas.length === 0">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la zona de residencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="zona in zonas" :key="zona.id_zona" :value="zona.id_zona.toString()">
                      {{ zona.nombre }} (Riesgo: {{ zona.nivel_riesgo }})
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <input type="checkbox" id="privacidad" v-model="newFamilia.acepta_privacidad" :disabled="isCreating" class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
              <label for="privacidad" class="text-sm font-medium leading-none text-gray-700">
                Acepta políticas de privacidad y protección de datos.
              </label>
            </div>

            <div class="mt-4 flex justify-end gap-3">
              <Button type="submit" class="w-full" :disabled="isCreating || !newFamilia.id_zona">
                <Loader2 v-if="isCreating" class="w-4 h-4 mr-2 animate-spin" />
                Abrir Registro Familiar
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Buscador -->
    <div class="relative w-full max-w-sm">
      <Search class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Buscar por código de familia..." v-model="searchQuery" class="pl-9 bg-white" />
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="flex flex-col items-center justify-center p-12 text-gray-400">
      <Loader2 class="w-8 h-8 animate-spin text-blue-500 mb-4" />
      <p>Cargando registros...</p>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white border rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow class="bg-gray-50/50">
            <TableHead class="w-[50px]"></TableHead>
            <TableHead>Código Familia</TableHead>
            <TableHead>Zona Geográfica</TableHead>
            <TableHead>Fecha de Registro</TableHead>
            <TableHead>Acepta Privacidad</TableHead>
            <TableHead class="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="f in filteredFamilias" :key="f.id_familia" class="hover:bg-gray-50">
            <TableCell>
              <Users class="w-6 h-6 text-gray-400" />
            </TableCell>
            <TableCell class="font-medium text-gray-900">{{ f.codigo_familia || `FAM-${f.id_familia}` }}</TableCell>
            <TableCell>
               <Badge variant="outline" class="bg-blue-50">{{ getZonaName(f.id_zona) }}</Badge>
            </TableCell>
            <TableCell class="text-muted-foreground">{{ formatearFecha(f.fecha_registro) }}</TableCell>
            <TableCell>
              <Badge :variant="f.acepta_privacidad ? 'default' : 'secondary'" :class="f.acepta_privacidad ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' : ''">
                {{ f.acepta_privacidad ? 'Sí' : 'No' }}
              </Badge>
            </TableCell>
            <TableCell class="text-right">
              <Button variant="outline" size="sm" @click="viewDetalle(f.id_familia)">
                Gestionar Integrantes
              </Button>
            </TableCell>
          </TableRow>
          <TableEmpty v-if="filteredFamilias.length === 0" class="py-10 text-gray-500">
            No se encontraron familias registradas.
          </TableEmpty>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
