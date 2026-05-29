<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { Loader2, Plus, ArrowLeft, UserIcon } from 'lucide-vue-next'
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

const route = useRoute()
const router = useRouter()
const familiaId = route.params.id

const personas = ref<any[]>([])
const isLoading = ref<boolean>(true)
const isCreating = ref<boolean>(false)
const error = ref<string>('')
const sheetOpen = ref<boolean>(false)

// Formulario reactivo para crear persona
const newPersona = ref({
  nombre: '',
  edad: null as number | null,
  tipo_documento: 'CC',
  numero_documento: '',
  es_nino: false,
  es_anciano: false,
  es_embarazada: false,
  tiene_discapacidad: false,
  tiene_enfermedad_cronica: false,
  es_cabeza_familia: false
})

const TIPOS_DOCUMENTO = ['CC', 'TI', 'CE', 'RC', 'PASAPORTE', 'OTRO']

// Fetch integrantes
const fetchPersonas = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const res = await api.get(`/personas/familias/${familiaId}/personas`)
    personas.value = res.data
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Error al cargar los integrantes de la familia'
  } finally {
    isLoading.value = false
  }
}

// Crear persona
const handleAddPersona = async () => {
  if (!newPersona.value.nombre || !newPersona.value.edad || !newPersona.value.numero_documento) return
  
  isCreating.value = true
  try {
    await api.post(`/personas/familias/${familiaId}/personas`, {
      nombre: newPersona.value.nombre,
      edad: Number(newPersona.value.edad),
      tipo_documento: newPersona.value.tipo_documento,
      numero_documento: newPersona.value.numero_documento,
      es_nino: newPersona.value.es_nino,
      es_anciano: newPersona.value.es_anciano,
      es_embarazada: newPersona.value.es_embarazada,
      tiene_discapacidad: newPersona.value.tiene_discapacidad,
      tiene_enfermedad_cronica: newPersona.value.tiene_enfermedad_cronica,
      es_cabeza_familia: newPersona.value.es_cabeza_familia
    })
    
    // Reset formulario
    newPersona.value = {
      nombre: '',
      edad: null,
      tipo_documento: 'CC',
      numero_documento: '',
      es_nino: false,
      es_anciano: false,
      es_embarazada: false,
      tiene_discapacidad: false,
      tiene_enfermedad_cronica: false,
      es_cabeza_familia: false
    }
    sheetOpen.value = false
    
    // Recargar
    await fetchPersonas()
  } catch (err: any) {
    console.error("Error adding persona:", err)
    alert(err.response?.data?.detail || 'Error al agregar al integrante.')
  } finally {
    isCreating.value = false
  }
}

