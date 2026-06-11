<template>
  <div class="dash-page">
    <article v-if="puedeAccion('mapa.ver')" class="form-card">
      <div class="form-card-head">
        <div class="form-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <div class="form-card-title">
          <h3>Mapa geográfico</h3>
          <span>Visualiza refugios, bodegas, entregas y familias en un solo mapa</span>
        </div>
      </div>

      <div class="mapa-controls">
        <div class="mapa-filters">
          <div class="form-field">
            <label>Zona</label>
            <select v-model.number="filtroZona" class="select" @change="cargarMapa">
              <option :value="null">Todas las zonas</option>
              <option v-for="z in zonas" :key="z.id_zona" :value="z.id_zona">{{ z.nombre }}</option>
            </select>
          </div>
          <div class="form-field">
            <label>Límite de entregas recientes</label>
            <select v-model.number="limiteEntregas" class="select" @change="cargarMapa">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
          <button type="button" class="btn btn-secondary" :disabled="isLoading" @click="cargarMapa">
            Actualizar mapa
          </button>
        </div>

        <div class="mapa-layers">
          <span class="layers-label">Capas visibles</span>
          <label v-for="capa in capas" :key="capa.tipo" class="layer-toggle">
            <input type="checkbox" v-model="capa.visible" @change="actualizarCapas" />
            <span class="layer-dot" :style="{ background: capa.color }"></span>
            {{ capa.label }}
            <span class="layer-count">{{ conteos[capa.tipo] ?? 0 }}</span>
          </label>
        </div>
      </div>
    </article>

    <section v-if="puedeAccion('mapa.ver')" class="result-panel">
      <div class="result-head">
        <div class="result-head-info">
          <span class="label">Mapa operativo</span>
          <span v-if="!isLoading && totalFeatures" class="count">
            <strong>{{ totalFeatures }}</strong> {{ totalFeatures === 1 ? 'punto' : 'puntos' }}
          </span>
        </div>
      </div>

      <ErrorState
        v-if="errorMessage"
        title="No se pudo cargar el mapa"
        :message="errorMessage"
        retry-label="Reintentar"
        @retry="cargarMapa"
      />

      <div v-else class="map-wrapper">
        <div ref="mapContainer" class="map-container"></div>
        <div v-if="isLoading" class="map-loading-overlay">
          <LoadingState
            variant="skeleton"
            :count="3"
            label="Cargando mapa geográfico..."
          />
        </div>
        <p v-if="!isLoading && !totalFeatures" class="map-empty">No hay puntos geográficos para los filtros seleccionados.</p>
      </div>
    </section>

    <article v-else class="form-card">
      <div class="form-card-title">
        <h3>Sin permisos</h3>
        <span>Tu rol no tiene acceso al mapa geográfico.</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, ref, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { mapaService } from '../../services/operaciones'
import { zonaService } from '../../services/ubicaciones'
import { usePermissions } from '../../composables/usePermissions'
import LoadingState from '../../components/LoadingState.vue'
import ErrorState from '../../components/ErrorState.vue'
import type { MapaGeoFeature, MapaResumenResponse, TipoMapaFeature, Zona } from '../../types'

interface CapaConfig {
  tipo: TipoMapaFeature
  label: string
  color: string
  visible: boolean
}

const TIPO_CONFIG: Record<TipoMapaFeature, { label: string; color: string }> = {
  refugio: { label: 'Refugios', color: '#2b7cff' },
  bodega: { label: 'Bodegas', color: '#7c3aed' },
  entrega: { label: 'Entregas', color: '#12b76a' },
  familia: { label: 'Familias', color: '#f79009' },
  zona: { label: 'Zonas', color: '#667085' }
}

const DEFAULT_CENTER: L.LatLngExpression = [4.7110, -74.0721]
const DEFAULT_ZOOM = 6

