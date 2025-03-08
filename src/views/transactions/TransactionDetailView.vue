<template>
  <div>
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <template v-else-if="transaction">
      <!-- Header with back button and actions -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <button @click="goBack" class="mr-4 p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <h1>İşlem Detayları</h1>
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
      
      <!-- Transaction details -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center mb-6 md:mb-0">
            <div class="p-4 rounded-full mr-4" :class="getTypeColorClass(transaction.type)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-semibold">{{ getTransactionTypeLabel(transaction.type) }}</h2>
              <div class="text-gray-600">
                {{ transaction.description || 'İşlem açıklaması yok' }}
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500">Tutar</p>
            <p 
              class="text-2xl font-bold"
              :class="transaction.isCredit ? 'text-green-600' : transaction.isDebit ? 'text-red-600' : 'text-gray-900'"
            >
              {{ formatAmount(transaction) }}
            </p>
          </div>
        </div>
        
        <div class="mt-8 border-t border-gray-100 pt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-500">Hesap</p>
              <p class="font-medium">{{ getAccountName(transaction.accountId) }}</p>
            </div>
            
            <div v-if="transaction.toAccountId">
              <p class="text-sm text-gray-500">Hedef Hesap</p>
              <p class="font-medium">{{ getAccountName(transaction.toAccountId) }}</p>
            </div>
            
            <div v-if="transaction.assetId">
              <p class="text-sm text-gray-500">Varlık</p>
              <p class="font-medium">{{ getAssetName(transaction.assetId) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Tarih</p>
              <p class="font-medium">{{ formatDate(transaction.date) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Kategori</p>
              <p class="font-medium">{{ transaction.category || '-' }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Para Birimi</p>
              <p class="font-medium">{{ transaction.currency }}</p>
            </div>
            
            <div v-if="transaction.quantity">
              <p class="text-sm text-gray-500">Miktar</p>
              <p class="font-medium">{{ transaction.quantity }}</p>
            </div>
            
            <div v-if="transaction.price">
              <p class="text-sm text-gray-500">Fiyat</p>
              <p class="font-medium">{{ formatCurrency(transaction.price) }}</p>
            </div>
            
            <div v-if="transaction.fee > 0">
              <p class="text-sm text-gray-500">İşlem Ücreti</p>
              <p class="font-medium">{{ formatCurrency(transaction.fee) }}</p>
            </div>
            
            <div v-if="transaction.transactionHash">
              <p class="text-sm text-gray-500">İşlem Kodu</p>
              <p class="font-medium">{{ transaction.transactionHash }}</p>
            </div>
            
            <div class="md:col-span-2 lg:col-span-3">
              <p class="text-sm text-gray-500">Açıklama</p>
              <p class="font-medium">{{ transaction.description || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Edit Transaction Dialog (hidden in this simplified version) -->
      <!-- Delete Confirmation Dialog (hidden in this simplified version) -->
    </template>
    
    <div v-else-if="!loading" class="text-center py-12">
      <p class="text-lg text-gray-700">İşlem bulunamadı.</p>
      <button @click="goBack" class="mt-4 btn-primary">
        İşlemlere Dön
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useTransactionsStore } from '@/stores/transactions'
import { useAccountsStore } from '@/stores/accounts'
import { useAssetsStore } from '@/stores/assets'

export default {
  name: 'TransactionDetailView',
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
    
    const transactionsStore = useTransactionsStore()
    const accountsStore = useAccountsStore()
    const assetsStore = useAssetsStore()
    
    const loading = ref(true)
    
    const transaction = computed(() => transactionsStore.currentTransaction)
    const accounts = computed(() => accountsStore.accounts)
    const assets = computed(() => assetsStore.assets)
    
    onMounted(async () => {
      loading.value = true
      
      try {
        // Load all accounts and assets (needed for names)
        if (accountsStore.accounts.length === 0) {
          await accountsStore.fetchAccounts()
        }
        
        if (assetsStore.assets.length === 0) {
          await assetsStore.fetchAssets()
        }
        
        // Load transaction details
        await transactionsStore.fetchTransactionById(props.id)
      } catch (error) {
        console.error('Failed to fetch transaction details:', error)
      } finally {
        loading.value = false
      }
    })
    
    const goBack = () => {
      router.push({ name: 'transactions' })
    }
    
    const openEditDialog = () => {
      // In a real app, you would show an edit dialog
      toast.info('Düzenleme özelliği bu demo\'da aktif değil.')
    }
    
    const confirmDelete = () => {
      // In a real app, you would show a confirmation dialog
      if (confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
        deleteTransaction()
      }
    }
    
    const deleteTransaction = async () => {
      try {
        await transactionsStore.deleteTransaction(props.id)
        toast.success('İşlem başarıyla silindi.')
        router.push({ name: 'transactions' })
      } catch (error) {
        toast.error('İşlem silinirken bir hata oluştu.')
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
    
    const formatAmount = (transaction) => {
      if (transaction.isCredit) {
        return `+${formatCurrency(transaction.amount)}`
      } else if (transaction.isDebit) {
        return `-${formatCurrency(transaction.amount)}`
      }
      return formatCurrency(transaction.amount)
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
    
    const getTypeColorClass = (type) => {
      const typeColors = {
        'DEPOSIT': 'bg-green-600',
        'WITHDRAWAL': 'bg-red-600',
        'TRANSFER': 'bg-blue-600',
        'BUY': 'bg-purple-600',
        'SELL': 'bg-indigo-600',
        'DIVIDEND': 'bg-green-600',
        'INTEREST': 'bg-green-600',
        'FEE': 'bg-red-600',
        'INCOME': 'bg-green-600',
        'EXPENSE': 'bg-red-600',
        'TAX': 'bg-red-600',
        'REBALANCE': 'bg-blue-600',
        'SPLIT': 'bg-blue-600',
        'MERGER': 'bg-blue-600',
        'STAKING': 'bg-green-600',
        'MINING': 'bg-green-600',
        'AIRDROP': 'bg-green-600',
        'LENDING': 'bg-orange-600',
        'BORROWING': 'bg-red-600',
        'REPAYMENT': 'bg-orange-600'
      }
      
      return typeColors[type] || 'bg-gray-600'
    }
    
    const getAccountName = (accountId) => {
      if (!accountId) return '-'
      const account = accounts.value.find(a => a.id === accountId)
      return account ? account.name : 'Bilinmeyen Hesap'
    }
    
    const getAssetName = (assetId) => {
      if (!assetId) return '-'
      const asset = assets.value.find(a => a.id === assetId)
      return asset ? asset.name : 'Bilinmeyen Varlık'
    }
    
    return {
      loading,
      transaction,
      goBack,
      openEditDialog,
      confirmDelete,
      formatCurrency,
      formatDate,
      formatAmount,
      getTransactionTypeLabel,
      getTypeColorClass,
      getAccountName,
      getAssetName
    }
  }
}
</script> 