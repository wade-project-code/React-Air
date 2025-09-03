import { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  DashboardOutlined,
  CloudOutlined,
  DropboxOutlined,
  DeleteOutlined,
  RadarChartOutlined,
  FileTextOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'

const { Sider } = Layout

const Sidebar = ({ collapsed, onCollapse }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState('dashboard')

  // 選單項目配置
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '總覽儀表板',
      path: '/dashboard'
    },
    {
      key: 'air-quality',
      icon: <CloudOutlined />,
      label: '空氣品質監測',
      path: '/air-quality'
    },
    {
      key: 'water-quality',
      icon: <DropboxOutlined />,
      label: '水質監測',
      path: '/water-quality'
    },
    {
      key: 'waste',
      icon: <DeleteOutlined />,
      label: '廢棄物統計',
      path: '/waste'
    },
    {
      key: 'stations',
      icon: <EnvironmentOutlined />,
      label: '環境監測站',
      path: '/stations'
    },
    {
      type: 'divider'
    },
    {
      key: 'reports',
      icon: <FileTextOutlined />,
      label: '綜合報告',
      path: '/reports'
    }
  ]

  // 根據當前路由設定選中的選單項
  useEffect(() => {
    const currentPath = location.pathname
    const currentItem = menuItems.find(item => item.path === currentPath)
    if (currentItem) {
      setSelectedKey(currentItem.key)
    }
  }, [location.pathname])

  // 處理選單點擊
  const handleMenuClick = ({ key }) => {
    const menuItem = menuItems.find(item => item.key === key)
    if (menuItem && menuItem.path) {
      setSelectedKey(key)
      navigate(menuItem.path)
    }
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={260}
      collapsedWidth={80}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 999
      }}
      theme="light"
    >
      {/* Logo 區域 */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 16px',
          borderBottom: '1px solid #f0f0f0',
          background: '#fff'
        }}
      >
        {collapsed ? (
          <img 
            src="/vite.svg" 
            alt="Logo" 
            style={{ width: 32, height: 32 }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/vite.svg" 
              alt="Logo" 
              style={{ width: 24, height: 24 }}
            />
            <span style={{ 
              fontSize: '16px', 
              fontWeight: 600,
              color: '#1890ff'
            }}>
              環境監測
            </span>
          </div>
        )}
      </div>

      {/* 選單 */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ 
          height: 'calc(100% - 64px)',
          borderRight: 0,
          paddingTop: '8px'
        }}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  )
}

export default Sidebar