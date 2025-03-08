import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

export const useAccountsStore = defineStore('accounts', () => {
  // State
  const accounts = ref([])
  const accountTypes = ref([])
  const currentAccount = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const toast = useToast()
  
  // Getters
  const totalBalance = computed(() => {
    return accounts.value.reduce((sum, account) => sum + account.balance, 0)
  })
  
  const groupedAccounts = computed(() => {
    const groups = {}
    
    accounts.value.forEach(account => {
      if (!groups[account.type]) {
        groups[account.type] = []
      }
      groups[account.type].push(account)
    })
    
    return groups
  })
  
  // Actions
  async function fetchAccounts() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/accounts')
      // Data will be automatically normalized by axios interceptor
      accounts.value = response.data.accounts || []
    } catch (err) {
      error.value = err.response?.data?.error || 'Hesaplar yüklenirken bir hata oluştu.'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchAccountTypes() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/accounts/types')
      // Data will be automatically normalized by axios interceptor
      accountTypes.value = response.data.accountTypes || []
    } catch (err) {
      error.value = err.response?.data?.error || 'Hesap türleri yüklenirken bir hata oluştu.'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchAccountById(id) {
    loading.value = true
    error.value = null
    currentAccount.value = null
    
    try {
      const response = await api.get(`/accounts/${id}`)
      // Data will be automatically normalized by axios interceptor
      currentAccount.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Hesap bilgileri yüklenirken bir hata oluştu.'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  
  async function createAccount(accountData) {
    loading.value = true
    error.value = null
    
    try {
      // Ensure request matches CreateAccountRequest structure from backend
      const createAccountRequest = {
        name: accountData.name,
        description: accountData.description || '',
        type: accountData.type,
        institution: accountData.institution || '',
        currency: accountData.currency,
        balance: accountData.balance || 0,
        isManual: accountData.isManual !== undefined ? accountData.isManual : true,
        icon: accountData.icon || '',
        color: accountData.color || '',
        apiKey: accountData.apiKey,
        apiSecret: accountData.apiSecret
      }
      
      const response = await api.post('/accounts', createAccountRequest)
      // Data will be automatically normalized by axios interceptor
      accounts.value.push(response.data)
      toast.success('Hesap başarıyla oluşturuldu.')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Hesap oluşturulurken bir hata oluştu.'
      toast.error(error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  async function updateAccount(id, accountData) {
    loading.value = true
    error.value = null
    
    try {
      // Ensure request matches UpdateAccountRequest structure from backend
      const updateAccountRequest = {
        name: accountData.name,
        description: accountData.description,
        type: accountData.type,
        institution: accountData.institution,
        currency: accountData.currency,
        balance: accountData.balance,
        isManual: accountData.isManual,
        icon: accountData.icon,
        color: accountData.color
      }
      
      // Remove undefined fields
      Object.keys(updateAccountRequest).forEach(key => 
        updateAccountRequest[key] === undefined && delete updateAccountRequest[key]
      )
      
      const response = await api.put(`/accounts/${id}`, updateAccountRequest)
      // Data will be automatically normalized by axios interceptor
      
      // Update in the accounts array
      const index = accounts.value.findIndex(account => account.id === id)
      if (index !== -1) {
        accounts.value[index] = response.data
      }
      
      // Update currentAccount if it matches
      if (currentAccount.value && currentAccount.value.id === id) {
        currentAccount.value = response.data
      }
      
      toast.success('Hesap başarıyla güncellendi.')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Hesap güncellenirken bir hata oluştu.'
      toast.error(error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  async function deleteAccount(id) {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/accounts/${id}`)
      
      // Remove from the accounts array
      accounts.value = accounts.value.filter(account => account.id !== id)
      
      // Clear currentAccount if it matches
      if (currentAccount.value && currentAccount.value.id === id) {
        currentAccount.value = null
      }
      
      toast.success('Hesap başarıyla silindi.')
    } catch (err) {
      error.value = err.response?.data?.error || 'Hesap silinirken bir hata oluştu.'
      toast.error(error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  async function setApiCredentials(id, credentials) {
    loading.value = true
    error.value = null
    
    try {
      // Ensure request matches APICredentialsRequest structure from backend
      const credentialsRequest = {
        apiKey: credentials.apiKey,
        apiSecret: credentials.apiSecret
      }
      
      const response = await api.post(`/accounts/${id}/credentials`, credentialsRequest)
      // Data will be automatically normalized by axios interceptor
      
      // Update in the accounts array
      const index = accounts.value.findIndex(account => account.id === id)
      if (index !== -1) {
        accounts.value[index] = response.data
      }
      
      // Update currentAccount if it matches
      if (currentAccount.value && currentAccount.value.id === id) {
        currentAccount.value = response.data
      }
      
      toast.success('API kimlik bilgileri başarıyla ayarlandı.')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'API kimlik bilgileri ayarlanırken bir hata oluştu.'
      toast.error(error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    accounts,
    accountTypes,
    currentAccount,
    loading,
    error,
    
    // Getters
    totalBalance,
    groupedAccounts,
    
    // Actions
    fetchAccounts,
    fetchAccountTypes,
    fetchAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    setApiCredentials
  }
}) 