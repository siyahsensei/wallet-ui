<template>
  <div>
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <template v-else-if="account">
      <!-- Header with back button and actions -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <button @click="goBack" class="mr-4 p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <h1>{{ account.name }}</h1>
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
      
      <!-- Account details -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center mb-4 md:mb-0">
            <div class="p-4 rounded-full mr-4" :class="`bg-${account.color || 'gray-200'}`">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-semibold">{{ account.name }}</h2>
              <p class="text-gray-600">{{ account.institution || getAccountTypeLabel(account.type) }}</p>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500">Güncel Bakiye</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(account.balance) }}</p>
            <p class="text-sm text-gray-500">{{ account.currency }}</p>
          </div>
        </div>
        
        <div class="mt-6 border-t border-gray-100 pt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-500">Hesap Türü</p>
              <p class="font-medium">{{ getAccountTypeLabel(account.type) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Kurum</p>
              <p class="font-medium">{{ account.institution || '-' }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Açıklama</p>
              <p class="font-medium">{{ account.description || '-' }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Oluşturulma Tarihi</p>
              <p class="font-medium">{{ formatDate(account.createdAt) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Son Güncelleme</p>
              <p class="font-medium">{{ formatDate(account.updatedAt) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">API Bağlantısı</p>
              <p class="font-medium">{{ account.isConnected ? 'Aktif' : 'Pasif' }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabs for assets and transactions -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex">
            <button 
              @click="activeTab = 'assets'"
              :class="[
                activeTab === 'assets' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'py-4 px-1 border-b-2 font-medium text-sm mr-8'
              ]"
            >
              Varlıklar
            </button>
            <button 
              @click="activeTab = 'transactions'"
              :class="[
                activeTab === 'transactions' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              İşlemler
            </button>
          </nav>
        </div>
      </div>
      
      <!-- Assets tab content -->
      <div v-if="activeTab === 'assets'" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Varlıklar</h3>
          <button class="btn-primary text-sm">
            Varlık Ekle
          </button>
        </div>
        
        <div v-if="assets.length === 0" class="text-center py-8">
          <p class="text-gray-500">Bu hesaba ait varlık bulunmuyor.</p>
          <button class="mt-4 btn-outline">
            İlk Varlığınızı Ekleyin
          </button>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Varlık
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
              <tr v-for="asset in assets" :key="asset.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">
                      {{ asset.name }}
                    </div>
                  </div>
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
      
      <!-- Transactions tab content -->
      <div v-if="activeTab === 'transactions'" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">İşlemler</h3>
          <button class="btn-primary text-sm">
            İşlem Ekle
          </button>
        </div>
        
        <div v-if="transactions.length === 0" class="text-center py-8">
          <p class="text-gray-500">Bu hesaba ait işlem bulunmuyor.</p>
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
                  Açıklama
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
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
                  <div class="text-sm text-gray-900">{{ transaction.description || getTransactionTypeLabel(transaction.type) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ transaction.category || '-' }}</div>
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
      
      <!-- Edit Account Dialog (hidden in this simplified version) -->
      <!-- Delete Confirmation Dialog (hidden in this simplified version) -->
      <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 class="text-2xl font-bold mb-4">Hesap Silme</h2>
          <p class="mb-4">Bu hesabı silmek istediğinize emin misiniz?</p>
          <div class="flex justify-end">
            <button @click="closeDeleteDialog" class="btn-outline mr-2">İptal</button>
            <button @click="deleteAccount" class="btn-danger">Sil</button>
          </div>
        </div>
      </div>
    </template>
    
    <div v-else-if="!loading" class="text-center py-12">
      <p class="text-lg text-gray-700">Hesap bulunamadı.</p>
      <button @click="goBack" class="mt-4 btn-primary">
        Hesaplara Dön
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAccountsStore } from '@/stores/accounts'
import { useAssetsStore } from '@/stores/assets'
import { useTransactionsStore } from '@/stores/transactions'

export default {
  name: 'AccountDetailView',
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
    
    const accountsStore = useAccountsStore()
    const assetsStore = useAssetsStore()
    const transactionsStore = useTransactionsStore()
    
    const loading = ref(true)
    const loadingAssets = ref(false)
    const loadingTransactions = ref(false)
    const activeTab = ref('assets')
    
    const account = computed(() => accountsStore.currentAccount)
    const assets = ref([])
    const transactions = ref([])
    
    onMounted(async () => {
      loading.value = true
      
      try {
        // Load account details
        await accountsStore.fetchAccountById(props.id)
        
        // Load assets and transactions in parallel
        await Promise.all([
          loadAssets(),
          loadTransactions()
        ])
      } catch (error) {
        console.error('Failed to fetch account details:', error)
      } finally {
        loading.value = false
      }
    })
    
    const loadAssets = async () => {
      loadingAssets.value = true
      try {
        const accountAssets = await assetsStore.fetchAssetsByAccount(props.id)
        assets.value = accountAssets
      } catch (error) {
        console.error('Failed to fetch assets:', error)
      } finally {
        loadingAssets.value = false
      }
    }
    
    const loadTransactions = async () => {
      loadingTransactions.value = true
      try {
        const accountTransactions = await transactionsStore.fetchTransactionsByAccount(props.id)
        transactions.value = accountTransactions
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        loadingTransactions.value = false
      }
    }
    
    const goBack = () => {
      router.push({ name: 'accounts' })
    }
    
    const openEditDialog = () => {
      // In a real app, you would show an edit dialog
      toast.info('Düzenleme özelliği bu demo\'da aktif değil.')
    }
    
    const confirmDelete = () => {
      // In a real app, you would show a confirmation dialog
      if (confirm('Bu hesabı silmek istediğinizden emin misiniz?')) {
        deleteAccount()
      }
    }
    
    const deleteAccount = async () => {
      try {
        await accountsStore.deleteAccount(props.id)
        toast.success('Hesap başarıyla silindi.')
        router.push({ name: 'accounts' })
      } catch (error) {
        toast.error('Hesap silinirken bir hata oluştu.')
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
    
    const getAccountTypeLabel = (type) => {
      const typeLabels = {
        'BANK_ACCOUNT': 'Banka Hesabı',
        'CASH_WALLET': 'Nakit Cüzdan',
        'STOCK_ACCOUNT': 'Hisse Senedi Hesabı',
        'INVESTMENT_FUND': 'Yatırım Fonu',
        'BOND_ACCOUNT': 'Tahvil Hesabı',
        'DERIVATIVE_ACCOUNT': 'Türev Hesabı',
        'CRYPTO_EXCHANGE': 'Kripto Borsası',
        'CRYPTO_WALLET': 'Kripto Cüzdan',
        'DEFI_PROTOCOL': 'DeFi Protokolü',
        'NFT_COLLECTION': 'NFT Koleksiyonu',
        'PRECIOUS_METALS': 'Değerli Madenler',
        'REAL_ESTATE': 'Gayrimenkul',
        'DEBT_ACCOUNT': 'Borç Hesabı',
        'RECEIVABLE': 'Alacak'
      }
      
      return typeLabels[type] || type
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
      account,
      assets,
      transactions,
      activeTab,
      goBack,
      openEditDialog,
      confirmDelete,
      formatCurrency,
      formatDate,
      formatPercentage,
      formatAmount,
      getAccountTypeLabel,
      getTransactionTypeLabel
    }
  }
}
</script> 