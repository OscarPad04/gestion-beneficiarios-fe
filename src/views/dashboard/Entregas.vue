<template>
  <div class="dash-page">

    <!-- ── Cabecera ── -->
    <div class="page-header">
      <div class="header-text">
        <h2>Entregas</h2>
        <p>Registro y seguimiento de distribución de ayudas humanitarias</p>
      </div>
    </div>

    <!-- ── Skeletons mientras carga ── -->
    <div v-if="isListLoading" class="item-list">
      <div v-for="n in 4" :key="n" class="skeleton-item">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-body">
          <div class="skeleton-line w-60"></div>
          <div class="skeleton-line w-40"></div>
          <div class="skeleton-line w-80"></div>
        </div>
      </div>
    </div>

    <template v-else-if="showPanel">

      <!-- ── Error global ── -->
      <div v-if="resultKind === 'error'" class="toast error">
        <span class="toast-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </span>
        <div>
          <strong>No se pudo cargar el listado de entregas.</strong>
          <div>{{ errorMessage }}</div>
        </div>
      </div>

      <template v-else>

        <!-- ── Estadísticas ── -->
        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-num">{{ entregas.length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-card stat-pendiente">
            <span class="stat-num">{{ contadores.PENDIENTE }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
          <div class="stat-card stat-entregada">
            <span class="stat-num">{{ contadores.ENTREGADA }}</span>
            <span class="stat-label">Entregadas</span>
          </div>
          <div class="stat-card stat-anulada">
            <span class="stat-num">{{ contadores.ANULADA }}</span>
            <span class="stat-label">Anuladas</span>
          </div>
        </div>

        <!-- ── Filtros ── -->
        <div class="filtros">
          <div class="search-wrap">
            <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              v-model="busqueda"
              class="input-search"
              type="text"
              placeholder="Buscar por código, familia ID, bodega…"
            />
          </div>
          <select v-model="filtroEstado" class="select-filtro">
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="ENTREGADA">Entregada</option>
            <option value="ANULADA">Anulada</option>
          </select>
        </div>

        <!-- ── Sin resultados ── -->
        <div v-if="entregasFiltradas.length === 0" class="empty-list">
          <div class="icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <h4>Sin entregas</h4>
          <p>{{ busqueda || filtroEstado ? 'No hay resultados para los filtros aplicados.' : 'Aún no se han registrado entregas en el sistema.' }}</p>
        </div>

        <!-- ── Lista ── -->
        <ul v-else class="item-list entregas-list">
          <li
            v-for="entrega in entregasFiltradas"
            :key="entrega.id_entrega"
            class="item-card entrega-card"
            :class="{ expandida: expandidos.has(entrega.id_entrega) }"
          >
            <!-- Fila principal -->
            <button
              class="entrega-row"
              @click="toggleDetalle(entrega.id_entrega)"
              :aria-expanded="expandidos.has(entrega.id_entrega)"
            >
              <!-- Ícono / avatar -->
              <div class="item-avatar" :class="avatarClass(entrega.estado)">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>

              <!-- Info principal -->
              <div class="item-content">
                <h4>{{ entrega.codigo || 'ENT-' + String(entrega.id_entrega).padStart(5, '0') }}</h4>
                <p>
                  Familia #{{ entrega.id_familia ?? '—' }}
                  <span v-if="entrega.id_bodega"> · Bodega #{{ entrega.id_bodega }}</span>
                </p>
                <div class="item-meta">
                  <span class="badge" :class="badgeClass(entrega.estado)">
                    {{ estadoLabel(entrega.estado) }}
                  </span>
                  <span class="badge badge-default">
                    {{ entrega.detalles.length }} ítem{{ entrega.detalles.length !== 1 ? 's' : '' }}
                  </span>
                  <span v-if="entrega.fecha_efectiva" class="badge badge-default">
                    {{ formatDate(entrega.fecha_efectiva) }}
                  </span>
                </div>
              </div>

              <!-- Chevron -->
              <div class="item-actions">
                <span class="chevron" :class="{ rotado: expandidos.has(entrega.id_entrega) }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </div>
            </button>

            <!-- Detalle expandible -->
            <Transition name="expand">
              <div v-if="expandidos.has(entrega.id_entrega)" class="entrega-detalle">

                <div class="detalle-grid">

                  <!-- Bloque: Datos generales -->
                  <div class="detalle-bloque">
                    <h5 class="bloque-titulo">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Datos generales
                    </h5>
                    <dl class="dl">
                      <dt>Código</dt>
                      <dd class="mono">{{ entrega.codigo || 'ENT-' + String(entrega.id_entrega).padStart(5, '0') }}</dd>
                      <dt>ID interno</dt>
                      <dd>{{ entrega.id_entrega }}</dd>
                      <dt>Familia</dt>
                      <dd>FAM #{{ entrega.id_familia ?? '—' }}</dd>
                      <dt>Bodega</dt>
                      <dd>Bodega #{{ entrega.id_bodega ?? '—' }}</dd>
                      <dt>Estado</dt>
                      <dd>
                        <span class="badge" :class="badgeClass(entrega.estado)">
                          {{ estadoLabel(entrega.estado) }}
                        </span>
                      </dd>
                    </dl>
                  </div>

                  <!-- Bloque: Fechas -->
                  <div class="detalle-bloque">
                    <h5 class="bloque-titulo">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      Fechas
                    </h5>
                    <dl class="dl">
                      <dt>Fecha programada</dt>
                      <dd>{{ formatDate(entrega.fecha) }}</dd>
                      <dt>Fecha efectiva</dt>
                      <dd>{{ formatDate(entrega.fecha_efectiva) }}</dd>
                      <dt>Coordenadas</dt>
                      <dd>{{ entrega.coordenadas || '—' }}</dd>
                    </dl>
                  </div>

                </div>

                <!-- Recursos entregados -->
                <div class="recursos-seccion">
                  <h5 class="bloque-titulo">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    Recursos entregados
                    <span class="count-pill">{{ entrega.detalles.length }} ítem{{ entrega.detalles.length !== 1 ? 's' : '' }}</span>
                  </h5>

                  <div v-if="entrega.detalles.length === 0" class="recursos-empty">
                    Sin detalles de recursos registrados.
                  </div>

                  <div v-else class="recursos-tabla-wrap">
                    <table class="recursos-tabla">
                      <thead>
                        <tr>
                          <th>ID Recurso</th>
                          <th>Nombre</th>
                          <th class="text-right">Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="detalle in entrega.detalles" :key="detalle.id_detalle">
                          <td class="mono">#{{ detalle.id_recurso }}</td>
                          <td>{{ detalle.nombre_recurso || '—' }}</td>
                          <td class="text-right">{{ detalle.cantidad }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </Transition>
          </li>
        </ul>

      </template>
    </template>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { entregaService } from '../../services/operaciones'
import { usePermissions } from '../../composables/usePermissions'
import type { Entrega, EstadoEntrega } from '../../types'

export default defineComponent({
  name: 'DashboardEntregas',
  setup() {
    const { puedeAccion } = usePermissions()

    // ── Estado ──────────────────────────────────────────────────────────────
    const entregas = ref<Entrega[]>([])
    const isListLoading = ref(false)
    const showPanel = ref(false)
    const resultKind = ref<'success' | 'error'>('success')
    const errorMessage = ref('')
    const expandidos = ref<Set<number>>(new Set())
    const busqueda = ref('')
    const filtroEstado = ref<EstadoEntrega | ''>('')

    // ── Computed ─────────────────────────────────────────────────────────────
    const entregasFiltradas = computed(() => {
      return entregas.value.filter((e) => {
        const q = busqueda.value.toLowerCase()
        const matchBusqueda =
          !q ||
          String(e.id_entrega).includes(q) ||
          (e.codigo ?? '').toLowerCase().includes(q) ||
          String(e.id_familia ?? '').includes(q) ||
          String(e.id_bodega ?? '').includes(q)
        const matchEstado = !filtroEstado.value || e.estado === filtroEstado.value
        return matchBusqueda && matchEstado
      })
    })

    const contadores = computed(() => ({
      PENDIENTE: entregas.value.filter((e) => e.estado === 'PENDIENTE').length,
      ENTREGADA: entregas.value.filter((e) => e.estado === 'ENTREGADA').length,
      ANULADA:   entregas.value.filter((e) => e.estado === 'ANULADA').length,
    }))

    // ── Helpers ──────────────────────────────────────────────────────────────
    const extractError = (err: any): string => {
      const detail = err?.response?.data?.detail
      if (typeof detail === 'string') return detail
      if (Array.isArray(detail)) return detail.map((d: any) => d.msg).join(', ')
      return err?.message || 'Error desconocido'
    }

    const formatDate = (iso?: string) => {
      if (!iso) return '—'
      try {
        const d = new Date(iso)
        return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
      } catch {
        return iso
      }
    }

    const estadoLabel = (estado: EstadoEntrega) => {
      const map: Record<EstadoEntrega, string> = {
        PENDIENTE: 'Pendiente',
        ENTREGADA: 'Entregada',
        ANULADA:   'Anulada',
      }
      return map[estado] ?? estado
    }

    const badgeClass = (estado: EstadoEntrega) => ({
      'badge-warning': estado === 'PENDIENTE',
      'badge-success': estado === 'ENTREGADA',
      'badge-danger':  estado === 'ANULADA',
    })

    const avatarClass = (estado: EstadoEntrega) => ({
      'variant-yellow': estado === 'PENDIENTE',
      'variant-green':  estado === 'ENTREGADA',
      'variant-red':    estado === 'ANULADA',
    })

    const toggleDetalle = (id: number) => {
      if (expandidos.value.has(id)) {
        expandidos.value.delete(id)
      } else {
        expandidos.value.add(id)
      }
      // Forzar reactividad en el Set
      expandidos.value = new Set(expandidos.value)
    }

    // ── Carga inicial ─────────────────────────────────────────────────────────
    onMounted(async () => {
      isListLoading.value = true
      try {
        const response = await entregaService.listar()
        entregas.value = Array.isArray(response) ? response : []
        resultKind.value = 'success'
        showPanel.value = true
      } catch (err: any) {
        resultKind.value = 'error'
        errorMessage.value = extractError(err)
        showPanel.value = true
      } finally {
        isListLoading.value = false
      }
    })

    return {
      entregas,
      entregasFiltradas,
      contadores,
      isListLoading,
      showPanel,
      resultKind,
      errorMessage,
      expandidos,
      busqueda,
      filtroEstado,
      formatDate,
      estadoLabel,
      badgeClass,
      avatarClass,
      toggleDetalle,
      puedeAccion,
    }
  }
})
</script>

<style scoped>
/* ── Base (hereda del proyecto) ──────────────────────────────────────────── */
.dash-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Cabecera ────────────────────────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.page-header h2 {
  margin: 0 0 4px;
  font-size: 1.35rem;
  font-weight: 700;
  color: #101828;
  letter-spacing: -0.01em;
}
.page-header p {
  margin: 0;
  font-size: 13px;
  color: #667085;
}

/* ── Estadísticas ────────────────────────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.stat-card {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.8);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(16,24,40,0.06);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.stat-num {
  font-size: 1.75rem;
  font-weight: 700;
  color: #101828;
  line-height: 1;
}
.stat-label {
  font-size: 0.75rem;
  color: #667085;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}
.stat-pendiente .stat-num { color: #b45309; }
.stat-entregada .stat-num { color: #027a48; }
.stat-anulada   .stat-num { color: #b42318; }

/* ── Filtros ─────────────────────────────────────────────────────────────── */
.filtros {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.search-wrap {
  position: relative;
  flex: 1;
  min-width: 240px;
}
.search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #98a2b3;
  pointer-events: none;
}
.input-search {
  width: 100%;
  padding: 9px 12px 9px 34px;
  border: 1.5px solid #e4e7ec;
  border-radius: 10px;
  font-size: 14px;
  background: rgba(255,255,255,0.9);
  color: #101828;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
  font-family: inherit;
}
.input-search:focus { border-color: #2b7cff; }
.select-filtro {
  padding: 9px 12px;
  border: 1.5px solid #e4e7ec;
  border-radius: 10px;
  font-size: 14px;
  background: rgba(255,255,255,0.9);
  color: #101828;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
  font-family: inherit;
}
.select-filtro:focus { border-color: #2b7cff; }

/* ── Lista de entregas ───────────────────────────────────────────────────── */
.item-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Item card (base del proyecto) ───────────────────────────────────────── */
.item-card {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.8);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(16,24,40,0.06);
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.item-card:hover {
  box-shadow: 0 4px 20px rgba(16,24,40,0.1);
}
.item-card.expandida {
  border-color: rgba(43,124,255,0.4);
  box-shadow: 0 0 0 3px rgba(43,124,255,0.08), 0 4px 20px rgba(16,24,40,0.08);
}

/* ── Fila principal ──────────────────────────────────────────────────────── */
.entrega-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}
.entrega-row:hover { background: rgba(43,124,255,0.02); }

/* ── Avatar ──────────────────────────────────────────────────────────────── */
.item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.item-avatar.variant-green  { background: rgba(5,150,105,0.1);  color: #027a48; }
.item-avatar.variant-yellow { background: rgba(217,119,6,0.1);  color: #b45309; }
.item-avatar.variant-red    { background: rgba(220,38,38,0.1);  color: #b42318; }

/* ── Contenido ───────────────────────────────────────────────────────────── */
.item-content {
  flex: 1;
  min-width: 0;
}
.item-content h4 {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 600;
  color: #101828;
  font-family: 'JetBrains Mono', 'Fira Mono', monospace;
}
.item-content p {
  margin: 0 0 6px;
  font-size: 13px;
  color: #667085;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

/* ── Chevron ─────────────────────────────────────────────────────────────── */
.item-actions { flex-shrink: 0; }
.chevron {
  display: flex;
  align-items: center;
  color: #98a2b3;
  transition: transform 0.2s ease;
}
.chevron.rotado { transform: rotate(180deg); }

/* ── Badges ──────────────────────────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-success { background: #ecfdf3; color: #027a48; }
.badge-warning { background: #fffaeb; color: #b45309; }
.badge-danger  { background: #fef3f2; color: #b42318; }
.badge-info    { background: #eff8ff; color: #1570ef; }
.badge-default { background: #f2f4f7; color: #344054; }

/* ── Detalle expandible ──────────────────────────────────────────────────── */
.entrega-detalle {
  border-top: 1px solid #f2f4f7;
  padding: 18px 16px 16px;
  background: #fafbff;
}

.detalle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.detalle-bloque {
  background: #fff;
  border: 1px solid #eaecf0;
  border-radius: 12px;
  padding: 14px 16px;
}

.bloque-titulo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #667085;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 12px;
}

/* ── DL ──────────────────────────────────────────────────────────────────── */
.dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 5px 14px;
  margin: 0;
  font-size: 13px;
}
.dl dt {
  color: #98a2b3;
  font-weight: 500;
  white-space: nowrap;
}
.dl dd {
  color: #101828;
  margin: 0;
}
.dl dd.mono {
  font-family: 'JetBrains Mono', 'Fira Mono', monospace;
  font-size: 12px;
  color: #1d4ed8;
}

/* ── Recursos ────────────────────────────────────────────────────────────── */
.recursos-seccion { }
.recursos-seccion .bloque-titulo { margin-bottom: 10px; }

.count-pill {
  margin-left: auto;
  background: #eff8ff;
  color: #1570ef;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}

.recursos-empty {
  font-size: 13px;
  color: #98a2b3;
  padding: 12px 0;
}

.recursos-tabla-wrap {
  background: #fff;
  border: 1px solid #eaecf0;
  border-radius: 12px;
  overflow: hidden;
}
.recursos-tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.recursos-tabla thead th {
  background: #f9fafb;
  padding: 8px 14px;
  text-align: left;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #667085;
  font-weight: 600;
  border-bottom: 1px solid #eaecf0;
}
.recursos-tabla tbody td {
  padding: 9px 14px;
  border-bottom: 1px solid #f2f4f7;
  color: #344054;
}
.recursos-tabla tbody tr:last-child td { border-bottom: none; }
.text-right { text-align: right; }
.mono { font-family: 'JetBrains Mono', 'Fira Mono', monospace; font-size: 12px; color: #1d4ed8; }

/* ── Skeletons (mismos del proyecto) ─────────────────────────────────────── */
.skeleton-item {
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  gap: 14px;
  animation: pulse 1.5s ease-in-out infinite;
}
.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #e4e7ec;
  flex-shrink: 0;
}
.skeleton-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}
.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: #e4e7ec;
}
.skeleton-line.w-60 { width: 60%; }
.skeleton-line.w-40 { width: 40%; }
.skeleton-line.w-80 { width: 80%; }
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ── Toast de error ──────────────────────────────────────────────────────── */
.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 13.5px;
}
.toast.error {
  background: #fef3f2;
  border: 1px solid #fecdca;
  color: #912018;
}
.toast-icon { flex-shrink: 0; margin-top: 1px; }

/* ── Empty list ──────────────────────────────────────────────────────────── */
.empty-list {
  background: rgba(255,255,255,0.7);
  border: 1px dashed #d0d5dd;
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.empty-list .icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f2f4f7;
  display: grid;
  place-items: center;
  color: #98a2b3;
}
.empty-list h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #344054;
}
.empty-list p {
  margin: 0;
  font-size: 13px;
  color: #98a2b3;
}

/* ── Transición expand ───────────────────────────────────────────────────── */
.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  overflow: hidden;
  max-height: 700px;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 780px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .detalle-grid { grid-template-columns: 1fr; }
}
@media (max-width: 500px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .filtros { flex-direction: column; }
}
</style>