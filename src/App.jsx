import { useState } from 'react'
import { Layout as AntLayout } from 'antd'
import Layout from './components/common/Layout'
import AppRouter from './router'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'

const { Content } = AntLayout

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AntLayout style={{ minHeight: '100vh' }}>
          <Layout>
            <Content style={{ 
              padding: '24px', 
              minHeight: 'calc(100vh - 64px - 69px)' // 扣除 Header 和 Footer 高度
            }}>
              <AppRouter />
            </Content>
          </Layout>
        </AntLayout>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App