import { Typography, Card, Row, Col, Alert } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Stations = () => {
  return (
    <div>
      {/* 頁面標題 */}
      <div className="page-header">
        <Title level={2} className="page-title">
          <EnvironmentOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
          環境監測站
        </Title>
        <Paragraph className="page-description">
          管理全台環境監測站資訊，包含站點分布、設備狀態、資料品質等
        </Paragraph>
      </div>

      <Alert
        message="功能開發中"
        description="環境監測站管理功能正在開發中，敬請期待。此頁面將提供全台環境監測站的詳細資訊，包含站點位置、設備狀態、維護排程、資料完整性檢查等管理功能。"
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="站點分布" hoverable>
            <Paragraph>
              全台監測站地理分布和密度分析，確保監測網絡覆蓋完整
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="設備狀態" hoverable>
            <Paragraph>
              監測站設備運行狀態、故障記錄和維護需求管理
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="資料品質" hoverable>
            <Paragraph>
              監測資料完整性和準確性檢查，確保資料品質可靠
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Stations