import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const toast = useToast()
  
  // Getters
  const isAuthenticated = computed(() => !!token.value)
  
  // Actions
  function initializeAuth() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      api.setAuthHeader(storedToken)
    }
  }
  
  async function register(userData) {
    loading.value = true
    error.value = null
    
    try {
      const registerData = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email,
        password: userData.password
      }
      
      const response = await api.post('/auth/register', registerData)
      token.value = response.data.token
      user.value = response.data.user
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      api.setAuthHeader(token.value)
      
      toast.success('Kayıt başarılı. Hoş geldiniz!')
      router.push({ name: 'dashboard' })
    } catch (err) {
      error.value = err.response?.data?.error || 'Kayıt işlemi sırasında bir hata oluştu.'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  
  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', credentials)
      token.value = response.data.token
      user.value = response.data.user
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      api.setAuthHeader(token.value)
      
      toast.success('Giriş başarılı. Hoş geldiniz!')
      
      const redirectPath = router.currentRoute.value.query.redirect || '/dashboard'
      router.push(redirectPath)
    } catch (err) {
      error.value = err.response?.data?.error || 'Giriş yapılırken bir hata oluştu.'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  
  async function logout() {
    token.value = null
    user.value = null
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    api.clearAuthHeader()
    
    toast.info('Çıkış yapıldı.')
    router.push({ name: 'login' })
  }
  
  async function fetchUserProfile() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/auth/me')
      user.value = response.data.user
      
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      error.value = err.response?.data?.error || 'Kullanıcı bilgileri alınamadı.'
      toast.error(error.value)
      
      if (err.response?.status === 401) {
        logout()
      }
    } finally {
      loading.value = false
    }
  }

  async function changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      await api.put('/auth/change-password', {
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      })
    } catch (err) {
      error.value = err.response?.data?.error || 'Şifre değiştirilirken bir hata oluştu.'
      toast.error(error.value)
    }
  }
  
  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    
    // Actions
    initializeAuth,
    register,
    login,
    logout,
    fetchUserProfile,
    changePassword
  }
}) 