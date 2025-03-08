import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

export const useAssetsStore = defineStore('assets', () => {
  // State
  const assets = ref([])
  const assetTypes = ref([])
  const currentAsset = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const toast = useToast()
  
  // Getters
  const totalValue = computed(() => {
    return assets.value.reduce((sum, asset) => sum + asset.currentValue, 0)
  })
  
  const totalProfitLoss = computed(() => {
    return assets.value.reduce((sum, asset) => sum + asset.profitLoss, 0)
  })
  
  const totalProfitLossPercentage = computed(() => {
    const totalInvested = assets.value.reduce((sum, asset) => {
      return sum + (asset.purchasePrice * asset.quantity)
    }, 0)
    
    if (totalInvested === 0) return 0
    
    return (totalProfitLoss.value / totalInvested) * 100
  })
  
  const groupedAssets = computed(() => {
    const groups = {}
    
    assets.value.forEach(asset => {
      if (!groups[asset.type]) {
        groups[asset.type] = []
      }
      groups[asset.type].push(asset)
    })
    
    return groups
  })
  
  // Actions
  async function fetchAssets() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/assets')
      // Data will be automatically normalized by axios interceptor
      assets.value = response.data.assets || []
    } catch (err) {
      error.value = err.response?.data?.error || 'Varlıklar yüklenirken bir hata oluştu.'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchAssetTypes() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/assets/types')
      // Data will be automatically normalized by axios interceptor
      assetTypes.value = response.data.assetTypes || []
    } catch (err) {
      error.value = err.response?.data?.error || 'Varlık türleri yüklenirken bir hata oluştu.'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchAssetById(id) {
    loading.value = true
    error.value = null
    currentAsset.value = null
    
    try {
      const response = await api.get(`/assets/${id}`)
      // Data will be automatically normalized by axios interceptor
      currentAsset.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Varlık bilgileri yüklenirken bir hata oluştu.'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchAssetsByAccount(accountId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/assets/account/${accountId}`)
      // Data will be automatically normalized by axios interceptor
      return response.data.assets || []
    } catch (err) {
      error.value = err.response?.data?.error || 'Hesaba ait varlıklar yüklenirken bir hata oluştu.'
      toast.error(error.value)
      return []
    } finally {
      loading.value = false
    }
  }
  
  async function createAsset(assetData) {
    loading.value = true
    error.value = null
    
    try {
      // Ensure request matches CreateAssetRequest structure from backend
      const createAssetRequest = {
        accountId: assetData.accountId,
        name: assetData.name,
        type: assetData.type,
        symbol: assetData.symbol || '',
        quantity: assetData.quantity,
        purchasePrice: assetData.purchasePrice,
        currentPrice: assetData.currentPrice,
        currency: assetData.currency,
        notes: assetData.notes || '',
        purchaseDate: assetData.purchaseDate
      }
      
      const response = await api.post('/assets', createAssetRequest)
      // Data will be automatically normalized by axios interceptor
      assets.value.push(response.data)
      toast.success('Varlık başarıyla oluşturuldu.')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Varlık oluşturulurken bir hata oluştu.'
      toast.error(error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  async function updateAsset(id, assetData) {
    loading.value = true
    error.value = null
    
    try {
      // Ensure request matches UpdateAssetRequest structure from backend
      const updateAssetRequest = {
        name: assetData.name,
        type: assetData.type,
        symbol: assetData.symbol,
        quantity: assetData.quantity,
        purchasePrice: assetData.purchasePrice,
        currentPrice: assetData.currentPrice,
        currency: assetData.currency,
        notes: assetData.notes,
        purchaseDate: assetData.purchaseDate
      }
      
      // Remove undefined fields
      Object.keys(updateAssetRequest).forEach(key => 
        updateAssetRequest[key] === undefined && delete updateAssetRequest[key]
      )
      
      const response = await api.put(`/assets/${id}`, updateAssetRequest)
      // Data will be automatically normalized by axios interceptor
      
      // Update in the assets array
      const index = assets.value.findIndex(asset => asset.id === id)
      if (index !== -1) {
        assets.value[index] = response.data
      }
      
      // Update currentAsset if it matches
      if (currentAsset.value && currentAsset.value.id === id) {
        currentAsset.value = response.data
      }
      
      toast.success('Varlık başarıyla güncellendi.')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Varlık güncellenirken bir hata oluştu.'
      toast.error(error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  async function deleteAsset(id) {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/assets/${id}`)
      
      // Remove from the assets array
      assets.value = assets.value.filter(asset => asset.id !== id)
      
      // Clear currentAsset if it matches
      if (currentAsset.value && currentAsset.value.id === id) {
        currentAsset.value = null
      }
      
      toast.success('Varlık başarıyla silindi.')
    } catch (err) {
      error.value = err.response?.data?.error || 'Varlık silinirken bir hata oluştu.'
      toast.error(error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    assets,
    assetTypes,
    currentAsset,
    loading,
    error,
    
    // Getters
    totalValue,
    totalProfitLoss,
    totalProfitLossPercentage,
    groupedAssets,
    
    // Actions
    fetchAssets,
    fetchAssetTypes,
    fetchAssetById,
    fetchAssetsByAccount,
    createAsset,
    updateAsset,
    deleteAsset
  }
}) 