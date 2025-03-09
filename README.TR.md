# Wallet UI - Finansal Varlık Yönetimi Arayüzü

Bu proje, Wallet API'sine bağlanan Vue 3 tabanlı bir web arayüzüdür. Kullanıcıların finansal varlıklarını (banka hesapları, hisse senetleri, kripto paralar vb.) yönetmelerini sağlar.

## Özellikler

- Kullanıcı kimlik doğrulama (giriş/kayıt)
- Dashboard ile genel bakış
- Hesap yönetimi (banka hesapları, yatırım hesapları, kripto cüzdanlar vb.)
- Varlık yönetimi (hisse senetleri, kripto paralar, altın vb.)
- İşlem kaydı ve takibi
- Varlık dağılımı ve performans grafikleri
- Responsive tasarım

## Teknolojiler

- Vue 3 (Composition API)
- Vue Router
- Pinia (Durum yönetimi)
- Axios
- Chart.js
- Tailwind CSS

## Kurulum

### Gereksinimler

- Node.js (v14+)
- NPM veya Yarn

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
cd ui
npm install
# veya
yarn install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

3. Tarayıcınızı açın ve http://localhost:5173 adresine gidin.

API sunucusu http://localhost:8080 üzerinde çalışıyor olmalıdır.

## Yapı

```
ui/
├── public/            # Statik dosyalar
├── src/
│   ├── assets/        # CSS, resimler vb.
│   │   ├── charts/    # Görselleştirme bileşenleri
│   │   ├── forms/     # Form bileşenleri
│   │   └── layout/    # Düzen bileşenleri (header, footer, vb.)
│   ├── router/        # Vue Router yapılandırması
│   ├── services/      # API bağlantıları
│   ├── stores/        # Pinia durum yönetimi
│   ├── views/         # Sayfa bileşenleri
│   │   ├── auth/      # Kimlik doğrulama sayfaları
│   │   ├── accounts/  # Hesap yönetimi sayfaları
│   │   ├── assets/    # Varlık yönetimi sayfaları
│   │   └── transactions/ # İşlem sayfaları
│   ├── App.vue        # Kök bileşen
│   └── main.js        # Uygulama başlangıç noktası
├── index.html         # Ana HTML dosyası
├── package.json       # Proje bağımlılıkları ve komutları
└── vite.config.js     # Vite yapılandırması
```

## API İstekleri

Uygulama, Vite dev sunucusu proxy ayarları sayesinde API isteklerini Backend sunucusuna yönlendirir. Bu yapılandırma, CORS sorunlarını önler ve geliştirme sürecini kolaylaştırır.

API istekleri şu pattern'leri takip eder:
- `/api/v1/auth/*` - Kimlik doğrulama işlemleri
- `/api/v1/accounts/*` - Hesap yönetimi
- `/api/v1/assets/*` - Varlık yönetimi
- `/api/v1/transactions/*` - İşlem yönetimi

## Uygulamayı Derleme

Üretim ortamı için uygulamayı derlemek:

```bash
npm run build
# veya
yarn build
```

Bu komut, projeyi `/dist` klasörüne derler. Bu klasördeki dosyalar, herhangi bir statik dosya sunucusuna dağıtılabilir.

## Docker ile Çalıştırma

Ana projede bulunan `docker-compose.yml` dosyası, API ve UI'ı birlikte çalıştırmak için yapılandırılmıştır. Uygulama Docker ile şu şekilde çalıştırılabilir:

```bash
docker-compose up --build
```

## İletişim

Sorularınız veya önerileriniz için: [e-posta adresi] 