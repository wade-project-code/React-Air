import { Typography, Card, Row, Col, Alert } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Reports = () => {
  return (
    <div>
      {/* 頁面標題 */}
      <div className="page-header">
        <Title level={2} className="page-title">
          <FileTextOutlined style={{ marginRight: '12px', color: '#fa8c16' }} />
          綜合報告
        </Title>
        <Paragraph className="page-description">
          跨領域環境指標整合分析，提供自動化報告生成和趨勢分析功能
        </Paragraph>
      </div>

      <Alert
        message="功能開發中"
        description="綜合報告功能正在開發中，敬請期待。此頁面將提供環境監測數據的綜合分析報告，包含跨領域指標整合、趨勢分析、異常警示、自動化報告生成等功能。"
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="環境趨勢報告" hoverable>
            <Paragraph>
              定期產生環境品質趨勢分析報告，包含各項指標變化趨勢
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="異常警示報告" hoverable>
            <Paragraph>
              自動偵測環境指標異常狀況，產生警示報告和建議措施
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="資料匯出" hoverable>
            <Paragraph>
              提供多種格式的資料匯出功能，支援進一步分析和應用
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Reports