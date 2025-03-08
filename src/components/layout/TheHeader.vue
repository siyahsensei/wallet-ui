<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Navigation -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-primary-600 font-bold text-xl">
              Wallet
            </router-link>
          </div>
          
          <!-- Main Navigation -->
          <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link 
              v-for="item in navigationItems" 
              :key="item.name" 
              :to="item.to" 
              :class="[$route.path.startsWith(item.to) ? 
                'border-primary-500 text-gray-900' : 
                'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              ]"
            >
              {{ item.name }}
            </router-link>
          </nav>
        </div>
        
        <!-- User menu -->
        <div class="flex items-center">
          <div class="ml-3 relative">
            <div>
              <button 
                type="button" 
                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                @click="isUserMenuOpen = !isUserMenuOpen" 
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  {{ userInitials }}
                </div>
              </button>
            </div>
            
            <!-- Dropdown menu -->
            <div 
              v-if="isUserMenuOpen" 
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10"
            >
              <router-link 
                to="/profile" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="isUserMenuOpen = false"
              >
                Profil
              </router-link>
              <a 
                href="#" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click.prevent="logout"
              >
                Çıkış Yap
              </a>
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <div class="ml-3 sm:hidden">
            <button 
              type="button" 
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            >
              <span class="sr-only">Open main menu</span>
              <svg 
                class="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path 
                  v-if="!isMobileMenuOpen" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
                <path 
                  v-else 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu, show/hide based on menu state -->
    <div v-if="isMobileMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link 
          v-for="item in navigationItems" 
          :key="item.name" 
          :to="item.to" 
          :class="[$route.path.startsWith(item.to) ? 
            'bg-primary-50 border-primary-500 text-primary-700' : 
            'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
            'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
          ]"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'TheHeader',
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    
    const isUserMenuOpen = ref(false)
    const isMobileMenuOpen = ref(false)
    
    // Navigation items
    const navigationItems = [
      { name: 'Dashboard', to: '/dashboard' },
      { name: 'Hesaplar', to: '/accounts' },
      { name: 'Varlıklar', to: '/assets' },
      { name: 'İşlemler', to: '/transactions' }
    ]
    
    // Get user initials from name
    const userInitials = computed(() => {
      if (!authStore.user) return 'U'
      
      const firstName = authStore.user.firstName || ''
      const lastName = authStore.user.lastName || ''
      
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    })
    
    // Logout function
    const logout = () => {
      authStore.logout()
      isUserMenuOpen.value = false
    }
    
    return {
      route,
      isUserMenuOpen,
      isMobileMenuOpen,
      navigationItems,
      userInitials,
      logout
    }
  }
}
</script> 