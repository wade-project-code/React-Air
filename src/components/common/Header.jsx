import { useState } from 'react'
import { Layout, Menu, Button, Dropdown, Space, Typography, theme } from 'antd'
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  BulbOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { useTheme } from '../../context/ThemeContext'

const { Header: AntHeader } = Layout
const { Title } = Typography

const Header = ({ collapsed, onToggle }) => {
  const { isDark, toggleTheme } = useTheme()
  const { token } = theme.useToken()

  // 使用者下拉選單
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '個人資料'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系統設定'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '登出',
      danger: true
    }
  ]

  // 通知下拉選單
  const notificationItems = [
    {
      key: '1',
      label: '空氣品質異常警告',
      description: '台北市空氣品質達到不良等級'
    },
    {
      key: '2', 
      label: '系統維護通知',
      description: '系統將於今晚進行例行維護'
    },
    {
      type: 'divider'
    },
    {
      key: 'all',
      label: '查看全部通知'
    }
  ]

  return (
    <AntHeader
      style={{
        padding: '0 16px',
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      {/* 左側 - 選單切換和標題 */}
      <Space size="large">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{
            fontSize: '16px',
            width: 40,
            height: 40
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/vite.svg" 
            alt="Logo" 
            style={{ width: 32, height: 32 }}
          />
          <Title 
            level={4} 
            style={{ 
              margin: 0, 
              color: token.colorText,
              fontWeight: 600
            }}
          >
            台灣環境監測儀表板
          </Title>
        </div>
      </Space>

      {/* 右側 - 功能按鈕 */}
      <Space size="middle">
        {/* 主題切換 */}
        <Button
          type="text"
          icon={<BulbOutlined />}
          onClick={toggleTheme}
          style={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isDark ? '切換到亮色主題' : '切換到暗色主題'}
        />

        {/* 通知 */}
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </Dropdown>

        {/* 使用者選單 */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            icon={<UserOutlined />}
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header