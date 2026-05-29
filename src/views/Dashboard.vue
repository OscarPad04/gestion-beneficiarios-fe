<template>
  <div class="dash">
    <header class="hero">
      <div>
        <p class="eyebrow">Panel principal</p>
        <h1>Bienvenido, {{ usuario?.nombre_completo || 'Usuario' }}</h1>
        <p class="hero-copy">{{ usuario?.correo }} · Rol: {{ usuario?.rol }}</p>
      </div>
      <button class="logout" @click="logout">Cerrar sesión</button>
    </header>

    <section v-if="!isAdmin" class="card deny">
      <span class="section-label">Acceso restringido</span>
      <h2>NO es usuario admin, no tiene permitido hacer nada.</h2>
      <p>Solo el rol ADMIN puede crear o consultar los apartados de gestión.</p>
    </section>

    <template v-else>
      <section class="grid stats-grid">
        <article class="card stat">
          <span class="stat-label">Estado de sesión</span>
          <strong>{{ token ? 'Activa' : 'Sin token' }}</strong>
        </article>
        <article class="card stat">
          <span class="stat-label">Usuario</span>
          <strong>{{ usuario?.nombre_completo }}</strong>
        </article>
        <article class="card stat">
          <span class="stat-label">Correo</span>
          <strong>{{ usuario?.correo }}</strong>
        </article>
        <article class="card stat">
          <span class="stat-label">Rol</span>
          <strong>{{ usuario?.rol }}</strong>
        </article>
      </section>

      <section class="card tabs">
        <div class="tab-head">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="tab-content">
          <section v-if="activeTab === 'usuarios'" class="panel-grid">
            <article class="panel">
              <h3>Crear usuario</h3>
              <form @submit.prevent="createUser">
                <input v-model="forms.user.nombre_completo" placeholder="Nombre completo" />
                <input v-model="forms.user.correo" placeholder="Correo" type="email" />
                <input v-model="forms.user.password" placeholder="Contraseña" type="password" />
                <select v-model="forms.user.rol">
                  <option value="ADMIN">ADMIN</option>
                  <option value="CENSADOR">CENSADOR</option>
                  <option value="OPERADOR_ENTREGAS">OPERADOR_ENTREGAS</option>
                  <option value="COORDINADOR_LOGISTICA">COORDINADOR_LOGISTICA</option>
                  <option value="FUNCIONARIO_CONTROL">FUNCIONARIO_CONTROL</option>
                  <option value="REGISTRADOR_DONACIONES">REGISTRADOR_DONACIONES</option>
                </select>
                <button class="primary" type="submit">Crear usuario</button>
              </form>
            </article>

            <article class="panel">
              <h3>Obtener usuarios</h3>
              <button class="primary" @click="loadUsers">Listar usuarios</button>
              <pre v-if="usersResult">{{ usersResult }}</pre>
            </article>
          </section>

          <section v-if="activeTab === 'familias'" class="panel-grid">
            <article class="panel">
              <h3>Crear familia</h3>
              <form @submit.prevent="createFamily">
                <label class="check"><input v-model="forms.family.acepta_privacidad" type="checkbox" /> Acepta privacidad</label>
                <input v-model.number="forms.family.id_zona" placeholder="ID zona" type="number" />
                <button class="primary" type="submit">Crear familia</button>
              </form>
            </article>

            <article class="panel">
              <h3>Obtener familias</h3>
              <button class="primary" @click="loadFamilies">Listar familias</button>
              <pre v-if="familiesResult">{{ familiesResult }}</pre>
            </article>
          </section>

          <section v-if="activeTab === 'personas'" class="panel-grid">
            <article class="panel">
              <h3>Crear persona</h3>
              <form @submit.prevent="createPerson">
                <input v-model.number="forms.person.id_familia" placeholder="ID familia" type="number" />
                <input v-model="forms.person.nombre" placeholder="Nombre" />
                <input v-model.number="forms.person.edad" placeholder="Edad" type="number" />
                <label class="check"><input v-model="forms.person.es_nino" type="checkbox" /> Es niño</label>
                <label class="check"><input v-model="forms.person.es_anciano" type="checkbox" /> Es anciano</label>
                <label class="check"><input v-model="forms.person.es_embarazada" type="checkbox" /> Es embarazada</label>
                <label class="check"><input v-model="forms.person.tiene_discapacidad" type="checkbox" /> Tiene discapacidad</label>
                <label class="check"><input v-model="forms.person.tiene_enfermedad_cronica" type="checkbox" /> Tiene enfermedad crónica</label>
                <label class="check"><input v-model="forms.person.es_cabeza_familia" type="checkbox" /> Es cabeza familia</label>
                <button class="primary" type="submit">Crear persona</button>
              </form>
            </article>
          </section>

          <section v-if="activeTab === 'ubicaciones'" class="panel-grid">
            <article class="panel">
              <h3>Crear zona</h3>
              <form @submit.prevent="createZone">
                <input v-model="forms.zone.nombre" placeholder="Nombre zona" />
                <select v-model="forms.zone.nivel_riesgo">
                  <option value="bajo">bajo</option>
                  <option value="medio">medio</option>
                  <option value="alto">alto</option>
                  <option value="crítico">crítico</option>
                </select>
                <button class="primary" type="submit">Crear zona</button>
              </form>
            </article>

            <article class="panel">
              <h3>Crear refugio</h3>
              <form @submit.prevent="createShelter">
                <input v-model="forms.shelter.nombre" placeholder="Nombre refugio" />
                <input v-model.number="forms.shelter.latitud" placeholder="Latitud" type="number" step="any" />
                <input v-model.number="forms.shelter.longitud" placeholder="Longitud" type="number" step="any" />
                <input v-model.number="forms.shelter.capacidad_maxima_personas" placeholder="Capacidad máxima" type="number" />
                <input v-model.number="forms.shelter.zona_id" placeholder="ID zona" type="number" />
                <button class="primary" type="submit">Crear refugio</button>
              </form>
            </article>

            <article class="panel">
              <h3>Crear bodega</h3>
              <form @submit.prevent="createWarehouse">
                <input v-model="forms.warehouse.nombre" placeholder="Nombre bodega" />
                <input v-model.number="forms.warehouse.latitud" placeholder="Latitud" type="number" step="any" />
                <input v-model.number="forms.warehouse.longitud" placeholder="Longitud" type="number" step="any" />
                <input v-model.number="forms.warehouse.capacidad_max_kg" placeholder="Capacidad kg" type="number" />
                <input v-model.number="forms.warehouse.zona_id" placeholder="ID zona" type="number" />
                <button class="primary" type="submit">Crear bodega</button>
              </form>
            </article>
          </section>

          <section v-if="activeTab === 'recursos'" class="panel-grid">
            <article class="panel">
              <h3>Crear recurso</h3>
              <form @submit.prevent="createResource">
                <input v-model="forms.resource.nombre" placeholder="Nombre" />
                <select v-model="forms.resource.categoria">
                  <option value="ALIMENTOS">ALIMENTOS</option>
                  <option value="COBIJA">COBIJA</option>
                  <option value="COLCHONETA">COLCHONETA</option>
                  <option value="ASEO">ASEO</option>
                  <option value="MEDICAMENTO">MEDICAMENTO</option>
                </select>
                <select v-model="forms.resource.unidad_medida">
                  <option value="KG">KG</option>
                  <option value="UNIDAD">UNIDAD</option>
                  <option value="LITRO">LITRO</option>
                </select>
                <input v-model.number="forms.resource.peso_unitario_kg" placeholder="Peso unitario kg" type="number" step="any" />
                <input v-model.number="forms.resource.umbral_alerta" placeholder="Umbral alerta" type="number" />
                <button class="primary" type="submit">Crear recurso</button>
              </form>
            </article>

            <article class="panel">
              <h3>Consultar inventario</h3>
              <input v-model.number="warehouseId" placeholder="ID bodega opcional" type="number" />
              <button class="primary" @click="loadInventory">Consultar inventario</button>
              <pre v-if="inventoryResult">{{ inventoryResult }}</pre>
            </article>
          </section>

          <section v-if="activeTab === 'donantes'" class="panel-grid">
            <article class="panel">
              <h3>Registrar donante</h3>
              <form @submit.prevent="createDonor">
                <input v-model="forms.donor.nombre" placeholder="Nombre" />
                <input v-model="forms.donor.tipo_donante" placeholder="Tipo donante" />
                <button class="primary" type="submit">Crear donante</button>
              </form>
            </article>
          </section>
        </div>
      </section>

      <section class="card result" v-if="apiMessage">
        <span class="section-label">Resultado</span>
        <pre>{{ apiMessage }}</pre>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import api from '../services/api'
