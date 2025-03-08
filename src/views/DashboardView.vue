<template>
  <div>
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <template v-else>
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          Merhaba, {{ user?.firstName || 'Kullanıcı' }}!
        </h1>
        <p class="text-gray-600">
          İşte finansal varlıklarınızın genel durumu
        </p>
      </div>
      
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-700">Toplam Varlık Değeri</h3>
            <div class="p-2 bg-green-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="flex items-end">
            <span class="text-3xl font-bold text-gray-900">{{ formatCurrency(totalAssetValue) }}</span>
            <span class="ml-2 text-sm font-medium" :class="profitLossClass">
              {{ formatProfitLoss(totalProfitLoss) }} ({{ formatPercentage(totalProfitLossPercentage) }})
            </span>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-700">Nakit Varlıklar</h3>
            <div class="p-2 bg-blue-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="flex items-end">
            <span class="text-3xl font-bold text-gray-900">{{ formatCurrency(totalCashBalance) }}</span>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-700">Hesap Sayısı</h3>
            <div class="p-2 bg-purple-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
            </div>
          </div>
          <div class="flex items-end">
            <span class="text-3xl font-bold text-gray-900">{{ accounts.length }}</span>
            <span class="ml-2 text-sm text-gray-600">hesap</span>
          </div>
        </div>
      </div>
      
      <!-- Asset Allocation Chart -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-medium text-gray-700 mb-4">Varlık Dağılımı</h2>
        <div class="h-64">
          <AssetAllocationChart :assets="assets" />
        </div>
      </div>
      
      <!-- Recent Transactions -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-700">Son İşlemler</h2>
          <router-link to="/transactions" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            Tümünü Görüntüle
          </router-link>
        </div>
        
        <div class="overflow-x-auto">
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
              <tr v-if="transactions.length === 0">
                <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                  Henüz işlem kaydınız bulunmuyor.
                </td>
              </tr>
              <tr v-for="transaction in transactions.slice(0, 5)" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ transaction.description || getTransactionTypeLabel(transaction.type) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ transaction.category || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="getAmountClass(transaction)">
                  {{ formatAmount(transaction) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Accounts Overview -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-700">Hesaplarınız</h2>
          <router-link to="/accounts" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            Tümünü Görüntüle
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="accounts.length === 0" class="col-span-2 text-center py-8 text-gray-500">
            Henüz hesap eklemediniz. 
            <router-link to="/accounts" class="text-primary-600 hover:text-primary-500">
              Hesap eklemek için tıklayın.
            </router-link>
          </div>
          <div v-for="account in accounts.slice(0, 4)" :key="account.id" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="mr-4 p-3 rounded-full" :class="`bg-${account.color || 'gray-200'}`">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ account.name }}</h3>
                <p class="text-sm text-gray-500">{{ account.institution || getAccountTypeLabel(account.type) }}</p>
              </div>
              <div class="ml-auto text-right">
                <p class="font-bold text-gray-900">{{ formatCurrency(account.balance) }}</p>
                <p class="text-xs text-gray-500">{{ account.currency }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAccountsStore } from '@/stores/accounts'
import { useAssetsStore } from '@/stores/assets'
import { useTransactionsStore } from '@/stores/transactions'
import AssetAllocationChart from '@/components/charts/AssetAllocationChart.vue'

export default {
  name: 'DashboardView',
  components: {
    AssetAllocationChart
  },
  setup() {
    const authStore = useAuthStore()
    const accountsStore = useAccountsStore()
    const assetsStore = useAssetsStore()
    const transactionsStore = useTransactionsStore()
    
    const loading = ref(true)
    
    // Data
    const user = computed(() => authStore.user)
    const accounts = computed(() => accountsStore.accounts)
    const assets = computed(() => assetsStore.assets)
    const transactions = computed(() => transactionsStore.transactions)
    
    // Computed values
    const totalAssetValue = computed(() => assetsStore.totalValue)
    const totalCashBalance = computed(() => {
      return accounts.value
        .filter(account => account.type === 'BANK_ACCOUNT' || account.type === 'CASH_WALLET')
        .reduce((sum, account) => sum + account.balance, 0)
    })
    const totalProfitLoss = computed(() => assetsStore.totalProfitLoss)
    const totalProfitLossPercentage = computed(() => assetsStore.totalProfitLossPercentage)
    
    const profitLossClass = computed(() => {
      if (totalProfitLoss.value > 0) return 'text-green-600'
      if (totalProfitLoss.value < 0) return 'text-red-600'
      return 'text-gray-600'
    })
    
    // Fetch data
    onMounted(async () => {
      loading.value = true
      
      try {
        await Promise.all([
          accountsStore.fetchAccounts(),
          assetsStore.fetchAssets(),
          transactionsStore.fetchTransactions({ limit: 10, offset: 0 })
        ])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        loading.value = false
      }
    })
    
    // Helper functions
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(value)
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('tr-TR')
    }
    
    const formatProfitLoss = (value) => {
      const prefix = value > 0 ? '+' : ''
      return prefix + formatCurrency(value)
    }
    
    const formatPercentage = (value) => {
      const prefix = value > 0 ? '+' : ''
      return `${prefix}${value.toFixed(2)}%`
    }
    
    const formatAmount = (transaction) => {
      if (transaction.isCredit) {
        return `+${formatCurrency(transaction.amount)}`
      } else if (transaction.isDebit) {
        return `-${formatCurrency(transaction.amount)}`
      }
      return formatCurrency(transaction.amount)
    }
    
    const getAmountClass = (transaction) => {
      if (transaction.is_credit) return 'text-green-600'
      if (transaction.is_debit) return 'text-red-600'
      return 'text-gray-900'
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
    
    return {
      user,
      accounts,
      assets,
      transactions,
      loading,
      totalAssetValue,
      totalCashBalance,
      totalProfitLoss,
      totalProfitLossPercentage,
      profitLossClass,
      formatCurrency,
      formatDate,
      formatProfitLoss,
      formatPercentage,
      formatAmount,
      getAmountClass,
      getTransactionTypeLabel,
      getAccountTypeLabel
    }
  }
}
</script> 