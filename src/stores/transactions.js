import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const transactions = ref([])
  const transactionTypes = ref([])
  const currentTransaction = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const totalCount = ref(0)
  const toast = useToast()
  
  // Getters
  const monthlyTotals = computed(() => {
    // Group transactions by month
    const grouped = {}
    const now = new Date()
    
    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      grouped[key] = { totalIn: 0, totalOut: 0 }
    }
    
    // Sum transactions by month
    transactions.value.forEach(transaction => {
      const date = new Date(transaction.date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (grouped[key]) {
        if (transaction.isCredit) {
          grouped[key].totalIn += transaction.amount
        } else if (transaction.isDebit) {
          grouped[key].totalOut += transaction.amount
        }
      }
    })
    
    // Convert to array and sort by date
    return Object.entries(grouped)
      .map(([key, value]) => ({
        month: key,
        ...value,
        netAmount: value.totalIn - value.totalOut
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  })
  
  const transactionsByCategory = computed(() => {
    const grouped = {}
    
    transactions.value.forEach(transaction => {
      const category = transaction.category || 'Uncategorized'
      
      if (!grouped[category]) {
        grouped[category] = {
          count: 0,
          total: 0
        }
      }
      
      grouped[category].count++
      if (transaction.isCredit) {
        grouped[category].total += transaction.amount
      } else if (transaction.isDebit) {
        grouped[category].total -= transaction.amount
      }
    })
    
    return grouped
  })
  
  const totalIncome = computed(() => {
    return transactions.value
      .filter(tx => tx.isCredit)
      .reduce((sum, tx) => sum + tx.amount, 0)
  })
  
  const totalExpense = computed(() => {
    return transactions.value
      .filter(tx => tx.isDebit)
      .reduce((sum, tx) => sum + tx.amount, 0)
  })
  
  const netCashflow = computed(() => {
    return totalIncome.value - totalExpense.value
  })
  
  const groupedTransactions = computed(() => {
    const groups = {}
    
    transactions.value.forEach(tx => {
      // Group by date (YYYY-MM-DD)
      const date = tx.date.split('T')[0]
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(tx)
    })
    
    // Sort dates descending
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .reduce((sorted, [date, txs]) => {
        sorted[date] = txs
        return sorted
      }, {})
  })
  
  // Actions
  async function fetchTransactions(params = { limit: 20, offset: 0 }) {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await api.get(`/transactions?${queryParams}`)
      
      // Data will be automatically normalized by axios interceptor
      transactions.value = response.data.transactions || []
      totalCount.value = response.data.total || 0
      
      return {
        transactions: transactions.value,
        total: totalCount.value
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'İşlemler yüklenirken bir hata oluştu.'
      toast.error(error.value)
      return { transactions: [], total: 0 }
    } finally {
      loading.value = false
    }
  }
  
  async function fetchTransactionTypes() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/transactions/types')
      // Data will be automatically normalized by axios interceptor
      transactionTypes.value = response.data.transactionTypes || []
    } catch (err) {
      error.value = err.response?.data?.error || 'İşlem türleri yüklenirken bir hata oluştu.'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchTransactionById(id) {
    loading.value = true
    error.value = null
    currentTransaction.value = null
    
    try {
      const response = await api.get(`/transactions/${id}`)
      // Data will be automatically normalized by axios interceptor
      currentTransaction.value = response.data
      return currentTransaction.value
    } catch (err) {
      error.value = err.response?.data?.error || 'İşlem bilgileri yüklenirken bir hata oluştu.'
      toast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function fetchTransactionsByAccount(accountId, params = { limit: 20, offset: 0 }) {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await api.get(`/transactions/account/${accountId}?${queryParams}`)
      
      // Data will be automatically normalized by axios interceptor
      return {
        transactions: response.data.transactions || [],
        total: response.data.total || 0
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Hesap işlemleri yüklenirken bir hata oluştu.'
      toast.error(error.value)
      return { transactions: [], total: 0 }
    } finally {
      loading.value = false
    }
  }
  
  async function fetchTransactionsByAsset(assetId, params = { limit: 20, offset: 0 }) {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await api.get(`/transactions/asset/${assetId}?${queryParams}`)
      
      // Data will be automatically normalized by axios interceptor
      return {
        transactions: response.data.transactions || [],
        total: response.data.total || 0
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Varlık işlemleri yüklenirken bir hata oluştu.'
      toast.error(error.value)
      return { transactions: [], total: 0 }
    } finally {
      loading.value = false
    }
  }
  
  async function createTransaction(transactionData) {
    loading.value = true
    error.value = null
    
    try {
      // Ensure request matches CreateTransactionRequest structure from backend
      const createTransactionRequest = {
        accountId: transactionData.accountId,
        assetId: transactionData.assetId,
        type: transactionData.type,
        amount: transactionData.amount,
        quantity: transactionData.quantity,
        price: transactionData.price,
        fee: transactionData.fee || 0,
        currency: transactionData.currency,
        description: transactionData.description || '',
        category: transactionData.category || '',
        date: transactionData.date,
        toAccountId: transactionData.toAccountId,
        transactionHash: transactionData.transactionHash
      }
      
      // Remove undefined fields
      Object.keys(createTransactionRequest).forEach(key => 
        createTransactionRequest[key] === undefined && delete createTransactionRequest[key]
      )
      
      const response = await api.post('/transactions', createTransactionRequest)
      
      // Add to transactions array if we have transactions loaded
      if (transactions.value.length > 0) {
        transactions.value.unshift(response.data)
      }
      
      toast.success('İşlem başarıyla oluşturuldu.')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'İşlem oluşturulurken bir hata oluştu.'
      toast.error(error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  async function updateTransaction(id, transactionData) {
    loading.value = true
    error.value = null
    
    try {
      // Ensure request matches UpdateTransactionRequest structure from backend
      const updateTransactionRequest = {
        accountId: transactionData.accountId,
        assetId: transactionData.assetId,
        type: transactionData.type,
        amount: transactionData.amount,
        quantity: transactionData.quantity,
        price: transactionData.price,
        fee: transactionData.fee,
        currency: transactionData.currency,
        description: transactionData.description,
        category: transactionData.category,
        date: transactionData.date,
        toAccountId: transactionData.toAccountId,
        transactionHash: transactionData.transactionHash
      }
      
      // Remove undefined fields
      Object.keys(updateTransactionRequest).forEach(key => 
        updateTransactionRequest[key] === undefined && delete updateTransactionRequest[key]
      )
      
      const response = await api.put(`/transactions/${id}`, updateTransactionRequest)
      
      // Update in the transactions array
      const index = transactions.value.findIndex(tx => tx.id === id)
      if (index !== -1) {
        transactions.value[index] = response.data
      }
      
      // Update currentTransaction if it matches
      if (currentTransaction.value && currentTransaction.value.id === id) {
        currentTransaction.value = response.data
      }
      
      toast.success('İşlem başarıyla güncellendi.')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'İşlem güncellenirken bir hata oluştu.'
      toast.error(error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  async function deleteTransaction(id) {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/transactions/${id}`)
      
      // Remove from the transactions array
      transactions.value = transactions.value.filter(tx => tx.id !== id)
      
      // Clear currentTransaction if it matches
      if (currentTransaction.value && currentTransaction.value.id === id) {
        currentTransaction.value = null
      }
      
      toast.success('İşlem başarıyla silindi.')
    } catch (err) {
      error.value = err.response?.data?.error || 'İşlem silinirken bir hata oluştu.'
      toast.error(error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    transactions,
    transactionTypes,
    currentTransaction,
    loading,
    error,
    totalCount,
    
    // Getters
    monthlyTotals,
    transactionsByCategory,
    totalIncome,
    totalExpense,
    netCashflow,
    groupedTransactions,
    
    // Actions
    fetchTransactions,
    fetchTransactionTypes,
    fetchTransactionById,
    fetchTransactionsByAccount,
    fetchTransactionsByAsset,
    createTransaction,
    updateTransaction,
    deleteTransaction
  }
}) 