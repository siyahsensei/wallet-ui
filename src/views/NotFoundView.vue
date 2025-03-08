<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <h1 class="text-9xl font-extrabold text-primary-600">404</h1>
      <h2 class="text-3xl font-bold text-gray-900 mt-4">Sayfa Bulunamadı</h2>
      <p class="mt-2 text-lg text-gray-600">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <div class="mt-8">
        <router-link to="/" class="btn-primary">
          Ana Sayfaya Dön
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script> 