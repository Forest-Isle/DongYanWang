import React from 'react';
import { Row, Col, Card, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FileTextOutlined, SolutionOutlined, TrophyOutlined, ProjectOutlined } from '@ant-design/icons';

// 自定义样式
const featureTileStyle = {
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: '8px',
  overflow: 'hidden',
  position: 'relative',
  padding: '32px',
};

const iconWrapperStyle = (color) => ({
  backgroundColor: color,
  color: 'white',
  padding: '16px',
  borderRadius: '50%',
  marginBottom: '16px',
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '64px',
  height: '64px',
});

const features = [
  {
    title: '论文分享',
    description: '分享和发现最新学术研究成果，获取专业领域前沿信息',
    icon: <FileTextOutlined style={{ fontSize: '24px' }} />,
    color: '#3498DB',
    path: '/papers',
    buttonText: '浏览论文',
  },
  {
    title: '实习经验',
    description: '了解各行业实习机会，分享实习经历和求职技巧',
    icon: <SolutionOutlined style={{ fontSize: '24px' }} />,
    color: '#2ECC71',
    path: '/internships',
    buttonText: '查看实习',
  },
  {
    title: '竞赛分享',
    description: '发现各类学术竞赛信息，分享参赛经验和获奖作品',
    icon: <TrophyOutlined style={{ fontSize: '24px' }} />,
    color: '#F39C12',
    path: '/competitions',
    buttonText: '探索竞赛',
  },
  {
    title: '项目申请',
    description: '寻找科研项目合作机会，对接导师资源和研究团队',
    icon: <ProjectOutlined style={{ fontSize: '24px' }} />,
    color: '#9B59B6',
    path: '/projects',
    buttonText: '申请项目',
  },
];

const FeatureTiles = () => {
  return (
    <div style={{ padding: '48px 0' }}>
      {/* <Typography.Title
        level={3}
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#2C3E50',
          marginBottom: '32px'
        }}
      >
        探索学术资源
      </Typography.Title> */}
      <Row gutter={[24, 24]} justify="center" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              hoverable
              style={featureTileStyle}
              bodyStyle={{ padding: 0 }}
            >
              <div style={iconWrapperStyle(feature.color)}>
                {feature.icon}
              </div>
              <Typography.Title level={5} style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {feature.title}
              </Typography.Title>
              <Typography.Paragraph type="secondary" style={{ marginBottom: '16px' }}>
                {feature.description}
              </Typography.Paragraph>
              <Button
                type="primary"
                style={{
                  backgroundColor: feature.color,
                  borderColor: feature.color
                }}
              >
                <Link to={feature.path} style={{ color: 'white' }}>
                  {feature.buttonText}
                </Link>
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FeatureTiles;