import { authService } from '../services/auth'
import { userService } from '../services/users'
import { bodegaService, refugioService, recursoService, zonaService } from '../services/ubicaciones'
import { inventarioService } from '../services/operaciones'
import { familiaService, personaService } from '../services/familia'

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const usuario = ref(authService.getUser())
    const token = ref<string | null>(authService.getToken())
    const isAdmin = computed(() => usuario.value?.rol === 'ADMIN')

    const activeTab = ref<'usuarios' | 'familias' | 'personas' | 'ubicaciones' | 'recursos' | 'donantes'>('usuarios')
    const apiMessage = ref('')
    const usersResult = ref('')
    const familiesResult = ref('')
    const inventoryResult = ref('')
    const warehouseId = ref<number | null>(null)

    const tabs = [
      { key: 'usuarios', label: 'Usuarios' },
      { key: 'familias', label: 'Familias' },
      { key: 'personas', label: 'Personas' },
      { key: 'ubicaciones', label: 'Ubicaciones' },
      { key: 'recursos', label: 'Recursos' },
      { key: 'donantes', label: 'Donantes' }
    ] as const

    const forms = reactive({
      user: { nombre_completo: '', correo: '', password: '', rol: 'REGISTRADOR_DONACIONES' },
      family: { acepta_privacidad: true, id_zona: null as number | null },
      person: {
        id_familia: null as number | null,
        nombre: '',
        edad: null as number | null,
        es_nino: false,
        es_anciano: false,
        es_embarazada: false,
        tiene_discapacidad: false,
        tiene_enfermedad_cronica: false,
        es_cabeza_familia: false
      },
      zone: { nombre: '', nivel_riesgo: 'medio' },
      shelter: { nombre: '', latitud: null as number | null, longitud: null as number | null, capacidad_maxima_personas: null as number | null, zona_id: null as number | null },
      warehouse: { nombre: '', latitud: null as number | null, longitud: null as number | null, capacidad_max_kg: null as number | null, zona_id: null as number | null },
      resource: { nombre: '', categoria: 'ALIMENTOS', unidad_medida: 'UNIDAD', peso_unitario_kg: null as number | null, umbral_alerta: null as number | null },
      donor: { nombre: '', tipo_donante: '' }
    })

    const logout = () => authService.logout()

    const setMessage = (message: unknown) => {
      apiMessage.value = typeof message === 'string' ? message : JSON.stringify(message, null, 2)
    }

    const createUser = async () => {
      try {
        const response = await userService.create({
          nombre_completo: forms.user.nombre_completo,
          correo: forms.user.correo,
          password: forms.user.password,
          rol: forms.user.rol as any
        })
        setMessage(response)
      } catch (error: any) {
        setMessage(error.response?.data || error.message)
      }
    }

    const loadUsers = async () => {
      try {
        const response = await userService.list()
        usersResult.value = JSON.stringify(response, null, 2)
      } catch (error: any) {
        usersResult.value = JSON.stringify(error.response?.data || error.message, null, 2)
      }
    }

    const createFamily = async () => {
      try {
        const response = await familiaService.create({
          acepta_privacidad: forms.family.acepta_privacidad,
          id_zona: forms.family.id_zona ?? undefined
        })
        setMessage(response)
      } catch (error: any) {
        setMessage(error.response?.data || error.message)
      }
    }

    const loadFamilies = async () => {
      try {
        const response = await familiaService.list()
        familiesResult.value = JSON.stringify(response, null, 2)
      } catch (error: any) {
        familiesResult.value = JSON.stringify(error.response?.data || error.message, null, 2)
      }
    }

    const createPerson = async () => {
      try {
        const response = await personaService.create({
          id_familia: forms.person.id_familia ?? undefined,
          nombre: forms.person.nombre,
          edad: forms.person.edad ?? undefined,
          es_nino: forms.person.es_nino,
          es_anciano: forms.person.es_anciano,
          es_embarazada: forms.person.es_embarazada,
          tiene_discapacidad: forms.person.tiene_discapacidad,
          tiene_enfermedad_cronica: forms.person.tiene_enfermedad_cronica,
          es_cabeza_familia: forms.person.es_cabeza_familia
        })
        setMessage(response)
      } catch (error: any) {
        setMessage(error.response?.data || error.message)
      }
    }

    const createZone = async () => {
      try {
        const response = await zonaService.create(forms.zone as any)
        setMessage(response)
      } catch (error: any) {
        setMessage(error.response?.data || error.message)
      }
    }

    const createShelter = async () => {
      try {
        const response = await refugioService.create({
          nombre: forms.shelter.nombre,
          latitud: forms.shelter.latitud ?? 0,
          longitud: forms.shelter.longitud ?? 0,
          capacidad_maxima_personas: forms.shelter.capacidad_maxima_personas ?? 0,
          zona_id: forms.shelter.zona_id ?? undefined
        })
        setMessage(response)
      } catch (error: any) {
        setMessage(error.response?.data || error.message)
      }
    }

    const createWarehouse = async () => {
      try {
        const response = await bodegaService.create({
          nombre: forms.warehouse.nombre,
          latitud: forms.warehouse.latitud ?? 0,
          longitud: forms.warehouse.longitud ?? 0,
          capacidad_max_kg: forms.warehouse.capacidad_max_kg ?? 0,
          zona_id: forms.warehouse.zona_id ?? 0
        })
        setMessage(response)
      } catch (error: any) {
        setMessage(error.response?.data || error.message)
      }
    }

    const createResource = async () => {
      try {
        const response = await recursoService.create({
          nombre: forms.resource.nombre,
          categoria: forms.resource.categoria as any,
          unidad_medida: forms.resource.unidad_medida as any,
          peso_unitario_kg: forms.resource.peso_unitario_kg ?? 0,
          umbral_alerta: forms.resource.umbral_alerta ?? undefined
        })
        setMessage(response)
      } catch (error: any) {
        setMessage(error.response?.data || error.message)
      }
    }

    const createDonor = async () => {
      try {
        const response = await api.post('/donantes/', forms.donor)
        setMessage(response.data)
      } catch (error: any) {
        setMessage(error.response?.data || error.message)
      }
    }

    const loadInventory = async () => {
      try {
        const response = await inventarioService.consultar(warehouseId.value ?? undefined)
        inventoryResult.value = JSON.stringify(response, null, 2)
      } catch (error: any) {
        inventoryResult.value = JSON.stringify(error.response?.data || error.message, null, 2)
      }
    }

    return {
      usuario,
      token,
      isAdmin,
      activeTab,
      tabs,
      forms,
      apiMessage,
      usersResult,
      familiesResult,
      inventoryResult,
      warehouseId,
      logout,
      createUser,
      loadUsers,
      createFamily,
      loadFamilies,
      createPerson,
      createZone,
      createShelter,
      createWarehouse,
      createResource,
      createDonor,
      loadInventory
    }
  }
})
</script>