onMounted(() => {
  fetchPersonas()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Encabezado con botón de volver -->
    <div class="flex items-center gap-4">
      <Button variant="outline" size="icon" @click="router.push('/dashboard/familias')">
        <ArrowLeft class="w-4 h-4 text-gray-700" />
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Integrantes Familia #{{ familiaId }}</h1>
        <p class="text-gray-500 mt-1">Administra los miembros verificados de este núcleo familiar.</p>
      </div>
    </div>

    <div class="flex justify-end">
      <Sheet v-model:open="sheetOpen">
        <SheetTrigger as-child>
          <Button class="bg-blue-600 hover:bg-blue-700">
            <Plus class="w-4 h-4 mr-2" /> Agregar Persona
          </Button>
        </SheetTrigger>
        <SheetContent class="sm:max-w-[450px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Registrar Integrante</SheetTitle>
            <SheetDescription>
              Añade una nueva persona al núcleo familiar #{{ familiaId }}.
            </SheetDescription>
          </SheetHeader>
          
          <form @submit.prevent="handleAddPersona" class="mt-6 flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Nombre Completo *</label>
              <Input v-model="newPersona.nombre" required :disabled="isCreating"/>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700">Tipo Doc. *</label>
                <Select v-model="newPersona.tipo_documento" required :disabled="isCreating">
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="tipo in TIPOS_DOCUMENTO" :key="tipo" :value="tipo">
                        {{ tipo }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700">No. Documento *</label>
                <Input v-model="newPersona.numero_documento" required :disabled="isCreating"/>
              </div>
            </div>

            <div class="flex flex-col gap-2 relative">
              <label class="text-sm font-semibold text-gray-700">Edad *</label>
              <Input type="number" min="0" max="150" v-model="newPersona.edad" required :disabled="isCreating"/>
            </div>

            <div class="border-t border-gray-200 mt-2 mb-2"></div>
            <h4 class="text-sm font-bold text-gray-900">Condiciones Específicas</h4>
            
            <!-- Checkboxes Estilizados en grid -->
            <div class="grid grid-cols-2 gap-3 mt-2">
              <label class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" v-model="newPersona.es_cabeza_familia" class="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300" :disabled="isCreating" />
                <span>Cabeza de Familia</span>
              </label>

              <label class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" v-model="newPersona.es_nino" class="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300" :disabled="isCreating" />
                <span>Es Niño</span>
              </label>

              <label class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" v-model="newPersona.es_anciano" class="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300" :disabled="isCreating" />
                <span>Es Anciano</span>
              </label>

              <label class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" v-model="newPersona.es_embarazada" class="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300" :disabled="isCreating" />
                <span>Embarazada</span>
              </label>

              <label class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer col-span-2">
                <input type="checkbox" v-model="newPersona.tiene_discapacidad" class="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300" :disabled="isCreating" />
                <span>Tiene Discapacidad</span>
              </label>

              <label class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer col-span-2">
                <input type="checkbox" v-model="newPersona.tiene_enfermedad_cronica" class="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300" :disabled="isCreating" />
                <span>Enfermedad Crónica</span>
              </label>
            </div>

            <div class="mt-6 flex justify-end gap-3 pb-8">
              <Button type="submit" class="w-full" :disabled="isCreating">
                <Loader2 v-if="isCreating" class="w-4 h-4 mr-2 animate-spin" />
                Guardar Integrante
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
      <p>Cargando integrantes...</p>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white border rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow class="bg-gray-50/50">
            <TableHead class="w-[50px]"></TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Identificación</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Condiciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="p in personas" :key="p.id_persona" class="hover:bg-gray-50">
            <TableCell>
              <UserIcon class="w-5 h-5 text-gray-400" />
            </TableCell>
            <TableCell class="font-medium text-gray-900">
              {{ p.nombre }}
              <Badge v-if="p.es_cabeza_familia" variant="secondary" class="ml-2 bg-blue-100 text-blue-700">Cabeza</Badge>
            </TableCell>
            <TableCell class="text-muted-foreground">{{ p.tipo_documento }} {{ p.numero_documento }}</TableCell>
            <TableCell>{{ p.edad }} años</TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-1">
                <Badge v-if="p.es_nino" variant="outline" class="text-xs">Niño</Badge>
                <Badge v-if="p.es_anciano" variant="outline" class="text-xs">Anciano</Badge>
                <Badge v-if="p.es_embarazada" variant="outline" class="text-xs">Embarazada</Badge>
                <Badge v-if="p.tiene_discapacidad" variant="destructive" class="text-xs">Discapacidad</Badge>
                <Badge v-if="p.tiene_enfermedad_cronica" variant="destructive" class="text-xs">E. Crónica</Badge>
                <span v-if="!p.es_nino && !p.es_anciano && !p.es_embarazada && !p.tiene_discapacidad && !p.tiene_enfermedad_cronica" class="text-sm text-gray-400">
                  Ninguna
                </span>
              </div>
            </TableCell>
          </TableRow>
          <TableEmpty v-if="personas.length === 0" class="py-10 text-gray-500">
            No hay integrantes registrados en esta familia.
          </TableEmpty>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
