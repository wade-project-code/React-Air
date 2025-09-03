import { Layout, Typography, Space, Divider } from 'antd'
import { 
  GithubOutlined, 
  MailOutlined,
  CopyrightOutlined,
  LinkOutlined
} from '@ant-design/icons'

const { Footer: AntFooter } = Layout
const { Text, Link } = Typography

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: '#f5f5f5',
        padding: '16px 24px',
        borderTop: '1px solid #e8e8e8'
      }}
    >
      <Space 
        direction="vertical" 
        size="small" 
        style={{ width: '100%' }}
      >
        {/* 主要資訊 */}
        <div>
          <Text strong style={{ fontSize: '14px' }}>
            台灣環境監測儀表板
          </Text>
          <Divider type="vertical" />
          <Text type="secondary">
            整合環保署開放資料，提供即時環境監測資訊
          </Text>
        </div>

        {/* 連結區域 */}
        <Space split={<Divider type="vertical" />} size="middle">
          <Link 
            href="https://data.moenv.gov.tw/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Space>
              <LinkOutlined />
              環保署開放資料平台
            </Space>
          </Link>
          
          <Link 
            href="mailto:"
          >
            <Space>
              <MailOutlined />
              聯絡我們
            </Space>
          </Link>

          <Link 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Space>
              <GithubOutlined />
              GitHub
            </Space>
          </Link>
        </Space>

        {/* 版權資訊 */}
        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <CopyrightOutlined /> {currentYear} 台灣環境監測儀表板. 
            資料來源：行政院環境保護署. 
            本專案僅供學習與研究使用。
          </Text>
        </div>

        {/* 技術資訊 */}
        <div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            Built with React + Vite + Ant Design | 
            使用現代化前端技術構建的環境監測視覺化平台
          </Text>
        </div>
      </Space>
    </AntFooter>
  )
}

export default Footer