import dayjs from 'dayjs'
import { POLLUTANT_UNITS, DATE_FORMATS } from './constants'

// 數值格式化工具
export const formatters = {
  
  // 格式化數值
  number: (value, decimals = 0) => {
    if (value === null || value === undefined || isNaN(value)) return '-'
    return Number(value).toFixed(decimals)
  },

  // 格式化百分比
  percentage: (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) return '-'
    return `${Number(value).toFixed(decimals)}%`
  },

  // 格式化日期時間
  datetime: (value, format = DATE_FORMATS.DISPLAY) => {
    if (!value) return '-'
    return dayjs(value).format(format)
  },

  // 格式化相對時間
  relativeTime: (value) => {
    if (!value) return '-'
    return dayjs(value).fromNow()
  },

  // 格式化污染物數值
  pollutant: (value, pollutant) => {
    if (value === null || value === undefined || isNaN(value)) return '-'
    const unit = POLLUTANT_UNITS[pollutant] || ''
    const decimals = unit.includes('μg') || unit.includes('mg') ? 1 : 0
    return `${Number(value).toFixed(decimals)} ${unit}`.trim()
  },

  // 格式化 AQI 數值
  aqi: (value) => {
    if (value === null || value === undefined || isNaN(value)) return '-'
    return Math.round(Number(value))
  },

  // 格式化座標
  coordinate: (lat, lng, decimals = 4) => {
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return '-'
    return `${Number(lat).toFixed(decimals)}, ${Number(lng).toFixed(decimals)}`
  },

  // 格式化檔案大小
  fileSize: (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  },

  // 格式化電話號碼
  phone: (value) => {
    if (!value) return '-'
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3')
    } else if (cleaned.length === 8) {
      return cleaned.replace(/(\d{4})(\d{4})/, '$1-$2')
    }
    return value
  },

  // 格式化縣市名稱
  county: (value) => {
    if (!value) return '未知'
    // 統一縣市名稱格式
    const countyMap = {
      '台北市': '臺北市',
      '台中市': '臺中市',
      '台南市': '臺南市',
      '台東縣': '臺東縣'
    }
    return countyMap[value] || value
  },

  // 格式化監測站名稱
  stationName: (value) => {
    if (!value) return '未知監測站'
    return value.replace(/監測站$/, '').trim() || value
  }
}

// 數值驗證和清理工具
export const validators = {
  
  // 驗證數值範圍
  isInRange: (value, min, max) => {
    const num = Number(value)
    return !isNaN(num) && num >= min && num <= max
  },

  // 驗證 AQI 數值
  isValidAQI: (value) => {
    return validators.isInRange(value, 0, 500)
  },

  // 驗證座標
  isValidCoordinate: (lat, lng) => {
    return validators.isInRange(lat, -90, 90) && 
           validators.isInRange(lng, -180, 180)
  },

  // 驗證日期
  isValidDate: (value) => {
    return dayjs(value).isValid()
  },

  // 驗證電子郵件
  isValidEmail: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  // 驗證電話號碼
  isValidPhone: (value) => {
    const phoneRegex = /^(\d{2,4})-?(\d{3,4})-?(\d{3,4})$/
    return phoneRegex.test(value)
  }
}

// 資料清理工具
export const cleaners = {
  
  // 清理數值
  number: (value) => {
    if (value === null || value === undefined || value === '') return null
    const num = Number(value)
    return isNaN(num) ? null : num
  },

  // 清理字串
  string: (value) => {
    if (typeof value !== 'string') return null
    return value.trim() || null
  },

  // 清理座標
  coordinate: (lat, lng) => {
    const cleanLat = cleaners.number(lat)
    const cleanLng = cleaners.number(lng)
    
    if (cleanLat === null || cleanLng === null) return null
    if (!validators.isValidCoordinate(cleanLat, cleanLng)) return null
    
    return { lat: cleanLat, lng: cleanLng }
  },

  // 清理日期
  date: (value) => {
    if (!value) return null
    const date = dayjs(value)
    return date.isValid() ? date.toDate() : null
  },

  // 清理污染物數值
  pollutant: (value, min = 0, max = Infinity) => {
    const num = cleaners.number(value)
    if (num === null) return null
    return validators.isInRange(num, min, max) ? num : null
  }
}

// 資料轉換工具
export const converters = {
  
  // 轉換 API 回應資料
  apiResponse: (response) => {
    if (!response || !response.records) {
      return { data: [], total: 0, success: false }
    }
    
    return {
      data: response.records,
      total: response.total || response.records.length,
      success: true
    }
  },

  // 轉換空氣品質資料
  airQualityData: (rawData) => {
    if (!rawData) return null
    
    return {
      siteName: cleaners.string(rawData.sitename),
      county: formatters.county(rawData.county),
      aqi: cleaners.pollutant(rawData.aqi, 0, 500),
      pm25: cleaners.pollutant(rawData.pm25_avg, 0, 1000),
      pm10: cleaners.pollutant(rawData.pm10_avg, 0, 1000),
      o3: cleaners.pollutant(rawData.o3_8hr, 0, 500),
      no2: cleaners.pollutant(rawData.no2, 0, 1000),
      so2: cleaners.pollutant(rawData.so2, 0, 1000),
      co: cleaners.pollutant(rawData.co_8hr, 0, 50),
      publishTime: cleaners.date(rawData.publishtime),
      coordinates: cleaners.coordinate(rawData.latitude, rawData.longitude)
    }
  },

  // 轉換水質資料
  waterQualityData: (rawData) => {
    if (!rawData) return null
    
    return {
      siteName: cleaners.string(rawData.sitename),
      county: formatters.county(rawData.county),
      river: cleaners.string(rawData.rivername),
      itemName: cleaners.string(rawData.itemname),
      itemValue: cleaners.number(rawData.itemvalue),
      itemUnit: cleaners.string(rawData.itemunit),
      sampleDate: cleaners.date(rawData.sampledate),
      coordinates: cleaners.coordinate(rawData.latitude, rawData.longitude)
    }
  },

  // 轉換表格資料
  tableData: (data, keyField = 'id') => {
    if (!Array.isArray(data)) return []
    
    return data.map((item, index) => ({
      key: item[keyField] || index,
      ...item
    }))
  }
}

// 導出所有工具
export default {
  formatters,
  validators,
  cleaners,
  converters
}