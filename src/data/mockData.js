// 台灣環保署 API 模擬資料

// 空氣品質監測站資料
export const airQualityStations = [
  {
    id: 'TPE001',
    name: '台北市',
    county: '台北市',
    district: '中正區',
    latitude: 25.0330,
    longitude: 121.5654,
    aqi: 85,
    status: 'moderate',
    pollutants: {
      pm25: 35,
      pm10: 55,
      o3: 0.08,
      no2: 0.035,
      so2: 0.012,
      co: 0.8
    },
    timestamp: new Date().toISOString()
  },
  {
    id: 'TPH001',
    name: '新北市',
    county: '新北市',
    district: '板橋區',
    latitude: 25.0167,
    longitude: 121.4630,
    aqi: 72,
    status: 'moderate',
    pollutants: {
      pm25: 28,
      pm10: 48,
      o3: 0.06,
      no2: 0.028,
      so2: 0.008,
      co: 0.6
    },
    timestamp: new Date().toISOString()
  },
  {
    id: 'TXG001',
    name: '台中市',
    county: '台中市',
    district: '西屯區',
    latitude: 24.1617,
    longitude: 120.6478,
    aqi: 95,
    status: 'moderate',
    pollutants: {
      pm25: 42,
      pm10: 68,
      o3: 0.09,
      no2: 0.038,
      so2: 0.015,
      co: 0.9
    },
    timestamp: new Date().toISOString()
  },
  {
    id: 'KHH001',
    name: '高雄市',
    county: '高雄市',
    district: '前金區',
    latitude: 22.6263,
    longitude: 120.3014,
    aqi: 105,
    status: 'unhealthy_sensitive',
    pollutants: {
      pm25: 48,
      pm10: 75,
      o3: 0.10,
      no2: 0.042,
      so2: 0.018,
      co: 1.1
    },
    timestamp: new Date().toISOString()
  }
]

// 歷史空氣品質趨勢資料
export const airQualityTrends = {
  daily: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    aqi: Math.floor(Math.random() * 50) + 50,
    pm25: Math.floor(Math.random() * 30) + 20,
    pm10: Math.floor(Math.random() * 40) + 30
  })),
  hourly: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    aqi: Math.floor(Math.random() * 30) + 60,
    pm25: Math.floor(Math.random() * 20) + 25
  }))
}

// 水質監測資料
export const waterQualityData = [
  {
    id: 'WQ001',
    name: '淡水河',
    location: '台北市',
    latitude: 25.1669,
    longitude: 121.4316,
    waterQualityIndex: 6.5,
    status: 'moderate',
    parameters: {
      ph: 7.2,
      dissolvedOxygen: 5.8,
      bod: 3.2,
      cod: 12.5,
      suspendedSolids: 15.3,
      ammoniaNitrogen: 2.1
    },
    timestamp: new Date().toISOString()
  },
  {
    id: 'WQ002',
    name: '愛河',
    location: '高雄市',
    latitude: 22.6203,
    longitude: 120.3133,
    waterQualityIndex: 5.2,
    status: 'poor',
    parameters: {
      ph: 7.5,
      dissolvedOxygen: 4.2,
      bod: 5.8,
      cod: 18.7,
      suspendedSolids: 22.1,
      ammoniaNitrogen: 3.5
    },
    timestamp: new Date().toISOString()
  }
]

// 廢棄物統計資料
export const wasteStatistics = {
  monthly: [
    { month: '2024-01', generalWaste: 125000, recycling: 45000, organicWaste: 32000 },
    { month: '2024-02', generalWaste: 118000, recycling: 48000, organicWaste: 35000 },
    { month: '2024-03', generalWaste: 132000, recycling: 52000, organicWaste: 38000 },
    { month: '2024-04', generalWaste: 128000, recycling: 49000, organicWaste: 36000 },
    { month: '2024-05', generalWaste: 135000, recycling: 55000, organicWaste: 41000 },
    { month: '2024-06', generalWaste: 142000, recycling: 58000, organicWaste: 43000 }
  ],
  byRegion: [
    { region: '台北市', total: 156000, recyclingRate: 42 },
    { region: '新北市', total: 198000, recyclingRate: 38 },
    { region: '台中市', total: 145000, recyclingRate: 35 },
    { region: '台南市', total: 112000, recyclingRate: 40 },
    { region: '高雄市', total: 167000, recyclingRate: 37 }
  ]
}

// 監測站狀態資料
export const stationStatus = [
  {
    id: 'ST001',
    name: '台北站',
    type: 'air_quality',
    status: 'online',
    lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    dataQuality: 98.5,
    maintenance: {
      lastMaintenance: '2024-08-15',
      nextMaintenance: '2024-09-15',
      status: 'normal'
    }
  },
  {
    id: 'ST002',
    name: '高雄站',
    type: 'air_quality',
    status: 'maintenance',
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    dataQuality: 0,
    maintenance: {
      lastMaintenance: '2024-09-03',
      nextMaintenance: '2024-10-03',
      status: 'maintenance'
    }
  }
]

// 噪音監測資料
export const noiseData = [
  {
    id: 'NS001',
    location: '台北市信義區',
    latitude: 25.0337,
    longitude: 121.5647,
    currentLevel: 65.2,
    averageLevel: 62.8,
    maxLevel: 78.5,
    minLevel: 45.3,
    status: 'normal',
    timestamp: new Date().toISOString()
  },
  {
    id: 'NS002',
    location: '高雄市前鎮區',
    latitude: 22.5892,
    longitude: 120.3193,
    currentLevel: 72.8,
    averageLevel: 69.2,
    maxLevel: 85.1,
    minLevel: 52.7,
    status: 'warning',
    timestamp: new Date().toISOString()
  }
]

// 綜合環境指標
export const environmentalIndicators = {
  airQuality: {
    good: 45,
    moderate: 35,
    unhealthy: 15,
    hazardous: 5
  },
  waterQuality: {
    excellent: 25,
    good: 40,
    moderate: 25,
    poor: 10
  },
  wasteManagement: {
    recyclingRate: 39.2,
    reductionRate: 12.5,
    treatmentRate: 95.8
  },
  overallScore: 72.5
}

// API 響應格式模擬
export const createApiResponse = (data, success = true, message = 'Success') => ({
  success,
  message,
  data,
  timestamp: new Date().toISOString(),
  version: 'v2'
})

// 分頁資料格式模擬
export const createPaginatedResponse = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = data.slice(startIndex, endIndex)

  return createApiResponse({
    items: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
      hasNext: endIndex < data.length,
      hasPrev: page > 1
    }
  })
}