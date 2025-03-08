<template>
  <div>
    <Doughnut v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-gray-500">
      Grafik için veri bulunamadı
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

export default {
  name: 'AssetAllocationChart',
  components: {
    Doughnut
  },
  props: {
    assets: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    // Group assets by type and calculate total value for each type
    const chartData = computed(() => {
      const groupedData = {}
      const backgroundColors = [
        '#0284c7', // primary-600
        '#7c3aed', // secondary-600
        '#ea580c', // orange-600
        '#059669', // emerald-600
        '#d97706', // amber-600
        '#dc2626', // red-600
        '#2563eb', // blue-600
        '#7e22ce', // purple-600
        '#be123c', // rose-600
        '#4d7c0f', // lime-600
        '#0f766e', // teal-600
        '#4b5563'  // gray-600
      ]
      
      // Group by asset type
      props.assets.forEach(asset => {
        const type = asset.type
        if (!groupedData[type]) {
          groupedData[type] = 0
        }
        groupedData[type] += asset.currentValue
      })
      
      // Convert to chart.js format
      const labels = []
      const data = []
      const colors = []
      
      Object.entries(groupedData)
        .sort((a, b) => b[1] - a[1]) // Sort by value (descending)
        .forEach(([type, value], index) => {
          // Get human-readable type label
          const typeLabel = getAssetTypeLabel(type)
          
          labels.push(typeLabel)
          data.push(value)
          colors.push(backgroundColors[index % backgroundColors.length])
        })
      
      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            hoverBackgroundColor: colors.map(color => `${color}dd`),
            borderWidth: 1
          }
        ]
      }
    })
    
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 20,
            boxWidth: 12,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ''
              const value = context.raw || 0
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0
              
              return `${label}: ${formatCurrency(value)} (${percentage}%)`
            }
          }
        }
      }
    }
    
    // Helper functions
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(value)
    }
    
    const getAssetTypeLabel = (type) => {
      const typeLabels = {
        'CASH': 'Nakit',
        'TERM_DEPOSIT': 'Vadeli Mevduat',
        'STOCK': 'Hisse Senedi',
        'ETF': 'ETF',
        'FUND': 'Fon',
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
    
    return {
      chartData,
      chartOptions
    }
  }
}
</script> 