<style scoped>
.dash{min-height:100vh;padding:28px;background:linear-gradient(180deg,#f6f8fc 0%,#eef3ff 100%);font-family:system-ui}
.hero{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin:0 auto 24px;max-width:1200px}
.eyebrow,.section-label{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#eaf2ff;color:#2b5fd9;font-size:12px;font-weight:700}
h1{margin:12px 0 10px;font-size:34px;line-height:1.05;color:#101828}
.hero-copy{margin:0;color:#667085;max-width:620px;font-size:15px}
.logout,.primary,.tab{border:0;border-radius:14px;padding:12px 16px;font-weight:700;cursor:pointer;transition:transform .15s ease, box-shadow .15s ease}
.logout{background:#fff;color:#344054;box-shadow:0 10px 24px rgba(16,24,40,.08);border:1px solid #eaecf0}
.primary{background:linear-gradient(135deg,#2b7cff,#5d8cff);color:#fff;box-shadow:0 14px 24px rgba(43,124,255,.22)}
.tab{background:#f2f4f7;color:#344054;margin-right:8px;margin-bottom:8px}
.tab.active{background:#1d4ed8;color:#fff}
.logout:hover,.primary:hover,.tab:hover{transform:translateY(-1px)}
.grid,.panel-grid{display:grid;gap:18px;max-width:1200px;margin:0 auto}
.stats-grid{grid-template-columns:repeat(4,minmax(0,1fr));margin-bottom:18px}
.tabs{padding:24px}
.tab-head{display:flex;flex-wrap:wrap;margin-bottom:18px}
.card{background:rgba(255,255,255,.88);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.8);border-radius:24px;box-shadow:0 18px 50px rgba(16,24,40,.10);padding:24px}
.deny{max-width:1200px;margin:0 auto}
.deny h2{margin:10px 0 8px;font-size:28px;color:#101828}
.deny p{margin:0;color:#667085}
.stat{display:flex;flex-direction:column;justify-content:space-between;min-height:160px}
.stat-label{font-size:13px;color:#667085;font-weight:700}
.stat strong{font-size:24px;color:#101828;word-break:break-word}
.panel-grid{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.panel{border:1px solid #eaecf0;border-radius:18px;padding:18px;background:#fff}
.panel h3{margin:0 0 14px;font-size:18px;color:#101828}
form{display:grid;gap:10px}
input,select{width:100%;padding:12px 14px;border:1px solid #d0d5dd;border-radius:12px;font-size:14px;outline:none;background:#fff}
input:focus,select:focus{border-color:#7aa2ff;box-shadow:0 0 0 4px rgba(43,124,255,.12)}
.check{display:flex;align-items:center;gap:8px;color:#344054;font-size:14px}
.check input{width:auto}
.result{max-width:1200px;margin:18px auto 0}
pre{white-space:pre-wrap;background:#0f172a;color:#e2e8f0;padding:18px;border-radius:18px;overflow:auto;margin:0;font-size:13px;line-height:1.6}
@media (max-width: 980px){.stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width: 760px){.hero,.grid{display:grid}.hero{grid-template-columns:1fr;align-items:stretch}.stats-grid{grid-template-columns:1fr}}
</style>