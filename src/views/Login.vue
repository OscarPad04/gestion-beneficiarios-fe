<template>
  <div class="page">
    <div class="card">
      <div class="badge">Acceso seguro</div>
      <h2>Iniciar sesión</h2>
      <p class="subtitle">Ingresa tus credenciales para continuar al panel de gestión.</p>
      <form @submit.prevent="onSubmit">
        <label>Correo</label>
        <input 
          v-model="correo" 
          placeholder="tu@email.com" 
          type="email"
          :disabled="isLoading"
        />

        <label>Contraseña</label>
        <input 
          v-model="password" 
          type="password" 
          placeholder="••••••••"
          :disabled="isLoading"
        />

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Iniciando sesión...' : 'Entrar' }}
        </button>
      </form>
      
      <p class="error" v-if="error">{{ error }}</p>
      <p class="hint" v-if="!error">Sistema de gestión de beneficiarios</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuth } from '../composables/useAuth'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const correo = ref<string>('')
    const password = ref<string>('')
    const { login, isLoading, error } = useAuth()

    const onSubmit = async () => {
      if (!correo.value || !password.value) {
        return
      }
      await login(correo.value, password.value)
    }

    return { correo, password, error, isLoading, onSubmit }
  }
})
</script>

<style scoped>
.page{min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at top,#eef4ff 0,#f7f9fc 42%,#eef2f7 100%);padding:24px}
.card{width:min(420px,100%);background:rgba(255,255,255,.9);backdrop-filter:blur(10px);padding:34px;border-radius:24px;box-shadow:0 20px 60px rgba(16,24,40,.12);border:1px solid rgba(255,255,255,.8)}
.badge{display:inline-flex;align-items:center;padding:6px 12px;margin-bottom:14px;border-radius:999px;background:#eaf2ff;color:#2b5fd9;font-size:12px;font-weight:700;letter-spacing:.02em}
h2{margin:0 0 8px;font-size:28px;line-height:1.1;color:#111827}
.subtitle{margin:0 0 24px;color:#6b7280;font-size:14px}
form{display:grid;gap:14px}
label{display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px}
input{width:100%;padding:14px 16px;border:1px solid #d6dbe6;border-radius:14px;background:#fff;font-size:15px;transition:box-shadow .2s,border-color .2s,transform .15s;outline:none}
input:focus{border-color:#7aa2ff;box-shadow:0 0 0 4px rgba(43,124,255,.12)}
input:disabled{opacity:0.6;cursor:not-allowed}
button{margin-top:6px;width:100%;padding:14px 16px;border:0;border-radius:14px;background:linear-gradient(135deg,#2b7cff,#5d8cff);color:white;font-weight:700;font-size:15px;cursor:pointer;box-shadow:0 12px 24px rgba(43,124,255,.25);transition:transform .15s}
button:hover:not(:disabled){transform:translateY(-1px)}
button:disabled{opacity:0.7;cursor:not-allowed}
.error{color:#b42318;margin-top:14px;font-size:14px;background:#fff1f0;border:1px solid #ffd4d0;padding:12px 14px;border-radius:12px;margin-bottom:0}
.hint{margin-top:14px;color:#6b7280;font-size:13px;text-align:center;margin-bottom:0}
</style>
