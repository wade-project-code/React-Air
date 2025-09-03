import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin } from 'antd'

// 懶載入頁面組件
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AirQuality = lazy(() => import('./pages/AirQuality'))
const WaterQuality = lazy(() => import('./pages/WaterQuality'))
const Waste = lazy(() => import('./pages/Waste'))
const Stations = lazy(() => import('./pages/Stations'))
const Reports = lazy(() => import('./pages/Reports'))

// 載入中組件
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh' 
  }}>
    <Spin size="large" tip="載入中..." />
  </div>
)

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* 預設重導向到儀表板 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 主要路由 */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/air-quality" element={<AirQuality />} />
        <Route path="/water-quality" element={<WaterQuality />} />
        <Route path="/waste" element={<Waste />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/reports" element={<Reports />} />
        
        {/* 404 頁面 */}
        <Route 
          path="*" 
          element={
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h2>頁面不存在</h2>
              <p>您訪問的頁面不存在，請檢查網址是否正確</p>
            </div>
          } 
        />
      </Routes>
    </Suspense>
  )
}

export default AppRouter