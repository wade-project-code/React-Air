// 應用程式常數定義

// 台灣縣市列表
export const TAIWAN_COUNTIES = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '嘉義市',
  '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣',
  '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣'
]

// AQI 等級定義
export const AQI_LEVELS = {
  GOOD: {
    range: [0, 50],
    label: '良好',
    color: '#52c41a',
    description: '空氣品質令人滿意，基本無空氣污染'
  },
  MODERATE: {
    range: [51, 100],
    label: '普通',
    color: '#faad14',
    description: '空氣品質可接受，但某些污染物可能對極少數異常敏感人群健康有較弱影響'
  },
  UNHEALTHY_SENSITIVE: {
    range: [101, 150],
    label: '對敏感族群不健康',
    color: '#fa8c16',
    description: '易感人群症狀進一步加劇，可能對健康人群的心臟、呼吸系統有影響'
  },
  UNHEALTHY: {
    range: [151, 200],
    label: '對所有族群不健康',
    color: '#f5222d',
    description: '健康人群運動耐受性降低，有明顯強烈症狀，提前出現某些疾病'
  },
  VERY_UNHEALTHY: {
    range: [201, 300],
    label: '非常不健康',
    color: '#722ed1',
    description: '健康人群運動限制，有疾病症狀'
  },
  HAZARDOUS: {
    range: [301, 500],
    label: '危險',
    color: '#8c0326',
    description: '所有人健康都會受到嚴重危害'
  }
}

// 水質等級定義
export const WATER_QUALITY_LEVELS = {
  EXCELLENT: {
    label: '優',
    color: '#52c41a',
    description: '水質極佳，適合各種用途'
  },
  GOOD: {
    label: '良',
    color: '#a0d911',
    description: '水質良好，稍有污染現象'
  },
  MODERATE: {
    label: '普通',
    color: '#faad14',
    description: '水質尚可，但需注意污染情況'
  },
  POOR: {
    label: '差',
    color: '#fa8c16',
    description: '水質不佳，有明顯污染'
  },
  VERY_POOR: {
    label: '極差',
    color: '#f5222d',
    description: '水質受到嚴重污染，不適合接觸'
  }
}

// 污染物單位定義
export const POLLUTANT_UNITS = {
  pm25: 'μg/m³',
  pm10: 'μg/m³',
  o3: 'ppb',
  no2: 'ppb',
  so2: 'ppb',
  co: 'ppm',
  ph: '',
  do: 'mg/L',
  bod: 'mg/L',
  cod: 'mg/L',
  ss: 'mg/L',
  nh3n: 'mg/L',
  tp: 'mg/L'
}

// 污染物中文名稱
export const POLLUTANT_NAMES = {
  pm25: 'PM2.5',
  pm10: 'PM10',
  o3: '臭氧',
  no2: '二氧化氮',
  so2: '二氧化硫',
  co: '一氧化碳',
  ph: 'pH值',
  do: '溶氧量',
  bod: '生化需氧量',
  cod: '化學需氧量',
  ss: '懸浮固體',
  nh3n: '氨氮',
  tp: '總磷'
}

// 監測站類型
export const STATION_TYPES = {
  AIR: {
    label: '空氣品質監測站',
    color: '#1890ff',
    icon: 'cloud'
  },
  WATER: {
    label: '水質監測站',
    color: '#52c41a',
    icon: 'dropbox'
  },
  NOISE: {
    label: '噪音監測站',
    color: '#fa8c16',
    icon: 'sound'
  },
  WEATHER: {
    label: '氣象監測站',
    color: '#722ed1',
    icon: 'weather'
  },
  RADIATION: {
    label: '輻射監測站',
    color: '#f5222d',
    icon: 'radiation'
  }
}

// 時間格式常數
export const DATE_FORMATS = {
  FULL: 'YYYY-MM-DD HH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  MONTH_YEAR: 'YYYY-MM',
  DISPLAY: 'YYYY年M月D日 HH:mm'
}

// API 配置
export const API_CONFIG = {
  BASE_URL: 'https://data.moenv.gov.tw/api/v2',
  TIMEOUT: 15000,
  RETRY_COUNT: 3,
  CACHE_TIME: 5 * 60 * 1000, // 5 分鐘
  STALE_TIME: 2 * 60 * 1000  // 2 分鐘
}

// 地圖配置
export const MAP_CONFIG = {
  DEFAULT_CENTER: [23.8, 120.9], // 台灣中心座標
  DEFAULT_ZOOM: 8,
  MIN_ZOOM: 6,
  MAX_ZOOM: 18,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '© OpenStreetMap contributors'
}

// 圖表顏色主題
export const CHART_COLORS = {
  PRIMARY: '#1890ff',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#f5222d',
  INFO: '#722ed1',
  PALETTE: [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', 
    '#722ed1', '#fa8c16', '#13c2c2', '#eb2f96',
    '#a0d911', '#fa541c', '#2f54eb', '#fadb14'
  ]
}

// 響應式斷點
export const BREAKPOINTS = {
  XS: 480,
  SM: 768,
  MD: 1024,
  LG: 1200,
  XL: 1600
}

// 分頁設定
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true
}

// 更新間隔（毫秒）
export const UPDATE_INTERVALS = {
  REAL_TIME: 30 * 1000,    // 30 秒
  FREQUENT: 2 * 60 * 1000, // 2 分鐘
  NORMAL: 5 * 60 * 1000,   // 5 分鐘
  SLOW: 15 * 60 * 1000,    // 15 分鐘
  HOURLY: 60 * 60 * 1000   // 1 小時
}

// 本地存儲 key
export const STORAGE_KEYS = {
  THEME: 'theme',
  HIGH_CONTRAST: 'highContrast',
  USER_PREFERENCES: 'userPreferences',
  FILTERS: 'filters',
  MAP_STATE: 'mapState'
}

// 錯誤訊息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '網路連線異常，請檢查網路狀態',
  API_ERROR: 'API 服務異常，請稍後再試',
  DATA_NOT_FOUND: '查無相關資料',
  INVALID_PARAMS: '參數格式錯誤',
  TIMEOUT: '請求超時，請稍後再試',
  UNKNOWN: '發生未知錯誤'
}

// 成功訊息
export const SUCCESS_MESSAGES = {
  DATA_LOADED: '資料載入成功',
  SETTINGS_SAVED: '設定已儲存',
  EXPORT_SUCCESS: '資料匯出成功',
  FILTER_APPLIED: '篩選條件已套用'
}