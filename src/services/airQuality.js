import { apiMethods, MOCK_API_PARAMS, API_ENDPOINTS, dataProcessors } from './api'

// 空氣品質模擬 API 服務
export const airQualityAPI = {
  
  // 獲取即時空氣品質資料
  getCurrentAirQuality: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.AIR_QUALITY, params)
      const processed = dataProcessors.formatResponse(response)
      
      // 過濾有效的空氣品質資料
      if (processed.success && processed.data.length > 0) {
        processed.data = dataProcessors.filterValidData(processed.data, [
          'name', 'county', 'aqi'
        ])
      }
      
      return processed
    } catch (error) {
      console.error('獲取空氣品質資料失敗:', error)
      throw error
    }
  },

  // 獲取特定縣市的空氣品質資料
  getAirQualityByCounty: async (county, params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.AIR_QUALITY, params)
      const processed = dataProcessors.formatResponse(response)
      
      // 從模擬資料中過濾特定縣市
      if (processed.success) {
        processed.data = processed.data.filter(station => 
          station.county === county
        )
      }
      
      return processed
    } catch (error) {
      console.error(`獲取 ${county} 空氣品質資料失敗:`, error)
      throw error
    }
  },

  // 獲取特定測站的空氣品質資料
  getAirQualityBySite: async (siteName, params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.AIR_QUALITY, params)
      const processed = dataProcessors.formatResponse(response)
      
      // 從模擬資料中過濾特定測站
      if (processed.success) {
        processed.data = processed.data.filter(station => 
          station.name === siteName
        )
      }
      
      return processed
    } catch (error) {
      console.error(`獲取 ${siteName} 測站資料失敗:`, error)
      throw error
    }
  },

  // 獲取空氣品質監測站基本資訊
  getAirQualityStations: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.AIR_QUALITY, params)
      return dataProcessors.formatResponse(response)
    } catch (error) {
      console.error('獲取監測站資訊失敗:', error)
      throw error
    }
  },

  // 獲取空氣品質趨勢資料
  getAirQualityTrends: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.AIR_QUALITY_TRENDS, params)
      return dataProcessors.formatResponse(response)
    } catch (error) {
      console.error('獲取空氣品質趨勢資料失敗:', error)
      throw error
    }
  }
}

// 空氣品質資料處理工具
export const airQualityUtils = {
  
  // AQI 等級分類
  getAQILevel: (aqi) => {
    const aqiValue = parseInt(aqi)
    
    if (aqiValue <= 50) {
      return {
        level: 'good',
        label: '良好',
        color: '#52c41a',
        description: '空氣品質令人滿意，基本無空氣污染'
      }
    } else if (aqiValue <= 100) {
      return {
        level: 'moderate',
        label: '普通',
        color: '#faad14',
        description: '空氣品質可接受，但某些污染物可能對極少數異常敏感人群健康有較弱影響'
      }
    } else if (aqiValue <= 150) {
      return {
        level: 'unhealthy_sensitive',
        label: '對敏感族群不健康',
        color: '#fa8c16',
        description: '易感人群症狀進一步加劇，可能對健康人群的心臟、呼吸系統有影響'
      }
    } else if (aqiValue <= 200) {
      return {
        level: 'unhealthy',
        label: '對所有族群不健康',
        color: '#f5222d',
        description: '健康人群運動耐受性降低，有明顯強烈症狀，提前出現某些疾病'
      }
    } else if (aqiValue <= 300) {
      return {
        level: 'very_unhealthy',
        label: '非常不健康',
        color: '#722ed1',
        description: '健康人群運動限制，有疾病症狀'
      }
    } else {
      return {
        level: 'hazardous',
        label: '危險',
        color: '#8c0326',
        description: '所有人健康都會受到嚴重危害'
      }
    }
  },

  // 取得污染物狀態
  getPollutantStatus: (value, pollutant) => {
    const val = parseFloat(value)
    
    // 不同污染物的標準值
    const standards = {
      'pm25': { good: 15, moderate: 35, unhealthy: 65 },
      'pm10': { good: 50, moderate: 100, unhealthy: 150 },
      'o3': { good: 100, moderate: 160, unhealthy: 200 },
      'no2': { good: 100, moderate: 200, unhealthy: 400 },
      'so2': { good: 100, moderate: 300, unhealthy: 600 },
      'co': { good: 4.5, moderate: 9.5, unhealthy: 15.5 }
    }

    const standard = standards[pollutant.toLowerCase()]
    if (!standard) return { level: 'unknown', color: '#d9d9d9' }

    if (val <= standard.good) {
      return { level: 'good', color: '#52c41a' }
    } else if (val <= standard.moderate) {
      return { level: 'moderate', color: '#faad14' }
    } else if (val <= standard.unhealthy) {
      return { level: 'unhealthy', color: '#f5222d' }
    } else {
      return { level: 'dangerous', color: '#722ed1' }
    }
  },

  // 格式化測站資料（適配模擬資料格式）
  formatStationData: (stationData) => {
    if (!stationData) return null

    return {
      id: stationData.id,
      siteName: stationData.name,
      county: stationData.county,
      district: stationData.district,
      aqi: parseInt(stationData.aqi) || 0,
      status: stationData.status || 'normal',
      publishTime: stationData.timestamp,
      coordinates: {
        lat: parseFloat(stationData.latitude) || 0,
        lng: parseFloat(stationData.longitude) || 0
      },
      pollutants: {
        pm25: parseFloat(stationData.pollutants?.pm25) || 0,
        pm10: parseFloat(stationData.pollutants?.pm10) || 0,
        o3: parseFloat(stationData.pollutants?.o3) || 0,
        no2: parseFloat(stationData.pollutants?.no2) || 0,
        so2: parseFloat(stationData.pollutants?.so2) || 0,
        co: parseFloat(stationData.pollutants?.co) || 0
      },
      aqiLevel: airQualityUtils.getAQILevel(stationData.aqi)
    }
  },

  // 按縣市分組資料
  groupByCounty: (data) => {
    const grouped = {}
    
    data.forEach(item => {
      const county = item.county || '未知'
      if (!grouped[county]) {
        grouped[county] = []
      }
      grouped[county].push(airQualityUtils.formatStationData(item))
    })
    
    return grouped
  },

  // 計算縣市平均 AQI
  calculateCountyAverage: (countyData) => {
    if (!countyData || countyData.length === 0) return 0
    
    const validData = countyData.filter(item => item.aqi && item.aqi > 0)
    if (validData.length === 0) return 0
    
    const total = validData.reduce((sum, item) => sum + item.aqi, 0)
    return Math.round(total / validData.length)
  },

  // 獲取最新資料時間戳記
  getLatestTimestamp: (data) => {
    if (!data || data.length === 0) return null
    
    const timestamps = data.map(item => new Date(item.timestamp || item.publishTime))
    return new Date(Math.max(...timestamps))
  },

  // 按 AQI 等級統計
  getAQIStatistics: (data) => {
    const stats = {
      good: 0,
      moderate: 0,
      unhealthySensitive: 0,
      unhealthy: 0,
      veryUnhealthy: 0,
      hazardous: 0,
      total: data.length
    }

    data.forEach(item => {
      const aqi = parseInt(item.aqi) || 0
      if (aqi <= 50) stats.good++
      else if (aqi <= 100) stats.moderate++
      else if (aqi <= 150) stats.unhealthySensitive++
      else if (aqi <= 200) stats.unhealthy++
      else if (aqi <= 300) stats.veryUnhealthy++
      else stats.hazardous++
    })

    return stats
  }
}

export default airQualityAPI