export default defineComponent({
  name: 'DashboardMapa',
  components: { LoadingState, ErrorState },
  setup() {
    const { puedeAccion } = usePermissions()

    const zonas = ref<Zona[]>([])
    const filtroZona = ref<number | null>(null)
    const limiteEntregas = ref(20)
    const isLoading = ref(false)
    const errorMessage = ref('')
    const totalFeatures = ref(0)
    const mapContainer = ref<HTMLElement | null>(null)

    const conteos = reactive<Record<string, number>>({
      refugio: 0,
      bodega: 0,
      entrega: 0,
      familia: 0,
      zona: 0
    })

    const capas = ref<CapaConfig[]>(
      (Object.keys(TIPO_CONFIG) as TipoMapaFeature[]).map(tipo => ({
        tipo,
        label: TIPO_CONFIG[tipo].label,
        color: TIPO_CONFIG[tipo].color,
        visible: true
      }))
    )

    let mapInstance: L.Map | null = null
    let geoData: MapaResumenResponse | null = null
    const layerGroups: Partial<Record<TipoMapaFeature, L.LayerGroup>> = {}

    const extractError = (err: unknown): string => {
      const e = err as { response?: { data?: { detail?: string | Array<{ msg: string }> } }; message?: string }
      const detail = e?.response?.data?.detail
      if (typeof detail === 'string') return detail
      if (Array.isArray(detail)) return detail.map(d => d.msg).join(', ')
      return e?.message || 'Error desconocido'
    }

    const tipoLabel = (tipo: string): string => {
      return TIPO_CONFIG[tipo as TipoMapaFeature]?.label || tipo
    }

    const markerColor = (feature: MapaGeoFeature): string => {
      const color = feature.properties.color
      if (color && /^#[0-9a-fA-F]{3,8}$/.test(color)) return color
      const tipo = feature.properties.tipo as TipoMapaFeature
      return TIPO_CONFIG[tipo]?.color || '#98a2b3'
    }

    const buildPopup = (feature: MapaGeoFeature): string => {
      const p = feature.properties
      const lines: string[] = [
        `<strong>${tipoLabel(String(p.tipo))}</strong>`
      ]
      if (p.nombre) lines.push(`Nombre: ${p.nombre}`)
      if (p.codigo) lines.push(`Código: ${p.codigo}`)
      lines.push(`ID: ${p.id}`)
      if (p.estado) lines.push(`Estado: ${p.estado}`)
      if (p.porcentaje != null) lines.push(`Ocupación: ${Number(p.porcentaje).toFixed(1)}%`)
      if (p.zona_id) lines.push(`Zona: #${p.zona_id}`)
      if (p.tiene_alerta) lines.push('<span style="color:#b42318">⚠ Alerta activa</span>')
      return lines.join('<br/>')
    }

    const initMap = (): void => {
      if (!mapContainer.value) return
      if (mapInstance) {
        mapInstance.invalidateSize()
        return
      }
      mapInstance = L.map(mapContainer.value).setView(DEFAULT_CENTER, DEFAULT_ZOOM)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance)
    }

    const clearLayerGroups = (): void => {
      if (!mapInstance) return
      Object.values(layerGroups).forEach(group => {
        if (group) mapInstance?.removeLayer(group)
      })
      ;(Object.keys(layerGroups) as TipoMapaFeature[]).forEach(tipo => {
        delete layerGroups[tipo]
      })
    }

    const renderFeatures = (): void => {
      if (!mapInstance || !geoData) return
      clearLayerGroups()

      const visibles = new Set(
        capas.value.filter(c => c.visible).map(c => c.tipo)
      )

      Object.keys(conteos).forEach(k => { conteos[k] = 0 })

      geoData.features.forEach(feature => {
        const tipo = feature.properties.tipo as TipoMapaFeature
        if (!visibles.has(tipo)) return

        if (layerGroups[tipo] == null) {
          layerGroups[tipo] = L.layerGroup().addTo(mapInstance!)
        }

        const coords = feature.geometry.coordinates
        const latlng = L.latLng(coords[1], coords[0])
        const color = markerColor(feature)
        const radius = feature.properties.tiene_alerta ? 10 : 8

        const marker = L.circleMarker(latlng, {
          radius,
          fillColor: color,
          color: feature.properties.tiene_alerta ? '#b42318' : '#fff',
          weight: feature.properties.tiene_alerta ? 3 : 2,
          opacity: 1,
          fillOpacity: 0.85
        })

        marker.bindPopup(buildPopup(feature))
        marker.addTo(layerGroups[tipo]!)
        conteos[tipo] = (conteos[tipo] ?? 0) + 1
      })

      const allLayers = Object.values(layerGroups).filter(Boolean) as L.LayerGroup[]
      if (allLayers.length) {
        const bounds = L.featureGroup(allLayers).getBounds()
        if (bounds.isValid()) {
          mapInstance.fitBounds(bounds, { padding: [30, 30] })
        }
      }
    }

    const actualizarCapas = (): void => {
      renderFeatures()
    }

    const cargarMapa = async (): Promise<void> => {
      if (!puedeAccion('mapa.ver')) return
      isLoading.value = true
      errorMessage.value = ''
      try {
        geoData = await mapaService.obtenerResumen(
          filtroZona.value ?? undefined,
          limiteEntregas.value
        )
        totalFeatures.value = geoData.features?.length ?? 0
      } catch (err: unknown) {
        errorMessage.value = extractError(err)
        totalFeatures.value = 0
        geoData = null
        return
      } finally {
        isLoading.value = false
      }

      await nextTick()
      initMap()
      renderFeatures()
      mapInstance?.invalidateSize()
    }

    onMounted(async () => {
      if (!puedeAccion('mapa.ver')) return
      await nextTick()
      initMap()
      try {
        zonas.value = await zonaService.list()
      } catch {
        // silent — el filtro de zona queda vacío
      }
      await cargarMapa()
    })

    onUnmounted(() => {
      if (mapInstance) {
        mapInstance.remove()
        mapInstance = null
      }
    })

    return {
      puedeAccion,
      zonas,
      filtroZona,
      limiteEntregas,
      isLoading,
      errorMessage,
      totalFeatures,
      mapContainer,
      capas,
      conteos,
      cargarMapa,
      actualizarCapas
    }
  }
})
</script>

<style scoped>
.mapa-controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 1rem);
}

.mapa-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm, 0.5rem);
  align-items: flex-end;
}

.mapa-filters .form-field {
  min-width: 180px;
  flex: 1;
}

.mapa-layers {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm, 0.75rem);
  align-items: center;
  padding: var(--spacing-sm, 0.75rem);
  background: #f9fafb;
  border: 1px solid #eaecf0;
  border-radius: var(--radius-md, 0.5rem);
}

.layers-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #667085;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-right: var(--spacing-xs, 0.25rem);
}

.layer-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #344054;
  cursor: pointer;
  user-select: none;
}

.layer-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.layer-count {
  font-size: 0.7rem;
  color: #98a2b3;
  font-weight: 500;
}

.map-wrapper {
  position: relative;
}

.map-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: #fafbfc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-container {
  height: 520px;
  border-radius: 12px;
  overflow: hidden;
  z-index: 0;
}

.map-container :deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  border-radius: 12px;
}

.map-empty {
  margin: var(--spacing-sm, 0.5rem) 0 0;
  font-size: 0.875rem;
  color: #667085;
  text-align: center;
}

@media (max-width: 640px) {
  .mapa-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .map-container {
    height: 400px;
  }
}
</style>
