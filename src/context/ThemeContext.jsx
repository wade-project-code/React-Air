import { createContext, useContext, useState, useEffect } from 'react'

// 建立 Theme Context
const ThemeContext = createContext()

// Theme Provider 組件
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)

  // 從 localStorage 讀取主題偏好
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const savedHighContrast = localStorage.getItem('highContrast') === 'true'
    
    if (savedTheme === 'dark') {
      setIsDark(true)
    } else if (savedTheme === 'light') {
      setIsDark(false)
    } else {
      // 檢查系統偏好
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(systemPrefersDark)
    }
    
    setIsHighContrast(savedHighContrast)
  }, [])

  // 監聽系統主題變化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('theme')
      if (!savedTheme) {
        setIsDark(e.matches)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // 應用主題到 document
  useEffect(() => {
    const root = document.documentElement
    
    if (isDark) {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
    
    if (isHighContrast) {
      root.setAttribute('data-theme', 'high-contrast')
    }
  }, [isDark, isHighContrast])

  // 切換主題
  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  // 設定特定主題
  const setTheme = (theme) => {
    const isDarkTheme = theme === 'dark'
    setIsDark(isDarkTheme)
    localStorage.setItem('theme', theme)
  }

  // 切換高對比模式
  const toggleHighContrast = () => {
    const newHighContrast = !isHighContrast
    setIsHighContrast(newHighContrast)
    localStorage.setItem('highContrast', newHighContrast.toString())
  }

  // 重置主題為系統偏好
  const resetToSystem = () => {
    localStorage.removeItem('theme')
    localStorage.removeItem('highContrast')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(systemPrefersDark)
    setIsHighContrast(false)
  }

  // 取得當前主題資訊
  const getThemeInfo = () => {
    return {
      current: isDark ? 'dark' : 'light',
      isDark,
      isLight: !isDark,
      isHighContrast,
      isSystem: !localStorage.getItem('theme')
    }
  }

  const value = {
    isDark,
    isHighContrast,
    toggleTheme,
    setTheme,
    toggleHighContrast,
    resetToSystem,
    getThemeInfo
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// 自定義 hook 來使用 Theme Context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

export default ThemeContext