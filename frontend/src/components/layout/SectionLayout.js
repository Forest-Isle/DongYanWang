import React from 'react';
import { Layout, Row, Col, Card } from 'antd';

const { Content } = Layout;

/**
 * 板块通用布局组件
 * @param {React.ReactNode} leftContent - 左侧内容
 * @param {React.ReactNode} rightContent - 右侧内容（通常是热门帖子）
 * @param {Object} props - 其他属性
 */
const SectionLayout = ({ leftContent, rightContent, ...props }) => {
  return (
    <Content style={{ padding: '0 50px', marginTop: '-16px', paddingTop: '36px' , backgroundColor: '#f5f5f5' }}>
      <Row gutter={[24, 24]}>
        {/* 左侧内容区域 */}
        <Col xs={24} sm={24} md={18} lg={18} xl={18}>
          <Card>
            {leftContent}
          </Card>
        </Col>

        {/* 右侧内容区域（通常是热门帖子） */}
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Card>
            {rightContent}
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default SectionLayout;