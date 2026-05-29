<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import {
  SidebarProvider,
  SidebarInset,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { LayoutDashboard, Users, Home, MapIcon, ChevronUp, LogOut } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('usuario')
  router.push('/')
}

// Menú de navegación
const navItems = [
  { name: 'Panel Principal', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Usuarios', icon: Users, path: '/dashboard/usuarios' },
  { name: 'Zonas', icon: MapIcon, path: '/dashboard/zonas' },
  { name: 'Familias', icon: Home, path: '/dashboard/familias' },
]
</script>

<template>
  <SidebarProvider>
    <!-- Barra Lateral -->
    <Sidebar variant="inset">
      <SidebarHeader class="p-4 border-b">
        <h2 class="text-lg font-bold tracking-tight text-blue-600 flex items-center gap-2">
          <span>SGAH</span>
        </h2>
        <p class="text-xs text-muted-foreground">Gestión Humanitaria</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <!-- Iteramos sobre los links de navegación -->
              <SidebarMenuItem v-for="item in navItems" :key="item.name">
                <SidebarMenuButton 
                  :as-child="true" 
                  :is-active="route.path === item.path"
                  :tooltip="item.name"
                >
                  <router-link :to="item.path" class="flex items-center gap-3">
                    <component :is="item.icon" class="w-4 h-4" />
                    <span>{{ item.name }}</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter class="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton size="lg" class="w-full flex items-center justify-between">
                  <div class="flex items-center gap-2">
                     <Avatar class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700">
                        <AvatarFallback class="font-bold border border-blue-200">
                          {{ usuario.correo?.charAt(0).toUpperCase() || 'U' }}
                        </AvatarFallback>
                     </Avatar>
                     <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-semibold text-gray-900">{{ usuario.correo || 'Tú' }}</span>
                        <span class="truncate text-xs text-gray-500">Admin</span>
                     </div>
                  </div>
                  <ChevronUp class="ml-auto size-4 text-gray-500" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" class="w-56" align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="logout" class="text-red-600 focus:text-red-700 font-medium cursor-pointer">
                  <LogOut class="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>

    <!-- Contenido Principal -->
    <SidebarInset class="flex flex-col flex-1 min-h-screen">
      <!-- Navbar superior (Header mobile/desktop) -->
      <header class="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" class="h-6" />
        <div class="font-semibold text-sm text-gray-700">
          {{ navItems.find(i => i.path === route.path)?.name || 'Detalle' }}
        </div>
      </header>

      <!-- Aquí carga dinámicamente cada vista -->
      <main class="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50/50">
        <!-- Transición opcional entre páginas -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
