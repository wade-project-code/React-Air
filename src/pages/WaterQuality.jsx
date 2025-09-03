import { Typography, Card, Row, Col, Alert } from 'antd'
import { DropboxOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const WaterQuality = () => {
  return (
    <div>
      {/* 頁面標題 */}
      <div className="page-header">
        <Title level={2} className="page-title">
          <DropboxOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
          水質監測
        </Title>
        <Paragraph className="page-description">
          監測河川、湖泊水質狀況，包含溶氧量、生化需氧量、懸浮固體等重要水質參數
        </Paragraph>
      </div>

      <Alert
        message="功能開發中"
        description="水質監測功能正在開發中，敬請期待。此頁面將提供全台河川、湖泊水質監測資料，包含 pH 值、溶氧量、生化需氧量、懸浮固體等重要指標的即時監測和歷史趨勢分析。"
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="河川水質" hoverable>
            <Paragraph>
              即時監測主要河川水質狀況，提供 RPI (河川污染指標) 分析
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="湖泊水質" hoverable>
            <Paragraph>
              監測重要湖泊、水庫的水質變化和污染狀況
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="地下水質" hoverable>
            <Paragraph>
              追蹤地下水質監測井的水質參數和污染趨勢
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default WaterQuality