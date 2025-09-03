import { apiMethods, MOCK_API_PARAMS, API_ENDPOINTS, dataProcessors } from './api'

// 監測站模擬 API 服務
export const stationsAPI = {
  
  // 獲取所有監測站狀態資訊
  getAllStations: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.STATION_STATUS, params)
      const processed = dataProcessors.formatResponse(response)
      
      // 過濾有效的監測站資料
      if (processed.success && processed.data.length > 0) {
        processed.data = dataProcessors.filterValidData(processed.data, [
          'name', 'type'
        ])
      }
      
      return processed
    } catch (error) {
      console.error('獲取監測站資訊失敗:', error)
      throw error
    }
  },

  // 獲取特定類型的監測站
  getStationsByType: async (stationType, params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.STATION_STATUS, params)
      const processed = dataProcessors.formatResponse(response)
      
      // 從模擬資料中過濾特定類型
      if (processed.success) {
        processed.data = processed.data.filter(station => 
          station.type === stationType
        )
      }
      
      return processed
    } catch (error) {
      console.error(`獲取 ${stationType} 監測站資訊失敗:`, error)
      throw error
    }
  },

  // 獲取監測站狀態統計
  getStationStatistics: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.STATION_STATUS, params)
      const processed = dataProcessors.formatResponse(response)
      
      if (processed.success) {
        const stats = stationsUtils.calculateStatistics(processed.data)
        return {
          ...processed,
          data: stats
        }
      }
      
      return processed
    } catch (error) {
      console.error('獲取監測站統計資訊失敗:', error)
      throw error
    }
  },

  // 獲取特定監測站詳細資訊
  getStationDetail: async (stationId, params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.STATION_STATUS, params)
      const processed = dataProcessors.formatResponse(response)
      
      // 從模擬資料中過濾特定監測站
      if (processed.success) {
        const stationData = processed.data.find(station => 
          station.id === stationId
        )
        return {
          ...processed,
          data: stationData ? [stationData] : []
        }
      }
      
      return processed
    } catch (error) {
      console.error(`獲取監測站 ${stationId} 詳細資訊失敗:`, error)
      throw error
    }
  }
}

