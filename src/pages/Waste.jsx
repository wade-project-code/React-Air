import { Typography, Card, Row, Col, Alert } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Waste = () => {
  return (
    <div>
      {/* 頁面標題 */}
      <div className="page-header">
        <Title level={2} className="page-title">
          <DeleteOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          廢棄物統計
        </Title>
        <Paragraph className="page-description">
          統計各縣市廢棄物產生量、回收率等資訊，分析廢棄物處理效率和資源回收成效
        </Paragraph>
      </div>

      <Alert
        message="功能開發中"
        description="廢棄物統計功能正在開發中，敬請期待。此頁面將提供全台各縣市廢棄物產生量、回收率、處理方式等統計資料，協助分析廢棄物管理效率和環境永續發展趨勢。"
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="產生量統計" hoverable>
            <Paragraph>
              各縣市家戶垃圾、事業廢棄物產生量統計和趨勢分析
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="回收率分析" hoverable>
            <Paragraph>
              資源回收成效統計，包含各類回收物的回收率變化
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="處理設施" hoverable>
            <Paragraph>
              廢棄物處理設施容量監控和處理效率分析
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Waste