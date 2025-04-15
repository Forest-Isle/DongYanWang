import React, { useState } from 'react';
import { Card, Typography, Tabs, List, Tag, Avatar, Space } from 'antd';
import { FireOutlined, LikeOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';
import SectionLayout from '../layout/SectionLayout';
import HotPosts from '../common/HotPosts';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 模拟关注内容数据
const followingData = [
  {
    id: 1,
    title: '如何提高论文写作效率？',
    author: '张教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
    date: '2023-06-15',
    description: '分享我多年来的论文写作经验和技巧，帮助大家提高写作效率...',
    tags: ['论文写作', '学术技巧'],
    likes: 156,
    comments: 42,
    views: 1024,
  },
  {
    id: 2,
    title: '2023年计算机视觉领域最新研究进展',
    author: '李研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof2',
    date: '2023-06-10',
    description: '本文总结了2023年计算机视觉领域的最新研究进展和突破...',
    tags: ['计算机视觉', '研究进展'],
    likes: 203,
    comments: 56,
    views: 1358,
  },
  {
    id: 3,
    title: '我的博士申请经验分享',
    author: '王同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student1',
    date: '2023-06-05',
    description: '分享我申请国内外博士项目的经验和心得，希望对大家有所帮助...',
    tags: ['博士申请', '留学'],
    likes: 178,
    comments: 63,
    views: 982,
  },
];

// 模拟发现内容数据
const discoverData = [
  {
    id: 1,
    title: '人工智能在医疗领域的应用前景',
    author: '赵教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof3',
    date: '2023-06-14',
    description: '探讨人工智能技术在医疗诊断、药物研发等领域的应用前景...',
    tags: ['人工智能', '医疗应用'],
    likes: 245,
    comments: 78,
    views: 1567,
  },
  {
    id: 2,
    title: '如何选择适合自己的研究方向？',
    author: '钱副教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof4',
    date: '2023-06-12',
    description: '分享如何根据个人兴趣、能力和就业前景选择合适的研究方向...',
    tags: ['研究方向', '学术规划'],
    likes: 189,
    comments: 52,
    views: 1245,
  },
  {
    id: 3,
    title: '2023年最新SCI期刊影响因子发布',
    author: '孙编辑',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Editor1',
    date: '2023-06-08',
    description: '2023年最新SCI期刊影响因子已发布，本文对主要学科领域的变化进行了分析...',
    tags: ['SCI', '影响因子'],
    likes: 312,
    comments: 87,
    views: 2134,
  },
];

// 模拟入站必看数据
const mustReadData = [
  {
    id: 1,
    title: '懂研青英网使用指南',
    author: '平台官方',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Official',
    date: '2023-06-01',
    description: '详细介绍懂研青英网的各项功能和使用方法，帮助新用户快速上手...',
    tags: ['使用指南', '新手必看'],
    likes: 456,
    comments: 123,
    views: 5678,
  },
  {
    id: 2,
    title: '学术研究入门：从选题到发表',
    author: '周教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof5',
    date: '2023-05-28',
    description: '为初入学术研究的同学提供全面指导，从研究选题、文献调研到论文发表...',
    tags: ['学术入门', '研究方法'],
    likes: 389,
    comments: 97,
    views: 3456,
  },
  {
    id: 3,
    title: '如何有效利用校园学术资源？',
    author: '吴研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Researcher1',
    date: '2023-05-25',
    description: '介绍如何充分利用图书馆、数据库、实验室等校园学术资源，提高研究效率...',
    tags: ['学术资源', '研究技巧'],
    likes: 267,
    comments: 74,
    views: 2345,
  },
];

// 模拟热榜数据
const hotListData = [
  {
    id: 1,
    title: '2024年全国研究生招生政策解读',
    views: 12567,
    hot: 9.8,
  },
  {
    id: 2,
    title: '如何准备国家自然科学基金申请？',
    views: 10234,
    hot: 9.5,
  },
  {
    id: 3,
    title: '顶尖期刊论文写作技巧分享',
    views: 9876,
    hot: 9.3,
  },
  {
    id: 4,
    title: '2023年计算机专业就业前景分析',
    views: 8765,
    hot: 9.0,
  },
  {
    id: 5,
    title: '海外名校博士申请经验总结',
    views: 7654,
    hot: 8.8,
  },
  {
    id: 6,
    title: '如何选择适合自己的导师？',
    views: 6543,
    hot: 8.5,
  },
  {
    id: 7,
    title: '学术论文常见审稿意见及应对策略',
    views: 5432,
    hot: 8.3,
  },
  {
    id: 8,
    title: '研究生期间如何规划自己的学术生涯？',
    views: 4321,
    hot: 8.0,
  },
];

const HomeContent = () => {
  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 渲染内容列表项
  const renderListItem = (item) => (
    <List.Item>
      <Card
        hoverable
        style={{ width: '100%' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div>
          <div style={{ marginBottom: '8px' }}>
            <Space>
              <Avatar src={item.avatar} />
              <Text strong>{item.author}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{item.date}</Text>
            </Space>
          </div>
          <Title level={5} style={{ marginBottom: '8px' }}>{item.title}</Title>
          <Paragraph ellipsis={{ rows: 2 }} type="secondary">
            {item.description}
          </Paragraph>
          <div style={{ marginTop: '12px' }}>
            <Space>
              {item.tags.map(tag => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
            </Space>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <Space>
              <Space>
                <EyeOutlined />
                <Text type="secondary">{item.views}</Text>
              </Space>
              <Space>
                <LikeOutlined />
                <Text type="secondary">{item.likes}</Text>
              </Space>
              <Space>
                <CommentOutlined />
                <Text type="secondary">{item.comments}</Text>
              </Space>
            </Space>
          </div>
        </div>
      </Card>
    </List.Item>
  );

  // 左侧内容区域
  const leftContent = (
    <Tabs activeKey={activeTab} onChange={handleTabChange}>
      <TabPane tab="关注" key="1">
        <List
          itemLayout="vertical"
          dataSource={followingData}
          renderItem={renderListItem}
          pagination={{
            pageSize: 5,
            simple: true,
          }}
        />
      </TabPane>
      <TabPane tab="发现" key="2">
        <List
          itemLayout="vertical"
          dataSource={discoverData}
          renderItem={renderListItem}
          pagination={{
            pageSize: 5,
            simple: true,
          }}
        />
      </TabPane>
      <TabPane tab="入站必看" key="3">
        <List
          itemLayout="vertical"
          dataSource={mustReadData}
          renderItem={renderListItem}
          pagination={{
            pageSize: 5,
            simple: true,
          }}
        />
      </TabPane>
    </Tabs>
  );

  // 右侧热榜区域
  const rightContent = (
    <HotPosts posts={hotListData} title="站内热榜" type="post" />
  );

  return (
    <SectionLayout
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
};

export default HomeContent;