// 監測站資料處理工具
export const stationsUtils = {
  
  // 監測站類型分類
  getStationType: (stationType) => {
    const types = {
      'air': {
        label: '空氣品質監測站',
        color: '#1890ff',
        icon: 'cloud',
        description: '監測空氣品質相關參數'
      },
      'water': {
        label: '水質監測站',
        color: '#52c41a',
        icon: 'dropbox',
        description: '監測河川、湖泊水質參數'
      },
      'noise': {
        label: '噪音監測站',
        color: '#fa8c16',
        icon: 'sound',
        description: '監測環境噪音狀況'
      },
      'weather': {
        label: '氣象監測站',
        color: '#722ed1',
        icon: 'weather',
        description: '監測氣象資料'
      },
      'radiation': {
        label: '輻射監測站',
        color: '#f5222d',
        icon: 'radiation',
        description: '監測環境輻射量'
      }
    }
    
    return types[stationType] || {
      label: '其他監測站',
      color: '#d9d9d9',
      icon: 'environment',
      description: '其他類型監測站'
    }
  },

  // 監測站狀態分類
  getStationStatus: (status) => {
    const statuses = {
      'normal': {
        label: '正常',
        color: '#52c41a',
        badge: 'success'
      },
      'maintenance': {
        label: '維護中',
        color: '#faad14',
        badge: 'warning'
      },
      'offline': {
        label: '離線',
        color: '#f5222d',
        badge: 'error'
      },
      'abnormal': {
        label: '異常',
        color: '#fa8c16',
        badge: 'warning'
      }
    }
    
    return statuses[status?.toLowerCase()] || {
      label: '未知',
      color: '#d9d9d9',
      badge: 'default'
    }
  },

  // 格式化監測站資料（適配模擬資料格式）
  formatStationData: (stationData) => {
    if (!stationData) return null

    return {
      stationId: stationData.id,
      stationName: stationData.name,
      stationType: stationData.type || 'unknown',
      status: stationData.status || 'normal',
      lastUpdate: stationData.lastUpdate,
      dataQuality: stationData.dataQuality || 0,
      maintenance: {
        lastMaintenance: stationData.maintenance?.lastMaintenance,
        nextMaintenance: stationData.maintenance?.nextMaintenance,
        status: stationData.maintenance?.status || 'normal'
      },
      typeInfo: stationsUtils.getStationType(stationData.type),
      statusInfo: stationsUtils.getStationStatus(stationData.status)
    }
  },

  // 按縣市分組監測站
  groupByCounty: (stations) => {
    const grouped = {}
    
    stations.forEach(station => {
      const county = station.county || '未知'
      if (!grouped[county]) {
        grouped[county] = []
      }
      grouped[county].push(stationsUtils.formatStationData(station))
    })
    
    return grouped
  },

  // 按類型分組監測站
  groupByType: (stations) => {
    const grouped = {}
    
    stations.forEach(station => {
      const type = station.stationType || 'unknown'
      if (!grouped[type]) {
        grouped[type] = []
      }
      grouped[type].push(stationsUtils.formatStationData(station))
    })
    
    return grouped
  },

  // 計算監測站統計資訊（適配模擬資料格式）
  calculateStatistics: (stations) => {
    if (!stations || stations.length === 0) {
      return {
        total: 0,
        byType: {},
        byStatus: {},
        onlineCount: 0,
        offlineCount: 0,
        maintenanceCount: 0,
        avgDataQuality: 0
      }
    }

    const stats = {
      total: stations.length,
      byType: {},
      byStatus: {},
      onlineCount: 0,
      offlineCount: 0,
      maintenanceCount: 0,
      avgDataQuality: 0
    }

    let totalDataQuality = 0

    stations.forEach(station => {
      // 按類型統計
      const type = station.type || 'unknown'
      stats.byType[type] = (stats.byType[type] || 0) + 1

      // 按狀態統計
      const status = station.status || 'normal'
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1

      // 狀態計數
      if (status === 'online') stats.onlineCount++
      else if (status === 'maintenance') stats.maintenanceCount++
      else stats.offlineCount++

      // 資料品質總和
      totalDataQuality += station.dataQuality || 0
    })

    // 計算平均資料品質
    stats.avgDataQuality = stations.length > 0 ? 
      Math.round((totalDataQuality / stations.length) * 100) / 100 : 0

    return stats
  },

  // 檢查監測站資料完整性
  validateStationData: (station) => {
    const issues = []
    
    if (!station.stationName) {
      issues.push('缺少監測站名稱')
    }
    
    if (!station.coordinates.lat || !station.coordinates.lng) {
      issues.push('缺少座標資訊')
    }
    
    if (!station.county) {
      issues.push('缺少縣市資訊')
    }
    
    if (!station.address) {
      issues.push('缺少地址資訊')
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      completeness: Math.round(((4 - issues.length) / 4) * 100)
    }
  },

  // 計算監測站密度
  calculateDensity: (stations, area) => {
    if (!stations || stations.length === 0 || !area) return 0
    return Math.round((stations.length / area) * 100) / 100 // 每平方公里監測站數
  },

  // 尋找最近的監測站
  findNearestStation: (targetLat, targetLng, stations, limit = 5) => {
    if (!stations || stations.length === 0) return []

    const stationsWithDistance = stations.map(station => {
      const distance = stationsUtils.calculateDistance(
        targetLat, 
        targetLng, 
        station.coordinates.lat, 
        station.coordinates.lng
      )
      
      return {
        ...station,
        distance
      }
    })

    return stationsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
  },

  // 計算兩點間距離 (公里)
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371 // 地球半徑 (公里)
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return Math.round(R * c * 100) / 100
  }
}

export default stationsAPI