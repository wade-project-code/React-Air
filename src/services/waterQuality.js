import { apiMethods, MOCK_API_PARAMS, API_ENDPOINTS, dataProcessors } from './api'

// 水質監測模擬 API 服務
export const waterQualityAPI = {
  
  // 獲取河川水質監測資料
  getRiverWaterQuality: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.WATER_QUALITY, params)
      const processed = dataProcessors.formatResponse(response)
      
      // 過濾有效的水質資料
      if (processed.success && processed.data.length > 0) {
        processed.data = dataProcessors.filterValidData(processed.data, [
          'name', 'location', 'waterQualityIndex'
        ])
      }
      
      return processed
    } catch (error) {
      console.error('獲取水質監測資料失敗:', error)
      throw error
    }
  },

  // 獲取特定縣市的水質資料
  getWaterQualityByCounty: async (county, params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.WATER_QUALITY, params)
      const processed = dataProcessors.formatResponse(response)
      
      // 從模擬資料中過濾特定縣市
      if (processed.success) {
        processed.data = processed.data.filter(station => 
          station.location && station.location.includes(county)
        )
      }
      
      return processed
    } catch (error) {
      console.error(`獲取 ${county} 水質資料失敗:`, error)
      throw error
    }
  },

  // 獲取特定測站的水質資料
  getWaterQualityBySite: async (siteName, params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.WATER_QUALITY, params)
      const processed = dataProcessors.formatResponse(response)
      
      // 從模擬資料中過濾特定測站
      if (processed.success) {
        processed.data = processed.data.filter(station => 
          station.name === siteName
        )
      }
      
      return processed
    } catch (error) {
      console.error(`獲取 ${siteName} 水質測站資料失敗:`, error)
      throw error
    }
  },

  // 獲取水質監測站基本資訊
  getWaterQualityStations: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.WATER_QUALITY, params)
      return dataProcessors.formatResponse(response)
    } catch (error) {
      console.error('獲取水質監測站資訊失敗:', error)
      throw error
    }
  }
}

