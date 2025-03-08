<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1>İşlemler</h1>
      <button @click="openCreateDialog" class="btn-primary">
        <span class="mr-2">+</span> Yeni İşlem
      </button>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <!-- No transactions message -->
    <div v-else-if="transactions.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Henüz işlem kaydınız bulunmuyor</h3>
      <p class="mt-1 text-gray-500">İlk işleminizi ekleyerek finansal hareketlerinizi takip etmeye başlayın.</p>
      <button @click="openCreateDialog" class="mt-6 btn-primary">
        İşlem Ekle
      </button>
    </div>
    
    <!-- Transactions content -->
    <div v-else>
      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="account-filter" class="form-label">Hesap</label>
            <select id="account-filter" v-model="filters.accountId" class="form-input">
              <option value="">Tüm Hesaplar</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="type-filter" class="form-label">İşlem Tipi</label>
            <select id="type-filter" v-model="filters.type" class="form-input">
              <option value="">Tüm İşlemler</option>
              <option value="DEPOSIT">Para Yatırma</option>
              <option value="WITHDRAWAL">Para Çekme</option>
              <option value="TRANSFER">Transfer</option>
              <option value="BUY">Satın Alma</option>
              <option value="SELL">Satış</option>
              <option value="DIVIDEND">Temettü</option>
              <option value="INTEREST">Faiz</option>
            </select>
          </div>
          
          <div>
            <label for="date-from" class="form-label">Başlangıç Tarihi</label>
            <input type="date" id="date-from" v-model="filters.dateFrom" class="form-input" />
          </div>
          
          <div>
            <label for="date-to" class="form-label">Bitiş Tarihi</label>
            <input type="date" id="date-to" v-model="filters.dateTo" class="form-input" />
          </div>
        </div>
      </div>
      
      <!-- Monthly Transactions Chart -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h2 class="text-lg font-medium mb-4">Aylık İşlem Özeti</h2>
        <div class="h-64">
          <!-- Chart component would go here in a real app -->
          <div class="h-full flex items-center justify-center text-gray-500">
            Grafik bileşeni bu demo'da mevcut değil
          </div>
        </div>
      </div>
      
      <!-- Transactions table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Tüm İşlemler</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlem
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hesap
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="transaction in filteredTransactions" 
                :key="transaction.id" 
                class="hover:bg-gray-50 cursor-pointer"
                @click="goToTransactionDetail(transaction.id)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(transaction.date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ getTransactionTypeLabel(transaction.type) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getAccountName(transaction.accountId) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ transaction.category || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ transaction.description || '-' }}</div>
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
          
          <!-- Pagination -->
          <div class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div class="flex-1 flex justify-between items-center">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                :class="currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-800'"
                class="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium bg-white"
              >
                Önceki
              </button>
              <span class="text-sm text-gray-700">
                Sayfa {{ currentPage }} / {{ totalPages }}
              </span>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages || totalPages === 0"
                :class="currentPage === totalPages || totalPages === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-800'"
                class="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium bg-white"
              >
                Sonraki
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Create Transaction Dialog (simplified for demo) -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h2 class="text-xl font-bold mb-4">Yeni İşlem Ekle</h2>
        
        <form @submit.prevent="createTransaction">
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
            <label for="type" class="form-label">İşlem Tipi</label>
            <select id="type" v-model="form.type" class="form-input" required>
              <option value="">İşlem tipi seçin</option>
              <option value="DEPOSIT">Para Yatırma</option>
              <option value="WITHDRAWAL">Para Çekme</option>
              <option value="TRANSFER">Transfer</option>
              <option value="BUY">Satın Alma</option>
              <option value="SELL">Satış</option>
              <option value="DIVIDEND">Temettü</option>
              <option value="INTEREST">Faiz</option>
              <option value="FEE">Ücret</option>
              <option value="INCOME">Gelir</option>
              <option value="EXPENSE">Gider</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label for="amount" class="form-label">Tutar</label>
            <input id="amount" type="number" v-model="form.amount" step="0.01" min="0" class="form-input" required />
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
            <label for="description" class="form-label">Açıklama</label>
            <input id="description" type="text" v-model="form.description" class="form-input" />
          </div>
          
          <div class="mb-4">
            <label for="category" class="form-label">Kategori</label>
            <input id="category" type="text" v-model="form.category" class="form-input" />
          </div>
          
          <div class="mb-4">
            <label for="date" class="form-label">Tarih</label>
            <input id="date" type="date" v-model="form.date" class="form-input" required />
          </div>
          
          <div v-if="form.type === 'TRANSFER'" class="mb-4">
            <label for="to-account" class="form-label">Hedef Hesap</label>
            <select id="to-account" v-model="form.toAccountId" class="form-input" required>
              <option value="">Hesap seçin</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" class="btn-outline" @click="showCreateDialog = false">
              İptal
            </button>
            <button type="submit" class="btn-primary" :disabled="creating">
              {{ creating ? 'Ekleniyor...' : 'İşlem Ekle' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionsStore } from '@/stores/transactions'
import { useAccountsStore } from '@/stores/accounts'
import { useToast } from 'vue-toastification'

export default {
  name: 'TransactionsView',
  setup() {
    const router = useRouter()
    const transactionsStore = useTransactionsStore()
    const accountsStore = useAccountsStore()
    const toast = useToast()
    
    const loading = ref(true)
    const creating = ref(false)
    const showCreateDialog = ref(false)
    const currentPage = ref(1)
    const pageSize = 20
    
    const form = ref({
      accountId: '',
      type: '',
      amount: '',
      currency: 'TRY',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      toAccountId: '',
      assetId: '',
      quantity: '',
      price: ''
    })
    
    const filters = ref({
      accountId: '',
      type: '',
      dateFrom: '',
      dateTo: ''
    })
    
    // Get transactions, accounts from stores
    const transactions = computed(() => transactionsStore.transactions)
    const accounts = computed(() => accountsStore.accounts)
    
    // Filtered transactions based on current filters
    const filteredTransactions = computed(() => {
      let result = [...transactions.value]
      
      if (filters.value.accountId) {
        result = result.filter(t => t.accountId === filters.value.accountId)
      }
      
      if (filters.value.type) {
        result = result.filter(t => t.type === filters.value.type)
      }
      
      if (filters.value.dateFrom) {
        const fromDate = new Date(filters.value.dateFrom)
        result = result.filter(t => new Date(t.date) >= fromDate)
      }
      
      if (filters.value.dateTo) {
        const toDate = new Date(filters.value.dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        result = result.filter(t => new Date(t.date) <= toDate)
      }
      
      return result
    })
    
    // Pagination
    const totalPages = computed(() => {
      return Math.ceil(filteredTransactions.value.length / pageSize)
    })
    
    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      const end = start + pageSize
      return filteredTransactions.value.slice(start, end)
    })
    
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }
    
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }
    
    // Reset pagination when filters change
    watch(filters, () => {
      currentPage.value = 1
    })
    
    onMounted(async () => {
      loading.value = true
      try {
        // Load transactions and accounts in parallel
        await Promise.all([
          transactionsStore.fetchTransactions(),
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
    
    const createTransaction = async () => {
      creating.value = true
      
      try {
        const transactionData = {
          accountId: form.value.accountId,
          type: form.value.type,
          amount: parseFloat(form.value.amount),
          currency: form.value.currency,
          description: form.value.description,
          category: form.value.category,
          date: form.value.date
        }
        
        // Add transfer-specific fields
        if (form.value.type === 'TRANSFER' && form.value.toAccountId) {
          transactionData.toAccountId = form.value.toAccountId
        }
        
        // Add asset-specific fields
        if ((form.value.type === 'BUY' || form.value.type === 'SELL') && form.value.assetId) {
          transactionData.assetId = form.value.assetId
          
          if (form.value.quantity) {
            transactionData.quantity = parseFloat(form.value.quantity)
          }
          
          if (form.value.price) {
            transactionData.price = parseFloat(form.value.price)
          }
        }
        
        const newTransaction = await transactionsStore.createTransaction(transactionData)
        
        showCreateDialog.value = false
        toast.success('İşlem başarıyla oluşturuldu')
        
        // Reset form
        form.value = {
          accountId: '',
          type: '',
          amount: '',
          currency: 'TRY',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          toAccountId: '',
          assetId: '',
          quantity: '',
          price: ''
        }
        
        // Navigate to the new transaction
        router.push({ name: 'transaction-detail', params: { id: newTransaction.id } })
      } catch (error) {
        toast.error('İşlem oluşturulurken bir hata oluştu')
      } finally {
        creating.value = false
      }
    }
    
    const goToTransactionDetail = (id) => {
      router.push({ name: 'transaction-detail', params: { id } })
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
    
    const getAccountName = (accountId) => {
      const account = accounts.value.find(a => a.id === accountId)
      return account ? account.name : 'Bilinmeyen Hesap'
    }
    
    return {
      loading,
      creating,
      transactions: paginatedTransactions,
      filteredTransactions: paginatedTransactions, // Use paginated transactions
      accounts,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      showCreateDialog,
      form,
      filters,
      openCreateDialog,
      createTransaction,
      goToTransactionDetail,
      formatCurrency,
      formatDate,
      formatAmount,
      getTransactionTypeLabel,
      getAccountName
    }
  }
}
</script> 