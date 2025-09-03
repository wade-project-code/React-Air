import { useState, useEffect } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Tag, 
  Typography, 
  Select, 
  Space, 
  Spin, 
  Alert,
  Statistic
} from 'antd'
import { 
  CloudOutlined, 
  EnvironmentOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { airQualityAPI, airQualityUtils } from '../services/airQuality'

const { Title, Paragraph } = Typography
const { Option } = Select

const AirQuality = () => {
  const [selectedCounty, setSelectedCounty] = useState('')
  const [processedData, setProcessedData] = useState([])
  const [countyStats, setCountyStats] = useState({})

  // 獲取空氣品質資料
  const { 
    data: airQualityData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['airQuality', 'current', selectedCounty],
    queryFn: () => selectedCounty ? 
      airQualityAPI.getAirQualityByCounty(selectedCounty) :
      airQualityAPI.getCurrentAirQuality({ limit: 200 }),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000 // 5 分鐘自動更新
  })

  // 處理資料
  useEffect(() => {
    if (airQualityData?.success && airQualityData.data.length > 0) {
      const formatted = airQualityData.data
        .map(item => airQualityUtils.formatStationData(item))
        .filter(item => item && item.aqi > 0)

      setProcessedData(formatted)

      // 計算縣市統計
      const grouped = airQualityUtils.groupByCounty(airQualityData.data)
      const stats = {}
      
      Object.keys(grouped).forEach(county => {
        const countyData = grouped[county].filter(item => item && item.aqi > 0)
        if (countyData.length > 0) {
          stats[county] = {
            average: airQualityUtils.calculateCountyAverage(countyData),
            count: countyData.length,
            maxAQI: Math.max(...countyData.map(item => item.aqi)),
            minAQI: Math.min(...countyData.map(item => item.aqi))
          }
        }
      })
      
      setCountyStats(stats)
    }
  }, [airQualityData])

  // 表格欄位定義
  const columns = [
    {
      title: '測站名稱',
      dataIndex: 'siteName',
      key: 'siteName',
      width: 120,
      fixed: 'left'
    },
    {
      title: '縣市',
      dataIndex: 'county',
      key: 'county',
      width: 80,
      filters: [...new Set(processedData.map(item => item.county))]
        .map(county => ({ text: county, value: county })),
      onFilter: (value, record) => record.county === value
    },
    {
      title: 'AQI',
      dataIndex: 'aqi',
      key: 'aqi',
      width: 80,
      sorter: (a, b) => a.aqi - b.aqi,
      render: (aqi, record) => (
        <Space>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {aqi}
          </span>
          <Tag 
            color={record.aqiLevel.color}
            style={{ margin: 0 }}
          >
            {record.aqiLevel.label}
          </Tag>
        </Space>
      )
    },
    {
      title: 'PM2.5',
      dataIndex: ['pollutants', 'pm25'],
      key: 'pm25',
      width: 80,
      render: (value) => value ? `${value} μg/m³` : '-',
      sorter: (a, b) => (a.pollutants?.pm25 || 0) - (b.pollutants?.pm25 || 0)
    },
    {
      title: 'PM10',
      dataIndex: ['pollutants', 'pm10'],
      key: 'pm10',
      width: 80,
      render: (value) => value ? `${value} μg/m³` : '-',
      sorter: (a, b) => (a.pollutants?.pm10 || 0) - (b.pollutants?.pm10 || 0)
    },
    {
      title: 'O₃',
      dataIndex: ['pollutants', 'o3'],
      key: 'o3',
      width: 80,
      render: (value) => value ? `${value} ppb` : '-'
    },
    {
      title: 'NO₂',
      dataIndex: ['pollutants', 'no2'],
      key: 'no2',
      width: 80,
      render: (value) => value ? `${value} ppb` : '-'
    },
    {
      title: 'SO₂',
      dataIndex: ['pollutants', 'so2'],
      key: 'so2',
      width: 80,
      render: (value) => value ? `${value} ppb` : '-'
    },
    {
      title: 'CO',
      dataIndex: ['pollutants', 'co'],
      key: 'co',
      width: 80,
      render: (value) => value ? `${value} ppm` : '-'
    },
    {
      title: '發布時間',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 120,
      render: (time) => time ? new Date(time).toLocaleString('zh-TW') : '-'
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === '正常' ? 'green' : 'orange'}>
          {status || '正常'}
        </Tag>
      )
    }
  ]

  // 縣市選項
  const countyOptions = Object.keys(countyStats)
    .sort()
    .map(county => (
      <Option key={county} value={county}>
        {county} ({countyStats[county].count}站)
      </Option>
    ))

  // 載入狀態
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="載入空氣品質資料中..." />
      </div>
    )
  }

  // 錯誤狀態
  if (error) {
    return (
      <Alert
        message="資料載入失敗"
        description={`無法載入空氣品質資料: ${error.userMessage || error.message}`}
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
          <CloudOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          空氣品質監測
        </Title>
        <Paragraph className="page-description">
          即時監測全台各地空氣品質狀況，包含 AQI、PM2.5、PM10、臭氧等主要污染指標
        </Paragraph>
      </div>

      {/* 統計摘要卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="監測站總數"
              value={processedData.length}
              prefix={<EnvironmentOutlined />}
              suffix="站"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="良好站點"
              value={processedData.filter(item => item.aqi <= 50).length}
              prefix={<CloudOutlined style={{ color: '#52c41a' }} />}
              suffix="站"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="警示站點"
              value={processedData.filter(item => item.aqi > 100).length}
              prefix={<ExclamationCircleOutlined style={{ color: '#f5222d' }} />}
              suffix="站"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="全台平均AQI"
              value={processedData.length > 0 ? 
                Math.round(processedData.reduce((sum, item) => sum + item.aqi, 0) / processedData.length) : 
                0
              }
              prefix={<CloudOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 過濾器 */}
      <Card style={{ marginBottom: '16px' }}>
        <Space>
          <span>選擇縣市：</span>
          <Select
            placeholder="全部縣市"
            style={{ width: 200 }}
            value={selectedCounty}
            onChange={setSelectedCounty}
            allowClear
          >
            {countyOptions}
          </Select>
        </Space>
      </Card>

      {/* 資料表格 */}
      <Card title="空氣品質監測資料" className="chart-container">
        <Table
          columns={columns}
          dataSource={processedData}
          rowKey="siteName"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `顯示 ${range[0]}-${range[1]} 筆，共 ${total} 筆資料`,
            pageSize: 20
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
    </div>
  )
}

export default AirQuality