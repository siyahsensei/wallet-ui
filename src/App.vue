<template>
  <div class="min-h-screen bg-gray-50">
    <TheHeader v-if="showHeader" />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <TheFooter v-if="showHeader" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter
  },
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    authStore.initializeAuth()
    const showHeader = computed(() => {
      return !['login', 'register'].includes(route.name)
    })
    return {
      showHeader
    }
  }
}
</script> 