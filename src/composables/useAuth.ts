import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'
import type { Usuario } from '../types'

export function useAuth() {
  const router = useRouter()
  const usuario = ref<Usuario | null>(authService.getUser())
  const isAuthenticated = computed(() => authService.isAuthenticated())
  const isLoading = ref(false)
  const error = ref<string>('')

  const login = async (correo: string, password: string) => {
    isLoading.value = true
    error.value = ''
    
    try {
      const response = await authService.login(correo, password)
      usuario.value = response.usuario
      await router.push('/dashboard')
    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión'
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    usuario.value = null
    router.push('/')
  }

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken()
      usuario.value = response.usuario
      return true
    } catch {
      logout()
      return false
    }
  }

  return {
    usuario,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshToken
  }
}
