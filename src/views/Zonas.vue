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
  TableEmpty
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, MapPin } from 'lucide-vue-next'
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

const zonas = ref<any[]>([])
const isLoading = ref<boolean>(true)
const isCreating = ref<boolean>(false)
const error = ref<string>('')
const sheetOpen = ref<boolean>(false)

// Formulario reactivo para crear zona
const newZona = ref({
  nombre: '',
  nivel_riesgo: ''
})

const NIVELES_RIESGO = [
  { value: 'bajo', label: 'Bajo' },
  { value: 'medio', label: 'Medio' },
  { value: 'alto', label: 'Alto' }
]

// Fetch zonas
const fetchZonas = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const res = await api.get('/zonas/')
    zonas.value = res.data
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Error al cargar las zonas geográficas'
  } finally {
    isLoading.value = false
  }
}

// Crear zona
const handleCreateZona = async () => {
  if (!newZona.value.nombre || !newZona.value.nivel_riesgo) {
    return
  }
  isCreating.value = true
  try {
    await api.post('/zonas/', newZona.value)
    
    // Reset formulario
    newZona.value = { nombre: '', nivel_riesgo: '' }
    sheetOpen.value = false // Cerrar el panel
    
    // Recargar tabla
    await fetchZonas()
  } catch (err: any) {
    console.error("Error creating zona:", err)
    alert(err.response?.data?.detail || 'Error al crear la zona geográfica')
  } finally {
    isCreating.value = false
  }
}

onMounted(() => {
  fetchZonas()
})

const getRiesgoBadgeVariant = (nivel: string) => {
  const n = nivel.toLowerCase()
  if (n === 'alto') return 'destructive'
  if (n === 'medio') return 'secondary'
  return 'default' // Bajo o desconocido
}

const getRiesgoBadgeClass = (nivel: string) => {
  const n = nivel.toLowerCase()
  if (n === 'bajo') return 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200'
  if (n === 'medio') return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200'
  return ''
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Zonas Geográficas</h1>
        <p class="text-gray-500 mt-1">Administra las zonas de intervención y sus niveles de riesgo.</p>
      </div>

      <Sheet v-model:open="sheetOpen">
        <SheetTrigger as-child>
          <Button class="bg-blue-600 hover:bg-blue-700">
            <Plus class="w-4 h-4 mr-2" /> Nueva Zona
          </Button>
        </SheetTrigger>
        <SheetContent class="sm:max-w-[450px]">
          <SheetHeader>
            <SheetTitle>Registrar Zona</SheetTitle>
            <SheetDescription>
              Crea una nueva zona geográfica para agrupar luego a las familias beneficiadas.
            </SheetDescription>
          </SheetHeader>
          
          <form @submit.prevent="handleCreateZona" class="mt-6 flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Nombre de la Zona / Barrio</label>
              <Input v-model="newZona.nombre" placeholder="Ej. Barrio La Esperanza" required :disabled="isCreating"/>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Nivel de Riesgo</label>
              <Select v-model="newZona.nivel_riesgo" required :disabled="isCreating">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el riesgo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="riesgo in NIVELES_RIESGO" :key="riesgo.value" :value="riesgo.value">
                      {{ riesgo.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <Button type="submit" class="w-full" :disabled="isCreating">
                <Loader2 v-if="isCreating" class="w-4 h-4 mr-2 animate-spin" />
                Guardar Zona
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
      <p>Cargando zonas...</p>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white border rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow class="bg-gray-50/50">
            <TableHead class="w-[50px]"></TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead class="text-right">Nivel de Riesgo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="z in zonas" :key="z.id_zona" class="hover:bg-gray-50">
            <TableCell>
              <MapPin class="w-6 h-6 text-gray-400" />
            </TableCell>
            <TableCell class="font-medium text-gray-900">{{ z.nombre }}</TableCell>
            <TableCell class="text-right">
              <Badge :variant="getRiesgoBadgeVariant(z.nivel_riesgo)" :class="getRiesgoBadgeClass(z.nivel_riesgo)">
                {{ z.nivel_riesgo.toUpperCase() }}
              </Badge>
            </TableCell>
          </TableRow>
          <TableEmpty v-if="zonas.length === 0" class="py-10 text-gray-500">
            No se encontraron zonas registradas.
          </TableEmpty>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
