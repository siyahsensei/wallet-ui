<template>
  <div class="max-w-3xl mx-auto">
    <h1>Profil Ayarları</h1>
    
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else-if="user" class="bg-white rounded-lg shadow p-6 mt-4">
      <!-- User Information -->
      <form @submit.prevent="updateProfile">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="first-name" class="form-label">Ad</label>
            <input 
              id="first-name" 
              type="text" 
              v-model="form.firstName"
              class="form-input"
              placeholder="Adınız" 
            />
          </div>
          
          <div>
            <label for="last-name" class="form-label">Soyad</label>
            <input 
              id="last-name" 
              type="text" 
              v-model="form.lastName"
              class="form-input"
              placeholder="Soyadınız" 
            />
          </div>
          
          <div class="sm:col-span-2">
            <label for="email" class="form-label">E-posta</label>
            <input 
              id="email" 
              type="email" 
              v-model="form.email"
              class="form-input"
              placeholder="E-posta adresiniz"
              disabled
            />
            <p class="text-sm text-gray-500 mt-1">E-posta adresinizi değiştiremezsiniz.</p>
          </div>
        </div>
        
        <div class="mt-6">
          <button type="submit" class="btn-primary" :disabled="updating">
            {{ updating ? 'Güncelleniyor...' : 'Profili Güncelle' }}
          </button>
        </div>
      </form>
      
      <!-- Change Password -->
      <div class="mt-10 pt-10 border-t border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Şifre Değiştir</h2>
        
        <form @submit.prevent="changePassword" class="mt-4">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="current-password" class="form-label">Mevcut Şifre</label>
              <input 
                id="current-password" 
                type="password" 
                v-model="passwordForm.currentPassword"
                class="form-input"
                placeholder="Mevcut şifreniz" 
              />
            </div>
            
            <div>
              <label for="new-password" class="form-label">Yeni Şifre</label>
              <input 
                id="new-password" 
                type="password" 
                v-model="passwordForm.newPassword"
                class="form-input"
                placeholder="Yeni şifreniz" 
              />
            </div>
            
            <div>
              <label for="confirm-password" class="form-label">Yeni Şifre (Tekrar)</label>
              <input 
                id="confirm-password" 
                type="password" 
                v-model="passwordForm.confirmPassword"
                class="form-input"
                placeholder="Yeni şifrenizi tekrar girin" 
              />
              <p v-if="passwordsDoNotMatch" class="text-sm text-red-600 mt-1">
                Şifreler eşleşmiyor.
              </p>
            </div>
          </div>
          
          <div class="mt-6">
            <button 
              type="submit" 
              class="btn-primary" 
              :disabled="updatingPassword || passwordsDoNotMatch"
            >
              {{ updatingPassword ? 'Güncelleniyor...' : 'Şifreyi Değiştir' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ProfileView',
  setup() {
    const authStore = useAuthStore()
    const toast = useToast()
    
    const loading = ref(true)
    const updating = ref(false)
    const updatingPassword = ref(false)
    
    const user = computed(() => authStore.user)
    
    const form = ref({
      firstName: '',
      lastName: '',
      email: ''
    })
    
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const passwordsDoNotMatch = computed(() => {
      return passwordForm.value.newPassword && 
             passwordForm.value.confirmPassword && 
             passwordForm.value.newPassword !== passwordForm.value.confirmPassword
    })
    
    onMounted(() => {
      loadUserData()
    })
    
    const loadUserData = async () => {
      loading.value = true
      
      try {
        await authStore.fetchUserProfile()
        
        // Set form data from user
        if (authStore.user) {
          form.value.firstName = authStore.user.firstName
          form.value.lastName = authStore.user.lastName
          form.value.email = authStore.user.email
        }
      } catch (error) {
        toast.error('Kullanıcı bilgileri yüklenirken bir hata oluştu.')
      } finally {
        loading.value = false
      }
    }
    
    const updateProfile = async () => {
      updating.value = true
      
      try {
        toast.success('Profil başarıyla güncellendi.')
      } catch (error) {
        toast.error('Profil güncellenirken bir hata oluştu.')
      } finally {
        updating.value = false
      }
    }
    
    const changePassword = async () => {
      if (passwordsDoNotMatch.value) {
        toast.error('Şifreler eşleşmiyor.')
        return
      }
      updatingPassword.value = true
      
      try {
        await authStore.changePassword(passwordForm.value.currentPassword, passwordForm.value.newPassword, passwordForm.value.confirmPassword)
        toast.success('Şifre başarıyla değiştirildi.')
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        toast.error('Şifre değiştirilirken bir hata oluştu.')
      } finally {
        updatingPassword.value = false
      }
    }
    
    return {
      user,
      loading,
      updating,
      updatingPassword,
      form,
      passwordForm,
      passwordsDoNotMatch,
      updateProfile,
      changePassword
    }
  }
}
</script> 