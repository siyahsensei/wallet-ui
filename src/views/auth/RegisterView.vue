<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-center text-3xl font-extrabold text-gray-900">
          Wallet'a Kaydolun
        </h1>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ücretsiz hesap oluşturarak finansal varlıklarınızı yönetmeye başlayın.
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="first-name" class="sr-only">Ad</label>
            <input 
              id="first-name" 
              name="first-name" 
              type="text" 
              autocomplete="given-name" 
              required 
              v-model="firstName"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
              placeholder="Ad" 
            />
          </div>
          <div>
            <label for="last-name" class="sr-only">Soyad</label>
            <input 
              id="last-name" 
              name="last-name" 
              type="text" 
              autocomplete="family-name" 
              required 
              v-model="lastName"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
              placeholder="Soyad" 
            />
          </div>
          <div>
            <label for="email" class="sr-only">E-posta</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              v-model="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
              placeholder="E-posta adresi" 
            />
          </div>
          <div>
            <label for="password" class="sr-only">Şifre</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="new-password" 
              required 
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
              placeholder="Şifre (en az 8 karakter)" 
            />
          </div>
          <div>
            <label for="confirm-password" class="sr-only">Şifre Tekrar</label>
            <input 
              id="confirm-password" 
              name="confirm-password" 
              type="password" 
              autocomplete="new-password" 
              required 
              v-model="confirmPassword"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
              placeholder="Şifre tekrar" 
            />
          </div>
        </div>

        <div class="flex items-center">
          <input 
            id="terms" 
            name="terms" 
            type="checkbox" 
            required
            v-model="acceptTerms"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" 
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">Kullanım Koşulları</a>
            ve
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">Gizlilik Politikası</a>'nı
            kabul ediyorum
          </label>
        </div>

        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            :disabled="loading || password !== confirmPassword || !acceptTerms"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg 
                v-if="!loading"
                class="h-5 w-5 text-primary-500 group-hover:text-primary-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path 
                  fill-rule="evenodd" 
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                  clip-rule="evenodd" 
                />
              </svg>
              <svg 
                v-else
                class="animate-spin h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  class="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  stroke-width="4"
                ></circle>
                <path 
                  class="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ loading ? 'Kaydediliyor...' : 'Kaydol' }}
          </button>
        </div>
        
        <div v-if="password && confirmPassword && password !== confirmPassword" class="text-center">
          <p class="text-sm text-red-600">
            Şifreler eşleşmiyor!
          </p>
        </div>
      </form>
      
      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Zaten hesabınız var mı?
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Giriş yapın
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'RegisterView',
  setup() {
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const acceptTerms = ref(false)
    
    const authStore = useAuthStore()
    const loading = computed(() => authStore.loading)
    const error = computed(() => authStore.error)
    
    const handleRegister = async () => {
      if (password.value !== confirmPassword.value) {
        return
      }
      
      try {
        await authStore.register({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value
        })
        router.push('/dashboard')
      } catch (err) {
        toast.error(err.response?.data?.error || 'Kayıt yapılırken bir hata oluştu.')
      }
    }
    
    return {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      acceptTerms,
      loading,
      error,
      handleRegister
    }
  }
}
</script> 