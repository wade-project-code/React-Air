import { useState } from 'react'
import { Layout as AntLayout } from 'antd'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

const { Content } = AntLayout

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* 側邊欄 */}
      <Sidebar 
        collapsed={collapsed} 
        onCollapse={setCollapsed} 
      />
      
      {/* 主要內容區域 */}
      <AntLayout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: 'margin-left 0.2s'
        }}
      >
        {/* 頂部導航 */}
        <Header 
          collapsed={collapsed} 
          onToggle={handleToggleCollapse} 
        />
        
        {/* 內容區域 */}
        <Content
          style={{
            minHeight: 'calc(100vh - 64px - 69px)', // 扣除 Header 和 Footer
            background: '#f0f2f5',
            padding: '24px'
          }}
        >
          {children}
        </Content>
        
        {/* 底部 */}
        <Footer />
      </AntLayout>
    </AntLayout>
  )
}

export default Layout