// 水質資料處理工具
export const waterQualityUtils = {
  
  // 河川污染指標 (RPI) 等級分類
  getRPILevel: (rpi) => {
    const rpiValue = parseFloat(rpi)
    
    if (rpiValue <= 1.0) {
      return {
        level: 'unpolluted',
        label: '未(稍)受污染',
        color: '#52c41a',
        description: '水質狀況極佳，適合各種用途'
      }
    } else if (rpiValue <= 3.0) {
      return {
        level: 'lightly_polluted',
        label: '輕度污染',
        color: '#faad14',
        description: '水質良好，稍有污染現象'
      }
    } else if (rpiValue <= 6.0) {
      return {
        level: 'moderately_polluted',
        label: '中度污染',
        color: '#fa8c16',
        description: '水質狀況尚可，但需注意污染情況'
      }
    } else {
      return {
        level: 'severely_polluted',
        label: '嚴重污染',
        color: '#f5222d',
        description: '水質受到嚴重污染，不適合接觸'
      }
    }
  },

  // 水質參數狀態評估
  getParameterStatus: (value, parameter) => {
    const val = parseFloat(value)
    
    // 不同水質參數的標準值 (依據環保署水質標準)
    const standards = {
      'ph': { min: 6.5, max: 8.5, optimal: { min: 7.0, max: 8.0 } },
      'do': { good: 6.5, moderate: 4.5, poor: 2.0 }, // 溶氧量 mg/L
      'bod': { good: 2, moderate: 4, poor: 10 }, // 生化需氧量 mg/L
      'cod': { good: 15, moderate: 25, poor: 40 }, // 化學需氧量 mg/L
      'ss': { good: 15, moderate: 25, poor: 40 }, // 懸浮固體 mg/L
      'nh3n': { good: 0.1, moderate: 0.3, poor: 1.0 }, // 氨氮 mg/L
      'tp': { good: 0.02, moderate: 0.05, poor: 0.1 } // 總磷 mg/L
    }

    const standard = standards[parameter.toLowerCase()]
    if (!standard) return { level: 'unknown', color: '#d9d9d9' }

    // pH 值特殊處理
    if (parameter.toLowerCase() === 'ph') {
      if (val >= standard.optimal.min && val <= standard.optimal.max) {
        return { level: 'excellent', color: '#52c41a' }
      } else if (val >= standard.min && val <= standard.max) {
        return { level: 'good', color: '#faad14' }
      } else {
        return { level: 'poor', color: '#f5222d' }
      }
    }

    // 溶氧量處理 (越高越好)
    if (parameter.toLowerCase() === 'do') {
      if (val >= standard.good) {
        return { level: 'good', color: '#52c41a' }
      } else if (val >= standard.moderate) {
        return { level: 'moderate', color: '#faad14' }
      } else if (val >= standard.poor) {
        return { level: 'poor', color: '#fa8c16' }
      } else {
        return { level: 'very_poor', color: '#f5222d' }
      }
    }

    // 其他參數處理 (越低越好)
    if (val <= standard.good) {
      return { level: 'good', color: '#52c41a' }
    } else if (val <= standard.moderate) {
      return { level: 'moderate', color: '#faad14' }
    } else if (val <= standard.poor) {
      return { level: 'poor', color: '#fa8c16' }
    } else {
      return { level: 'very_poor', color: '#f5222d' }
    }
  },

  // 格式化水質測站資料（適配模擬資料格式）
  formatWaterStationData: (stationData) => {
    if (!stationData) return null

    return {
      id: stationData.id,
      siteName: stationData.name,
      location: stationData.location,
      waterQualityIndex: parseFloat(stationData.waterQualityIndex) || 0,
      status: stationData.status || 'normal',
      sampleDate: stationData.timestamp,
      coordinates: {
        lat: parseFloat(stationData.latitude) || 0,
        lng: parseFloat(stationData.longitude) || 0
      },
      parameters: {
        ph: parseFloat(stationData.parameters?.ph) || 0,
        dissolvedOxygen: parseFloat(stationData.parameters?.dissolvedOxygen) || 0,
        bod: parseFloat(stationData.parameters?.bod) || 0,
        cod: parseFloat(stationData.parameters?.cod) || 0,
        suspendedSolids: parseFloat(stationData.parameters?.suspendedSolids) || 0,
        ammoniaNitrogen: parseFloat(stationData.parameters?.ammoniaNitrogen) || 0
      },
      rpiLevel: waterQualityUtils.getWQILevel(stationData.waterQualityIndex)
    }
  },

  // 水質指標等級分類
  getWQILevel: (wqi) => {
    const wqiValue = parseFloat(wqi)
    
    if (wqiValue >= 8.0) {
      return {
        level: 'excellent',
        label: '優良',
        color: '#0066cc',
        description: '水質優良，適合各種用途'
      }
    } else if (wqiValue >= 6.0) {
      return {
        level: 'good',
        label: '良好',
        color: '#00cc66',
        description: '水質良好，符合使用標準'
      }
    } else if (wqiValue >= 4.0) {
      return {
        level: 'moderate',
        label: '普通',
        color: '#ffcc00',
        description: '水質尚可，需持續監測'
      }
    } else {
      return {
        level: 'poor',
        label: '不良',
        color: '#cc0000',
        description: '水質不佳，需要改善'
      }
    }
  },

  // 計算 RPI 值
  calculateRPI: (parameters) => {
    const { do: dissolvedOxygen, bod, ss, nh3n } = parameters
    
    // RPI 計算公式 (簡化版)
    let rpi = 1
    
    // 溶氧量計分
    if (dissolvedOxygen >= 6.5) rpi += 1
    else if (dissolvedOxygen >= 4.6) rpi += 3
    else if (dissolvedOxygen >= 2.0) rpi += 6
    else rpi += 10
    
    // BOD 計分
    if (bod <= 3.0) rpi += 1
    else if (bod <= 4.9) rpi += 3
    else if (bod <= 15.0) rpi += 6
    else rpi += 10
    
    // 懸浮固體計分
    if (ss <= 20) rpi += 1
    else if (ss <= 49) rpi += 3
    else if (ss <= 100) rpi += 6
    else rpi += 10
    
    // 氨氮計分
    if (nh3n <= 0.5) rpi += 1
    else if (nh3n <= 0.99) rpi += 3
    else if (nh3n <= 3.0) rpi += 6
    else rpi += 10
    
    return Math.round((rpi - 4) / 4 * 100) / 100 // 正規化到 0-10 分
  },

  // 按河川分組資料（適配模擬資料格式）
  groupByRiver: (data) => {
    const grouped = {}
    
    data.forEach(item => {
      const river = item.name || '未知河川'
      if (!grouped[river]) {
        grouped[river] = []
      }
      grouped[river].push(waterQualityUtils.formatWaterStationData(item))
    })
    
    return grouped
  },

  // 按縣市分組資料（適配模擬資料格式）
  groupByLocation: (data) => {
    const grouped = {}
    
    data.forEach(item => {
      const location = item.location || '未知'
      if (!grouped[location]) {
        grouped[location] = []
      }
      grouped[location].push(waterQualityUtils.formatWaterStationData(item))
    })
    
    return grouped
  },

  // 取得測站最新資料
  getLatestData: (stationData) => {
    if (!stationData || stationData.length === 0) return null
    
    // 按時間排序取最新資料
    const sorted = stationData.sort((a, b) => 
      new Date(b.sampleDate) - new Date(a.sampleDate)
    )
    
    return sorted[0]
  }
}

export default waterQualityAPI