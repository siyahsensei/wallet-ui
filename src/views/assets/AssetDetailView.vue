<template>
  <div>
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <template v-else-if="asset">
      <!-- Header with back button and actions -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <button @click="goBack" class="mr-4 p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <h1>{{ asset.name }}</h1>
        </div>
        
        <div class="flex space-x-2">
          <button @click="openEditDialog" class="btn-outline">
            Düzenle
          </button>
          <button @click="confirmDelete" class="btn-danger">
            Sil
          </button>
        </div>
      </div>
      
      <!-- Asset details -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center mb-6 md:mb-0">
            <div class="p-4 rounded-full mr-4 bg-indigo-100 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-semibold">{{ asset.name }}</h2>
              <div class="flex items-center text-gray-600">
                <span>{{ getAssetTypeLabel(asset.type) }}</span>
                <span v-if="asset.symbol" class="ml-2 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                  {{ asset.symbol }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Güncel Değer</p>
              <p class="text-xl font-bold text-gray-900">{{ formatCurrency(asset.currentValue) }}</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Kâr/Zarar</p>
              <p 
                class="text-xl font-bold"
                :class="asset.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatCurrency(asset.profitLoss) }}
                <span class="text-sm">
                  ({{ formatPercentage(asset.profitLossPercentage) }})
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div class="mt-8 border-t border-gray-100 pt-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-500">Miktar</p>
              <p class="font-medium">{{ asset.quantity }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Alış Fiyatı</p>
              <p class="font-medium">{{ formatCurrency(asset.purchasePrice) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Güncel Fiyat</p>
              <p class="font-medium">{{ formatCurrency(asset.currentPrice) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Alış Tarihi</p>
              <p class="font-medium">{{ formatDate(asset.purchaseDate) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Para Birimi</p>
              <p class="font-medium">{{ asset.currency }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Hesap</p>
              <p class="font-medium">{{ getAccountName(asset.accountId) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Son Güncelleme</p>
              <p class="font-medium">{{ formatDate(asset.lastUpdated) }}</p>
            </div>
            
            <div class="md:col-span-2">
              <p class="text-sm text-gray-500">Notlar</p>
              <p class="font-medium">{{ asset.notes || "-" }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Transaction History -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">İşlem Geçmişi</h3>
          <button class="btn-primary text-sm">
            Yeni İşlem
          </button>
        </div>
        
        <div v-if="transactions.length === 0" class="text-center py-8">
          <p class="text-gray-500">Bu varlığa ait işlem bulunmuyor.</p>
          <button class="mt-4 btn-outline">
            İlk İşleminizi Ekleyin
          </button>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlem Türü
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Miktar
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(transaction.date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getTransactionTypeLabel(transaction.type) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ transaction.quantity }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatCurrency(transaction.price) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div 
                    class="text-sm font-medium"
                    :class="transaction.isCredit ? 'text-green-600' : transaction.isDebit ? 'text-red-600' : ''"  
                  >
                    {{ formatAmount(transaction) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Edit Asset Dialog (hidden in this simplified version) -->
      <!-- Delete Confirmation Dialog (hidden in this simplified version) -->
    </template>
    
    <div v-else-if="!loading" class="text-center py-12">
      <p class="text-lg text-gray-700">Varlık bulunamadı.</p>
      <button @click="goBack" class="mt-4 btn-primary">
        Varlıklara Dön
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAssetsStore } from '@/stores/assets'
import { useAccountsStore } from '@/stores/accounts'
import { useTransactionsStore } from '@/stores/transactions'

export default {
  name: 'AssetDetailView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    
    const assetsStore = useAssetsStore()
    const accountsStore = useAccountsStore()
    const transactionsStore = useTransactionsStore()
    
    const loading = ref(true)
    const loadingTransactions = ref(false)
    
    const asset = computed(() => assetsStore.currentAsset)
    const accounts = computed(() => accountsStore.accounts)
    const transactions = ref([])
    
    onMounted(async () => {
      loading.value = true
      
      try {
        // Load all accounts (needed for account names)
        if (accountsStore.accounts.length === 0) {
          await accountsStore.fetchAccounts()
        }
        
        // Load asset details
        await assetsStore.fetchAssetById(props.id)
        
        // Load transactions
        await loadTransactions()
      } catch (error) {
        console.error('Failed to fetch asset details:', error)
      } finally {
        loading.value = false
      }
    })
    
    const loadTransactions = async () => {
      loadingTransactions.value = true
      try {
        const assetTransactions = await transactionsStore.fetchTransactionsByAsset(props.id)
        transactions.value = assetTransactions
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        loadingTransactions.value = false
      }
    }
    
    const goBack = () => {
      router.push({ name: 'assets' })
    }
    
    const openEditDialog = () => {
      // In a real app, you would show an edit dialog
      toast.info('Düzenleme özelliği bu demo\'da aktif değil.')
    }
    
    const confirmDelete = () => {
      // In a real app, you would show a confirmation dialog
      if (confirm('Bu varlığı silmek istediğinizden emin misiniz?')) {
        deleteAsset()
      }
    }
    
    const deleteAsset = async () => {
      try {
        await assetsStore.deleteAsset(props.id)
        toast.success('Varlık başarıyla silindi.')
        router.push({ name: 'assets' })
      } catch (error) {
        toast.error('Varlık silinirken bir hata oluştu.')
      }
    }
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(value)
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('tr-TR')
    }
    
    const formatPercentage = (value) => {
      return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
    }
    
    const formatAmount = (transaction) => {
      if (transaction.isCredit) {
        return `+${formatCurrency(transaction.amount)}`
      } else if (transaction.isDebit) {
        return `-${formatCurrency(transaction.amount)}`
      }
      return formatCurrency(transaction.amount)
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
    
    const getTransactionTypeLabel = (type) => {
      const typeLabels = {
        'DEPOSIT': 'Para Yatırma',
        'WITHDRAWAL': 'Para Çekme',
        'TRANSFER': 'Transfer',
        'BUY': 'Satın Alma',
        'SELL': 'Satış',
        'DIVIDEND': 'Temettü',
        'INTEREST': 'Faiz',
        'FEE': 'Ücret',
        'INCOME': 'Gelir',
        'EXPENSE': 'Gider',
        'TAX': 'Vergi',
        'REBALANCE': 'Yeniden Dengeleme',
        'SPLIT': 'Bölünme',
        'MERGER': 'Birleşme',
        'STAKING': 'Staking',
        'MINING': 'Madencilik',
        'AIRDROP': 'Airdrop',
        'LENDING': 'Ödünç Verme',
        'BORROWING': 'Borçlanma',
        'REPAYMENT': 'Geri Ödeme'
      }
      
      return typeLabels[type] || type
    }
    
    return {
      loading,
      asset,
      transactions,
      goBack,
      openEditDialog,
      confirmDelete,
      formatCurrency,
      formatDate,
      formatPercentage,
      formatAmount,
      getAssetTypeLabel,
      getAccountName,
      getTransactionTypeLabel
    }
  }
}
</script> 