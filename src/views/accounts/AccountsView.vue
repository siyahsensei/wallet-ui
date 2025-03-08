<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1>Hesaplar</h1>
      <button @click="openCreateDialog" class="btn-primary">
        <span class="mr-2">+</span> Yeni Hesap
      </button>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <!-- No accounts message -->
    <div v-else-if="accounts.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Henüz hesap eklemediniz</h3>
      <p class="mt-1 text-gray-500">İlk hesabınızı ekleyerek varlıklarınızı yönetmeye başlayın.</p>
      <button @click="openCreateDialog" class="mt-6 btn-primary">
        Hesap Ekle
      </button>
    </div>
    
    <!-- Accounts list -->
    <div v-else>
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Toplam Bakiye</h3>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ formatCurrency(totalBalance) }}</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Hesap Sayısı</h3>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ accounts.length }}</p>
        </div>
      </div>
      
      <!-- Accounts by type -->
      <div v-for="(accounts, type) in groupedAccounts" :key="type" class="mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">{{ getAccountTypeLabel(type) }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="account in accounts" 
            :key="account.id" 
            class="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            @click="goToAccountDetail(account.id)"
          >
            <div class="p-4">
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
              </div>
              <div class="mt-4 flex justify-between items-end">
                <div>
                  <p class="text-xs text-gray-500">Bakiye</p>
                  <p class="text-lg font-bold text-gray-900">{{ formatCurrency(account.balance) }}</p>
                </div>
                <p class="text-xs text-gray-500">{{ account.currency }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Create Account Dialog (simplified for demo) -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">Yeni Hesap Ekle</h2>
        
        <form @submit.prevent="createAccount">
          <div class="mb-4">
            <label for="name" class="form-label">Hesap Adı</label>
            <input id="name" type="text" v-model="form.name" class="form-input" required />
          </div>
          
          <div class="mb-4">
            <label for="type" class="form-label">Hesap Türü</label>
            <select id="type" v-model="form.type" class="form-input" required>
              <option value="">Hesap türü seçin</option>
              <option value="BANK_ACCOUNT">Banka Hesabı</option>
              <option value="CASH_WALLET">Nakit Cüzdan</option>
              <option value="STOCK_ACCOUNT">Hisse Senedi Hesabı</option>
              <option value="INVESTMENT_FUND">Yatırım Fonu</option>
              <option value="CRYPTO_EXCHANGE">Kripto Borsası</option>
              <option value="CRYPTO_WALLET">Kripto Cüzdan</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label for="institution" class="form-label">Kurum</label>
            <input id="institution" type="text" v-model="form.institution" class="form-input" />
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
            <label for="balance" class="form-label">Bakiye</label>
            <input id="balance" type="number" v-model="form.balance" step="0.01" min="0" class="form-input" required />
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" class="btn-outline" @click="showCreateDialog = false">
              İptal
            </button>
            <button type="submit" class="btn-primary" :disabled="creating">
              {{ creating ? 'Ekleniyor...' : 'Hesap Ekle' }}
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
import { useAccountsStore } from '@/stores/accounts'
import { useToast } from 'vue-toastification'

export default {
  name: 'AccountsView',
  setup() {
    const router = useRouter()
    const accountsStore = useAccountsStore()
    const toast = useToast()
    
    const loading = ref(true)
    const creating = ref(false)
    const showCreateDialog = ref(false)
    
    const form = ref({
      name: '',
      type: '',
      institution: '',
      currency: 'TRY',
      balance: 0,
      description: '',
      isManual: true
    })
    
    // Get accounts and computed values from store
    const accounts = computed(() => accountsStore.accounts)
    const totalBalance = computed(() => accountsStore.totalBalance)
    const groupedAccounts = computed(() => accountsStore.groupedAccounts)
    
    onMounted(async () => {
      loading.value = true
      try {
        await accountsStore.fetchAccounts()
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      } finally {
        loading.value = false
      }
    })
    
    const openCreateDialog = () => {
      showCreateDialog.value = true
    }
    
    const createAccount = async () => {
      creating.value = true
      
      try {
        const newAccount = await accountsStore.createAccount({
          ...form.value,
          balance: parseFloat(form.value.balance)
        })
        
        showCreateDialog.value = false
        toast.success('Hesap başarıyla oluşturuldu')
        
        // Reset form
        form.value = {
          name: '',
          type: '',
          institution: '',
          currency: 'TRY',
          balance: 0,
          description: '',
          isManual: true
        }
        
        // Navigate to the new account
        router.push({ name: 'account-detail', params: { id: newAccount.id } })
      } catch (error) {
        toast.error('Hesap oluşturulurken bir hata oluştu')
      } finally {
        creating.value = false
      }
    }
    
    const goToAccountDetail = (id) => {
      router.push({ name: 'account-detail', params: { id } })
    }
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(value)
    }
    
    const getAccountTypeLabel = (type) => {
      const typeLabels = {
        'BANK_ACCOUNT': 'Banka Hesapları',
        'CASH_WALLET': 'Nakit Cüzdanlar',
        'STOCK_ACCOUNT': 'Hisse Senedi Hesapları',
        'INVESTMENT_FUND': 'Yatırım Fonları',
        'BOND_ACCOUNT': 'Tahvil Hesapları',
        'DERIVATIVE_ACCOUNT': 'Türev Hesapları',
        'CRYPTO_EXCHANGE': 'Kripto Borsaları',
        'CRYPTO_WALLET': 'Kripto Cüzdanlar',
        'DEFI_PROTOCOL': 'DeFi Protokolleri',
        'NFT_COLLECTION': 'NFT Koleksiyonları',
        'PRECIOUS_METALS': 'Değerli Madenler',
        'REAL_ESTATE': 'Gayrimenkuller',
        'DEBT_ACCOUNT': 'Borç Hesapları',
        'RECEIVABLE': 'Alacaklar'
      }
      
      return typeLabels[type] || type
    }
    
    return {
      loading,
      creating,
      accounts,
      totalBalance,
      groupedAccounts,
      showCreateDialog,
      form,
      openCreateDialog,
      createAccount,
      goToAccountDetail,
      formatCurrency,
      getAccountTypeLabel
    }
  }
}
</script> 