import { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Typography, Space, Spin, Alert } from 'antd'
import {
  CloudOutlined,
  DropboxOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { airQualityAPI } from '../services/airQuality'
import { useApp } from '../context/AppContext'

const { Title, Paragraph } = Typography

const Dashboard = () => {
  const { state, actions } = useApp()
  const [stats, setStats] = useState({
    airQuality: { value: 0, trend: 0 },
    waterQuality: { value: 0, trend: 0 },
    wasteRecycling: { value: 0, trend: 0 },
    totalStations: { value: 0, trend: 0 }
  })

  // 獲取空氣品質資料
  const { 
    data: airQualityData, 
    isLoading: airLoading, 
    error: airError 
  } = useQuery({
    queryKey: ['airQuality', 'dashboard'],
    queryFn: () => airQualityAPI.getCurrentAirQuality({ limit: 50 }),
    staleTime: 5 * 60 * 1000, // 5 分鐘
    refetchInterval: state.user.preferences.autoRefresh ? 
      state.user.preferences.refreshInterval : false
  })

  // 處理空氣品質資料
  useEffect(() => {
    if (airQualityData?.success && airQualityData.data.length > 0) {
      const validStations = airQualityData.data.filter(station => 
        station.aqi && station.aqi > 0
      )
      
      if (validStations.length > 0) {
        const avgAQI = Math.round(
          validStations.reduce((sum, station) => sum + parseInt(station.aqi), 0) / 
          validStations.length
        )
        
        setStats(prev => ({
          ...prev,
          airQuality: {
            value: avgAQI,
            trend: Math.random() > 0.5 ? 2.5 : -1.8 // 模擬趨勢
          },
          totalStations: {
            value: validStations.length,
            trend: 0
          }
        }))
      }
      
      // 更新最後更新時間
      actions.setLastUpdated()
    }
  }, [airQualityData, actions])

  // 統計卡片配置
  const statisticCards = [
    {
      title: '平均空氣品質指標',
      value: stats.airQuality.value,
      trend: stats.airQuality.trend,
      prefix: <CloudOutlined />,
      suffix: 'AQI',
      color: getAQIColor(stats.airQuality.value),
      description: '全台監測站平均值'
    },
    {
      title: '水質優良站點',
      value: stats.waterQuality.value || 78,
      trend: stats.waterQuality.trend || 3.2,
      prefix: <DropboxOutlined />,
      suffix: '%',
      color: '#52c41a',
      description: '水質達優良等級比例'
    },
    {
      title: '廢棄物回收率',
      value: stats.wasteRecycling.value || 58.7,
      trend: stats.wasteRecycling.trend || 1.5,
      prefix: <DeleteOutlined />,
      suffix: '%',
      color: '#1890ff',
      description: '全國平均回收率'
    },
    {
      title: '監測站總數',
      value: stats.totalStations.value,
      trend: stats.totalStations.trend,
      prefix: <EnvironmentOutlined />,
      suffix: '站',
      color: '#722ed1',
      description: '全台環境監測站'
    }
  ]

  // 取得 AQI 對應顏色
  function getAQIColor(aqi) {
    if (aqi <= 50) return '#52c41a'
    if (aqi <= 100) return '#faad14'
    if (aqi <= 150) return '#fa8c16'
    if (aqi <= 200) return '#f5222d'
    if (aqi <= 300) return '#722ed1'
    return '#8c0326'
  }

  // 渲染趨勢圖標
  const renderTrendIcon = (trend) => {
    if (trend > 0) {
      return <ArrowUpOutlined style={{ color: '#f5222d' }} />
    } else if (trend < 0) {
      return <ArrowDownOutlined style={{ color: '#52c41a' }} />
    }
    return null
  }

  // 載入狀態
  if (airLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="載入儀表板資料中..." />
      </div>
    )
  }

  // 錯誤狀態
  if (airError) {
    return (
      <Alert
        message="資料載入失敗"
        description={`無法載入儀表板資料: ${airError.userMessage || airError.message}`}
        type="error"
        showIcon
        style={{ margin: '20px 0' }}
      />
    )
  }

  return (
    <div>
      {/* 頁面標題 */}
      <div className="page-header">
        <Title level={2} className="page-title">
          環境監測總覽儀表板
        </Title>
        <Paragraph className="page-description">
          即時顯示全台環境監測資料，包含空氣品質、水質狀況、廢棄物處理等重要環境指標
        </Paragraph>
      </div>

      {/* 統計卡片區域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statisticCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="stat-card" hoverable>
              <Statistic
                title={
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#bfbfbf' }}>
                      {card.description}
                    </div>
                  </Space>
                }
                value={card.value}
                precision={typeof card.value === 'number' && card.value % 1 !== 0 ? 1 : 0}
                prefix={
                  <span style={{ color: card.color, fontSize: '20px' }}>
                    {card.prefix}
                  </span>
                }
                suffix={
                  <Space>
                    <span style={{ fontSize: '14px' }}>{card.suffix}</span>
                    {card.trend !== 0 && (
                      <span style={{ fontSize: '12px' }}>
                        {renderTrendIcon(card.trend)}
                        {Math.abs(card.trend)}%
                      </span>
                    )}
                  </Space>
                }
                valueStyle={{ 
                  color: card.color, 
                  fontSize: '28px',
                  fontWeight: 'bold'
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快速導航區域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="空氣品質監測" className="chart-container" hoverable>
            <Paragraph>
              即時監測全台各地空氣品質狀況，包含 PM2.5、PM10、臭氧等主要污染指標。
              提供詳細的測站分布和歷史趨勢分析。
            </Paragraph>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <CloudOutlined style={{ fontSize: '48px', color: getAQIColor(stats.airQuality.value) }} />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="水質監測" className="chart-container" hoverable>
            <Paragraph>
              監測河川、湖泊水質狀況，包含溶氧量、生化需氧量、懸浮固體等重要水質參數。
              協助了解水體污染狀況和變化趨勢。
            </Paragraph>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <DropboxOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="廢棄物統計" className="chart-container" hoverable>
            <Paragraph>
              統計各縣市廢棄物產生量、回收率等資訊，分析廢棄物處理效率和資源回收成效。
              提供環境永續發展的重要參考指標。
            </Paragraph>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <DeleteOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="監測站管理" className="chart-container" hoverable>
            <Paragraph>
              管理全台環境監測站資訊，包含站點分布、設備狀態、資料品質等。
              確保監測網絡的完整性和資料可靠性。
            </Paragraph>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <EnvironmentOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最後更新時間 */}
      {state.app.lastUpdated && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px', 
          color: '#8c8c8c',
          fontSize: '12px' 
        }}>
          最後更新時間: {state.app.lastUpdated.toLocaleString('zh-TW')}
        </div>
      )}
    </div>
  )
}

export default Dashboard