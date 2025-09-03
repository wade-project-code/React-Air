import { apiMethods, MOCK_API_PARAMS, API_ENDPOINTS, dataProcessors } from './api'

// 廢棄物統計模擬 API 服務
export const wasteAPI = {
  
  // 獲取廢棄物統計資料
  getWasteStatistics: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.WASTE_STATISTICS, params)
      const processed = dataProcessors.formatResponse(response)
      
      return processed
    } catch (error) {
      console.error('獲取廢棄物統計資料失敗:', error)
      throw error
    }
  },

  // 獲取每月廢棄物統計資料
  getMonthlyStatistics: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.WASTE_STATISTICS, params)
      const processed = dataProcessors.formatResponse(response)
      
      if (processed.success) {
        return {
          ...processed,
          data: processed.data.monthly || []
        }
      }
      
      return processed
    } catch (error) {
      console.error('獲取每月廢棄物統計資料失敗:', error)
      throw error
    }
  },

  // 獲取區域廢棄物統計資料
  getRegionalStatistics: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.WASTE_STATISTICS, params)
      const processed = dataProcessors.formatResponse(response)
      
      if (processed.success) {
        return {
          ...processed,
          data: processed.data.byRegion || []
        }
      }
      
      return processed
    } catch (error) {
      console.error('獲取區域廢棄物統計資料失敗:', error)
      throw error
    }
  },

  // 獲取特定縣市的廢棄物資料
  getWasteByRegion: async (region, params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.WASTE_STATISTICS, params)
      const processed = dataProcessors.formatResponse(response)
      
      if (processed.success && processed.data.byRegion) {
        const regionData = processed.data.byRegion.filter(item => 
          item.region === region
        )
        return {
          ...processed,
          data: regionData
        }
      }
      
      return processed
    } catch (error) {
      console.error(`獲取 ${region} 廢棄物資料失敗:`, error)
      throw error
    }
  }
}

// 廢棄物資料處理工具
export const wasteUtils = {
  
  // 廢棄物類型分類
  getWasteType: (wasteCategory) => {
    const types = {
      'household': {
        label: '家戶垃圾',
        color: '#52c41a',
        icon: 'home'
      },
      'commercial': {
        label: '事業廢棄物',
        color: '#1890ff',
        icon: 'shop'
      },
      'industrial': {
        label: '工業廢棄物',
        color: '#fa8c16',
        icon: 'build'
      },
      'hazardous': {
        label: '有害廢棄物',
        color: '#f5222d',
        icon: 'warning'
      },
      'recyclable': {
        label: '資源回收',
        color: '#52c41a',
        icon: 'recycle'
      },
      'organic': {
        label: '廚餘',
        color: '#a0d911',
        icon: 'leaf'
      }
    }
    
    return types[wasteCategory] || {
      label: '其他',
      color: '#d9d9d9',
      icon: 'question'
    }
  },

  // 計算回收率
  calculateRecyclingRate: (recycled, total) => {
    if (!total || total === 0) return 0
    return Math.round((recycled / total) * 10000) / 100 // 保留兩位小數
  },

  // 計算人均產生量
  calculatePerCapita: (totalWaste, population) => {
    if (!population || population === 0) return 0
    return Math.round((totalWaste / population) * 100) / 100 // kg/人/日
  },

  // 格式化廢棄物統計資料
  formatWasteStatistics: (data) => {
    if (!data) return null

    return {
      county: data.county,
      year: parseInt(data.year),
      population: parseInt(data.population) || 0,
      statistics: {
        household: {
          generated: parseFloat(data.household_generated) || 0,
          recycled: parseFloat(data.household_recycled) || 0,
          disposed: parseFloat(data.household_disposed) || 0
        },
        commercial: {
          generated: parseFloat(data.commercial_generated) || 0,
          recycled: parseFloat(data.commercial_recycled) || 0,
          disposed: parseFloat(data.commercial_disposed) || 0
        },
        total: {
          generated: parseFloat(data.total_generated) || 0,
          recycled: parseFloat(data.total_recycled) || 0,
          disposed: parseFloat(data.total_disposed) || 0
        }
      },
      recyclingRate: wasteUtils.calculateRecyclingRate(
        parseFloat(data.total_recycled) || 0,
        parseFloat(data.total_generated) || 0
      ),
      perCapitaGenerated: wasteUtils.calculatePerCapita(
        parseFloat(data.total_generated) || 0,
        parseInt(data.population) || 1
      )
    }
  },

  // 按年度分組資料
  groupByYear: (data) => {
    const grouped = {}
    
    data.forEach(item => {
      const year = item.year || new Date().getFullYear()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(wasteUtils.formatWasteStatistics(item))
    })
    
    return grouped
  },

  // 按縣市分組資料
  groupByCounty: (data) => {
    const grouped = {}
    
    data.forEach(item => {
      const county = item.county || '未知'
      if (!grouped[county]) {
        grouped[county] = []
      }
      grouped[county].push(wasteUtils.formatWasteStatistics(item))
    })
    
    return grouped
  },

  // 計算趨勢
  calculateTrend: (data, field) => {
    if (!data || data.length < 2) return { trend: 'stable', change: 0 }
    
    // 按年度排序
    const sorted = data.sort((a, b) => a.year - b.year)
    const latest = sorted[sorted.length - 1]
    const previous = sorted[sorted.length - 2]
    
    const latestValue = latest.statistics?.[field] || 0
    const previousValue = previous.statistics?.[field] || 0
    
    if (previousValue === 0) return { trend: 'stable', change: 0 }
    
    const changePercent = ((latestValue - previousValue) / previousValue) * 100
    
    let trend = 'stable'
    if (changePercent > 5) trend = 'increasing'
    else if (changePercent < -5) trend = 'decreasing'
    
    return {
      trend,
      change: Math.round(changePercent * 100) / 100
    }
  },

  // 獲取回收率等級
  getRecyclingRateLevel: (rate) => {
    if (rate >= 60) {
      return {
        level: 'excellent',
        label: '優秀',
        color: '#52c41a',
        description: '回收表現優異'
      }
    } else if (rate >= 45) {
      return {
        level: 'good',
        label: '良好',
        color: '#a0d911',
        description: '回收表現良好'
      }
    } else if (rate >= 30) {
      return {
        level: 'average',
        label: '一般',
        color: '#faad14',
        description: '回收表現一般'
      }
    } else {
      return {
        level: 'poor',
        label: '待改善',
        color: '#f5222d',
        description: '回收表現有待改善'
      }
    }
  },

  // 產生統計摘要
  generateSummary: (data) => {
    if (!data || data.length === 0) return null

    const totalGenerated = data.reduce((sum, item) => 
      sum + (item.statistics?.total?.generated || 0), 0)
    const totalRecycled = data.reduce((sum, item) => 
      sum + (item.statistics?.total?.recycled || 0), 0)
    const totalPopulation = data.reduce((sum, item) => 
      sum + (item.population || 0), 0)

    const avgRecyclingRate = totalGenerated > 0 ? 
      (totalRecycled / totalGenerated) * 100 : 0
    const avgPerCapita = totalPopulation > 0 ? 
      totalGenerated / totalPopulation : 0

    return {
      totalGenerated: Math.round(totalGenerated * 100) / 100,
      totalRecycled: Math.round(totalRecycled * 100) / 100,
      avgRecyclingRate: Math.round(avgRecyclingRate * 100) / 100,
      avgPerCapita: Math.round(avgPerCapita * 100) / 100,
      totalCounties: data.length,
      recyclingLevel: wasteUtils.getRecyclingRateLevel(avgRecyclingRate)
    }
  }
}

export default wasteAPI