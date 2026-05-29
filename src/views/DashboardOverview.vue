<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { Button } from '@/components/ui/button'

const router = useRouter()
const token = ref<string | null>(localStorage.getItem('access_token'))
const usuario = ref<any>(JSON.parse(localStorage.getItem('usuario') || 'null'))
const apiResult = ref<string | null>(null)
const isLoading = ref<boolean>(false)

const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('usuario')
  router.push('/')
}

const callSample = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/users/')
    apiResult.value = JSON.stringify(res.data, null, 2)
  } catch (err: any) {
    if (err.response?.status === 401) {
      logout()
    }
    apiResult.value = err.response?.data?.detail || err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex justify-between items-start">
      <div>
        <p class="text-sm font-semibold text-blue-600 mb-1">Panel principal</p>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Bienvenido, {{ usuario?.correo || 'Usuario' }}</h1>
        <p class="text-gray-500 mt-2">Sistema de Gestión y Distribución de Ayudas Humanitarias.</p>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white border rounded-xl p-6 shadow-sm">
        <span class="text-sm font-semibold text-gray-500 uppercase">Estado de sesión</span>
        <div class="mt-2 text-2xl font-bold text-gray-900">
          {{ token ? 'Activa' : 'Sin token' }}
        </div>
      </div>

      <div class="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between items-start">
        <div>
          <span class="text-sm font-semibold text-gray-500 uppercase">Prueba rápida</span>
          <h3 class="text-lg font-bold text-gray-900 mt-1">Consulta al backend</h3>
          <p class="text-sm text-gray-500 mt-1">Ejecuta una llamada de lectura a /users/ usando el cliente centralizado.</p>
        </div>
        <Button @click="callSample" class="mt-4" :disabled="isLoading">
          {{ isLoading ? 'Consultando...' : 'Probar llamada a usuarios' }}
        </Button>
      </div>
    </div>

    <div v-if="apiResult" class="bg-gray-900 text-gray-100 border rounded-xl p-6 shadow-sm overflow-auto max-h-96">
      <div class="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Respuesta de la API</div>
      <pre class="text-sm font-mono whitespace-pre-wrap">{{ apiResult }}</pre>
    </div>
  </div>
</template>
