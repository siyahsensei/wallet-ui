<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <section class="pt-16 pb-24 bg-gradient-to-br from-primary-700 to-primary-900 text-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Tüm Finansal Varlıklarınızı Tek Platformda Yönetin
          </h1>
          <p class="text-xl mb-10">
            Wallet ile banka hesaplarınızı, yatırımlarınızı, kripto varlıklarınızı ve diğer tüm finansal varlıklarınızı tek bir yerden izleyin ve yönetin.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <router-link to="/register" class="btn bg-white text-primary-800 hover:bg-gray-100">
              Hemen Başla
            </router-link>
            <router-link to="/login" class="btn bg-transparent border border-white hover:bg-primary-800">
              Giriş Yap
            </router-link>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Özellikler</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Nakit Varlıklar</h3>
            <p class="text-gray-600">
              Banka hesapları ve nakit para varlıklarınızı kolaylıkla takip edin ve yönetin.
            </p>
          </div>
          
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Yatırım Varlıkları</h3>
            <p class="text-gray-600">
              Hisse senetleri, yatırım fonları, tahviller ve diğer yatırım araçlarınızı izleyin.
            </p>
          </div>
          
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Kripto Varlıklar</h3>
            <p class="text-gray-600">
              Bitcoin, Ethereum ve diğer kripto para varlıklarınızın performansını takip edin.
            </p>
          </div>
          
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Diğer Varlıklar</h3>
            <p class="text-gray-600">
              Altın, gayrimenkul ve diğer tüm finansal varlıklarınızı güvenle kaydedin.
            </p>
          </div>
          
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Portföy Analizi</h3>
            <p class="text-gray-600">
              Tüm varlıklarınızın dağılımını ve performansını detaylı grafiklerle analiz edin.
            </p>
          </div>
          
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">API Entegrasyonu</h3>
            <p class="text-gray-600">
              Banka, borsa ve kripto borsası API'leri ile otomatik veri senkronizasyonu.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-6">
            Finansal Özgürlüğünüzü Yönetin
          </h2>
          <p class="text-xl text-gray-600 mb-8">
            Wallet ile tüm finansal varlıklarınızı tek bir platformda yönetmeye hemen başlayın.
          </p>
          <router-link to="/register" class="btn-primary text-base px-6 py-3">
            Hemen Kaydolun
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script> 