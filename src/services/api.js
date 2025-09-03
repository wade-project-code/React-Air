import { 
  airQualityStations, 
  airQualityTrends, 
  waterQualityData, 
  wasteStatistics, 
  stationStatus, 
  noiseData, 
  environmentalIndicators, 
  createApiResponse, 
  createPaginatedResponse 
} from '../data/mockData.js'

// 模擬 API 延遲
const simulateDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 模擬 API 方法
export const apiMethods = {
  // GET 請求模擬
  get: async (endpoint, params = {}) => {
    await simulateDelay()
    
    console.log('Mock API Request:', {
      endpoint,
      params
    })

    // 根據端點返回對應的模擬資料
    switch (endpoint) {
      case '/air-quality':
        return createApiResponse(airQualityStations)
      
      case '/air-quality-trends':
        return createApiResponse(airQualityTrends)
      
      case '/water-quality':
        return createApiResponse(waterQualityData)
      
      case '/waste-statistics':
        return createApiResponse(wasteStatistics)
      
      case '/station-status':
        return createApiResponse(stationStatus)
      
      case '/noise-data':
        return createApiResponse(noiseData)
      
      case '/environmental-indicators':
        return createApiResponse(environmentalIndicators)
      
      default:
        return createApiResponse([], false, '端點不存在')
    }
  },

  // POST 請求模擬
  post: async (endpoint, data = {}) => {
    await simulateDelay()
    return createApiResponse({ message: '模擬 POST 成功', data })
  },

  // PUT 請求模擬
  put: async (endpoint, data = {}) => {
    await simulateDelay()
    return createApiResponse({ message: '模擬 PUT 成功', data })
  },

  // DELETE 請求模擬
  delete: async (endpoint) => {
    await simulateDelay()
    return createApiResponse({ message: '模擬 DELETE 成功' })
  }
}

// 模擬 API 參數
export const MOCK_API_PARAMS = {
  // 預設格式
  format: 'json',
  
  // 預設排序
  sort: 'timestamp desc',
  
  // 預設每頁資料筆數
  limit: 100,
  
  // 預設偏移量
  offset: 0
}

// 模擬 API 端點常數
export const API_ENDPOINTS = {
  // 空氣品質
  AIR_QUALITY: '/air-quality',
  AIR_QUALITY_TRENDS: '/air-quality-trends',
  
  // 水質監測
  WATER_QUALITY: '/water-quality',
  
  // 廢棄物統計
  WASTE_STATISTICS: '/waste-statistics',
  
  // 監測站資訊
  STATION_STATUS: '/station-status',
  
  // 噪音監測
  NOISE_DATA: '/noise-data',
  
  // 綜合環境指標
  ENVIRONMENTAL_INDICATORS: '/environmental-indicators'
}

// 資料處理工具
export const dataProcessors = {
  // 格式化模擬 API 回應資料
  formatResponse: (response) => {
    if (!response || !response.success) {
      return {
        data: [],
        total: 0,
        success: false,
        message: response?.message || '無資料'
      }
    }

    return {
      data: response.data,
      total: Array.isArray(response.data) ? response.data.length : 1,
      success: true,
      message: response.message || '資料載入成功'
    }
  },

  // 過濾有效資料
  filterValidData: (data, requiredFields = []) => {
    if (!Array.isArray(data)) return []
    
    return data.filter(item => {
      return requiredFields.every(field => 
        item[field] !== null && 
        item[field] !== undefined && 
        item[field] !== ''
      )
    })
  },

  // 排序資料
  sortData: (data, sortField, order = 'desc') => {
    if (!Array.isArray(data)) return []
    
    return [...data].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (order === 'desc') {
        return bValue - aValue
      } else {
        return aValue - bValue
      }
    })
  },

  // 根據 AQI 值獲取狀態
  getAQIStatus: (aqi) => {
    if (aqi <= 50) return { status: 'good', color: '#00e400', text: '良好' }
    if (aqi <= 100) return { status: 'moderate', color: '#ffff00', text: '普通' }
    if (aqi <= 150) return { status: 'unhealthy_sensitive', color: '#ff7e00', text: '對敏感族群不健康' }
    if (aqi <= 200) return { status: 'unhealthy', color: '#ff0000', text: '對所有族群不健康' }
    if (aqi <= 300) return { status: 'very_unhealthy', color: '#8f3f97', text: '非常不健康' }
    return { status: 'hazardous', color: '#7e0023', text: '危險' }
  },

  // 根據水質指標獲取狀態
  getWaterQualityStatus: (wqi) => {
    if (wqi >= 8) return { status: 'excellent', color: '#0066cc', text: '優良' }
    if (wqi >= 6) return { status: 'good', color: '#00cc66', text: '良好' }
    if (wqi >= 4) return { status: 'moderate', color: '#ffcc00', text: '普通' }
    return { status: 'poor', color: '#cc0000', text: '不良' }
  }
}

// 預設匯出模擬 API 方法
export default apiMethods