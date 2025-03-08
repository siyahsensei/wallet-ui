<template>
  <footer class="bg-white mt-auto">
    <div class="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
      <p class="mt-4 text-center text-base text-gray-500">
        &copy; {{ currentYear }} Wallet - Finansal Varlık Yönetim Uygulaması. Tüm hakları saklıdır.
      </p>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'TheFooter',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())
    
    return {
      currentYear
    }
  }
}
</script> 