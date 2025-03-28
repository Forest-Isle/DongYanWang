import React from 'react';
import { Typography, Button, Row, Col } from 'antd';

// 自定义样式
const heroContainerStyle = {
  position: 'relative',
  backgroundColor: '#2C3E50',
  color: '#fff',
  padding: '64px 0 48px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  marginBottom: '32px',
  borderRadius: 0,
  overflow: 'hidden',
};

const heroOverlayStyle = {
  content: '',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1,
};

const contentBoxStyle = {
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
};

const HeroSection = () => {
  // 模拟轮播数据 - 对应四个主要分类
  const carouselItems = [
    {
      id: 1,
      title: '论文分享，探索学术前沿',
      quote: '分享和发现最新学术研究成果，获取专业领域前沿信息。',
      author: '张教授 - 计算机科学学院',
    },
    {
      id: 2,
      title: '实习经验，拓展职业视野',
      quote: '了解各行业实习机会，分享实习经历和求职技巧。',
      author: '王同学 - 计算机科学专业',
    },
    {
      id: 3,
      title: '竞赛分享，展示创新成果',
      quote: '发现各类学术竞赛信息，分享参赛经验和获奖作品。',
      author: '李同学 - 人工智能专业',
    },
    {
      id: 4,
      title: '项目申请，对接研究资源',
      quote: '寻找科研项目合作机会，对接导师资源和研究团队。',
      author: '赵教授 - 人工智能研究中心',
    },
  ];

  // 当前只展示第一个项目，实际项目中可以添加轮播功能
  // const currentItem = carouselItems[0];
// 使用useState来管理当前展示的轮播项
const [currentIndex, setCurrentIndex] = React.useState(0);
const currentItem = carouselItems[currentIndex];

// 自动轮播效果
React.useEffect(() => {
  const timer = setInterval(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  }, 5000); // 每5秒切换一次

  return () => clearInterval(timer);
}, []);

// 切换到下一个轮播项
const nextSlide = () => {
  setCurrentIndex((prevIndex) =>
    prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
  );
};

// 切换到上一个轮播项
const prevSlide = () => {
  setCurrentIndex((prevIndex) =>
    prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
  );
};

// 切换到指定轮播项
const goToSlide = (index) => {
  setCurrentIndex(index);
};

  return (
    <div style={heroContainerStyle}>
      <div style={heroOverlayStyle}></div>
      <div style={contentBoxStyle}>
        <Row justify="center">
          <Col xs={22} sm={20} md={16} lg={14} xl={12}>
            <Typography.Title
              level={1}
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: window.innerWidth < 768 ? '2rem' : '3.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                marginBottom: '16px'
              }}
            >
              {currentItem.title}
            </Typography.Title>
            <Typography.Paragraph
              style={{
                color: 'white',
                fontSize: window.innerWidth < 768 ? '1.2rem' : '1.5rem',
                maxWidth: '800px',
                margin: '0 auto 24px auto',
                fontStyle: 'italic',
              }}
            >
              {currentItem.quote}
            </Typography.Paragraph>
            <Typography.Text
              style={{
                display: 'block',
                marginBottom: '32px',
                color: '#F39C12',
                fontSize: '16px'
              }}
            >
              {currentItem.author}
            </Typography.Text>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HeroSection;