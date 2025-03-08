<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1>Varlıklar</h1>
      <button @click="openCreateDialog" class="btn-primary">
        <span class="mr-2">+</span> Yeni Varlık
      </button>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <!-- No assets message -->
    <div v-else-if="assets.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Henüz varlık eklemediniz</h3>
      <p class="mt-1 text-gray-500">İlk varlığınızı ekleyerek portföyünüzü oluşturmaya başlayın.</p>
      <button @click="openCreateDialog" class="mt-6 btn-primary">
        Varlık Ekle
      </button>
    </div>
    
    <!-- Assets content -->
    <div v-else>
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Toplam Varlık Değeri</h3>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ formatCurrency(totalValue) }}</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Toplam Kâr/Zarar</h3>
          <p 
            class="mt-2 text-3xl font-bold"
            :class="totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ formatCurrency(totalProfitLoss) }} ({{ formatPercentage(totalProfitLossPercentage) }})
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Varlık Sayısı</h3>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ assets.length }}</p>
        </div>
      </div>
      
      <!-- Assets table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Tüm Varlıklar</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Varlık
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hesap
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Miktar
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alış Fiyatı
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Güncel Fiyat
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Değer
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kâr/Zarar
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="asset in assets" 
                :key="asset.id" 
                class="hover:bg-gray-50 cursor-pointer"
                @click="goToAssetDetail(asset.id)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-gray-600 font-medium">{{ asset.symbol ? asset.symbol.substring(0, 2).toUpperCase() : asset.name.substring(0, 2).toUpperCase() }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ asset.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ getAssetTypeLabel(asset.type) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getAccountName(asset.accountId) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ asset.quantity }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatCurrency(asset.purchasePrice) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatCurrency(asset.currentPrice) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatCurrency(asset.currentValue) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div 
                    class="text-sm font-medium"
                    :class="asset.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'"  
                  >
                    {{ formatCurrency(asset.profitLoss) }}
                    ({{ formatPercentage(asset.profitLossPercentage) }})
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Create Asset Dialog (simplified for demo) -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">Yeni Varlık Ekle</h2>
        
        <form @submit.prevent="createAsset">
          <div class="mb-4">
            <label for="account" class="form-label">Hesap</label>
            <select id="account" v-model="form.accountId" class="form-input" required>
              <option value="">Hesap seçin</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label for="name" class="form-label">Varlık Adı</label>
            <input id="name" type="text" v-model="form.name" class="form-input" required />
          </div>
          
          <div class="mb-4">
            <label for="type" class="form-label">Varlık Türü</label>
            <select id="type" v-model="form.type" class="form-input" required>
              <option value="">Varlık türü seçin</option>
              <option value="CASH">Nakit</option>
              <option value="TERM_DEPOSIT">Vadeli Mevduat</option>
              <option value="STOCK">Hisse Senedi</option>
              <option value="ETF">ETF</option>
              <option value="FUND">Yatırım Fonu</option>
              <option value="CRYPTOCURRENCY">Kripto Para</option>
              <option value="PRECIOUS_METAL">Değerli Maden</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label for="symbol" class="form-label">Sembol</label>
            <input id="symbol" type="text" v-model="form.symbol" class="form-input" />
          </div>
          
          <div class="mb-4">
            <label for="quantity" class="form-label">Miktar</label>
            <input id="quantity" type="number" v-model="form.quantity" step="0.00000001" min="0" class="form-input" required />
          </div>
          
          <div class="mb-4">
            <label for="purchasePrice" class="form-label">Alış Fiyatı</label>
            <input id="purchasePrice" type="number" v-model="form.purchasePrice" step="0.01" min="0" class="form-input" required />
          </div>
          
          <div class="mb-4">
            <label for="currentPrice" class="form-label">Güncel Fiyat</label>
            <input id="currentPrice" type="number" v-model="form.currentPrice" step="0.01" min="0" class="form-input" required />
          </div>
          
          <div class="mb-4">
            <label for="currency" class="form-label">Para Birimi</label>
            <select id="currency" v-model="form.currency" class="form-input" required>
              <option value="TRY">Türk Lirası (TRY)</option>
              <option value="USD">ABD Doları (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label for="purchaseDate" class="form-label">Alış Tarihi</label>
            <input id="purchaseDate" type="date" v-model="form.purchaseDate" class="form-input" required />
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" class="btn-outline" @click="showCreateDialog = false">
              İptal
            </button>
            <button type="submit" class="btn-primary" :disabled="creating">
              {{ creating ? 'Ekleniyor...' : 'Varlık Ekle' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAssetsStore } from '@/stores/assets'
import { useAccountsStore } from '@/stores/accounts'
import { useToast } from 'vue-toastification'

export default {
  name: 'AssetsView',
  setup() {
    const router = useRouter()
    const assetsStore = useAssetsStore()
    const accountsStore = useAccountsStore()
    const toast = useToast()
    
    const loading = ref(true)
    const creating = ref(false)
    const showCreateDialog = ref(false)
    
    const form = ref({
      accountId: '',
      name: '',
      type: '',
      symbol: '',
      quantity: 0,
      purchasePrice: 0,
      currentPrice: 0,
      currency: 'TRY',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: ''
    })
    
    // Get assets, accounts and computed values from stores
    const assets = computed(() => assetsStore.assets)
    const accounts = computed(() => accountsStore.accounts)
    const totalValue = computed(() => assetsStore.totalValue)
    const totalProfitLoss = computed(() => assetsStore.totalProfitLoss)
    const totalProfitLossPercentage = computed(() => assetsStore.totalProfitLossPercentage)
    
    onMounted(async () => {
      loading.value = true
      try {
        // Load assets and accounts in parallel
        await Promise.all([
          assetsStore.fetchAssets(),
          accountsStore.fetchAccounts()
        ])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        loading.value = false
      }
    })
    
    const openCreateDialog = () => {
      showCreateDialog.value = true
    }
    
    const createAsset = async () => {
      creating.value = true
      
      try {
        const assetData = {
          accountId: form.value.accountId,
          name: form.value.name,
          type: form.value.type,
          symbol: form.value.symbol,
          quantity: parseFloat(form.value.quantity),
          purchasePrice: parseFloat(form.value.purchasePrice),
          currentPrice: parseFloat(form.value.currentPrice),
          currency: form.value.currency,
          purchaseDate: form.value.purchaseDate,
          notes: form.value.notes
        }
        
        const newAsset = await assetsStore.createAsset(assetData)
        
        showCreateDialog.value = false
        toast.success('Varlık başarıyla oluşturuldu')
        
        // Reset form
        form.value = {
          accountId: '',
          name: '',
          type: '',
          symbol: '',
          quantity: 0,
          purchasePrice: 0,
          currentPrice: 0,
          currency: 'TRY',
          purchaseDate: new Date().toISOString().split('T')[0],
          notes: ''
        }
        
        // Navigate to the new asset
        router.push({ name: 'asset-detail', params: { id: newAsset.id } })
      } catch (error) {
        toast.error('Varlık oluşturulurken bir hata oluştu')
      } finally {
        creating.value = false
      }
    }
    
    const goToAssetDetail = (id) => {
      router.push({ name: 'asset-detail', params: { id } })
    }
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(value)
    }
    
    const formatPercentage = (value) => {
      return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
    }
    
    const getAssetTypeLabel = (type) => {
      const typeLabels = {
        'CASH': 'Nakit',
        'TERM_DEPOSIT': 'Vadeli Mevduat',
        'STOCK': 'Hisse Senedi',
        'ETF': 'ETF',
        'FUND': 'Yatırım Fonu',
        'BOND': 'Tahvil/Bono',
        'OPTION': 'Opsiyon',
        'FUTURE': 'Vadeli İşlem',
        'CRYPTOCURRENCY': 'Kripto Para',
        'NFT': 'NFT',
        'DEFI_TOKEN': 'DeFi Token',
        'PRECIOUS_METAL': 'Değerli Maden',
        'REAL_ESTATE': 'Gayrimenkul',
        'DEBT': 'Borç',
        'RECEIVABLE': 'Alacak',
        'OTHER': 'Diğer'
      }
      
      return typeLabels[type] || type
    }
    
    const getAccountName = (accountId) => {
      const account = accounts.value.find(a => a.id === accountId)
      return account ? account.name : 'Bilinmeyen Hesap'
    }
    
    return {
      loading,
      creating,
      assets,
      accounts,
      totalValue,
      totalProfitLoss,
      totalProfitLossPercentage,
      showCreateDialog,
      form,
      openCreateDialog,
      createAsset,
      goToAssetDetail,
      formatCurrency,
      formatPercentage,
      getAssetTypeLabel,
      getAccountName
    }
  }
}
</script> 