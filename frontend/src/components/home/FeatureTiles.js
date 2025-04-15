import React from 'react';
import { Row, Col, Card, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FileTextOutlined, TrophyOutlined, ProjectOutlined, DiffOutlined, TeamOutlined } from '@ant-design/icons';

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
  padding: '24px',
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
    title: '期刊投稿',
    description: '分享和发现最新学术研究成果，获取专业领域前沿信息',
    icon: <FileTextOutlined style={{ fontSize: '24px' }} />,
    color: '#3498DB',
    path: '/journals',
    buttonText: '浏览期刊',
  },
  {
    title: '操作技巧',
    description: '了解设备仪器、科研方法、各类学术平台操作技巧，提高科研效率',
    icon: <DiffOutlined style={{ fontSize: '24px' }} />,
    color: '#2ECC71',
    path: '/skills',
    buttonText: '查看技巧',
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
    title: '项目立项',
    description: '寻找科研项目合作机会，对接导师资源和研究团队',
    icon: <ProjectOutlined style={{ fontSize: '24px' }} />,
    color: '#9B59B6',
    path: '/projects',
    buttonText: '申请项目',
  },
  {
    title: '导师招生',
    description: '了解各高校导师招生信息，寻找适合的研究生导师',
    icon: <TeamOutlined style={{ fontSize: '24px' }} />,
    color: '#E74C3C',
    path: '/admissions',
    buttonText: '查看招生',
  },
];

const FeatureTiles = () => {
  return (
    <div style={{ padding: '0 42px', marginTop: 20 }}>
      <Row
        gutter={[16, 16]}
        justify="space-between"
        style={{
          margin: '0 auto',
        }}
      >
        {features.map((feature, index) => (
          <Col key={index} style={{ flex: '1 0 18%' }}>
            <Card
              hoverable
              style={{...featureTileStyle, padding: '16px'}}
              bodyStyle={{ padding: 0 }}
            >
              <div style={iconWrapperStyle(feature.color)}>
                {feature.icon}
              </div>
              <Typography.Title level={5} style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {feature.title}
              </Typography.Title>
              <Typography.Paragraph type="secondary" style={{ marginBottom: '16px', fontSize: '12px' }}>
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