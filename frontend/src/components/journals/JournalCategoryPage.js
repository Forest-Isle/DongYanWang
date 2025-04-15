import React from 'react';
import { Layout, Typography, Row, Col, Card, Input, Table, Breadcrumb, Tag, List, Avatar, Select, Divider } from 'antd';
import { SearchOutlined, FireOutlined, StarOutlined, FilterOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;

// 模拟特定类别下的期刊数据
const getCategoryJournals = (category) => {
  // 这里可以根据传入的category返回不同的数据
  // 这里仅作为示例，实际应该从API获取
  return [
    {
      key: '1',
      name: `${category}领域顶级期刊A`,
      issn: '1234-5678',
      impactFactor: 8.76,
      sciIndex: 'Q1',
      publisher: 'Elsevier',
      openAccess: true,
    },
    {
      key: '2',
      name: `${category}领域知名期刊B`,
      issn: '2345-6789',
      impactFactor: 6.54,
      sciIndex: 'Q1',
      publisher: 'Springer',
      openAccess: false,
    },
    {
      key: '3',
      name: `${category}研究前沿期刊C`,
      issn: '3456-7890',
      impactFactor: 5.32,
      sciIndex: 'Q2',
      publisher: 'Wiley',
      openAccess: true,
    },
    {
      key: '4',
      name: `${category}综合研究期刊D`,
      issn: '4567-8901',
      impactFactor: 4.87,
      sciIndex: 'Q2',
      publisher: 'Taylor & Francis',
      openAccess: false,
    },
    {
      key: '5',
      name: `${category}专业期刊E`,
      issn: '5678-9012',
      impactFactor: 3.95,
      sciIndex: 'Q3',
      publisher: 'SAGE',
      openAccess: true,
    },
  ];
};

// 模拟热门期刊帖子数据
const hotJournalPosts = [
  {
    id: 1,
    title: '《Nature》2025年最新投稿指南',
    author: '张教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
    date: '2025-04-01',
    views: 3256,
    likes: 728,
    comments: 142,
  },
  {
    id: 2,
    title: 'Science系列期刊投稿经验分享',
    author: '李研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof2',
    date: '2025-03-28',
    views: 2986,
    likes: 615,
    comments: 96,
  },
  {
    id: 3,
    title: '2025年最新SCI期刊影响因子发布解读',
    author: '王博士',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof3',
    date: '2025-03-25',
    views: 2542,
    likes: 526,
    comments: 88,
  },
  {
    id: 4,
    title: '如何选择适合自己研究方向的期刊？',
    author: '赵副教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof4',
    date: '2025-03-20',
    views: 2176,
    likes: 494,
    comments: 77,
  },
  {
    id: 5,
    title: '期刊审稿流程详解及应对策略',
    author: '刘编辑',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Editor1',
    date: '2025-03-15',
    views: 1924,
    likes: 467,
    comments: 69,
  },
  {
    id: 6,
    title: '顶级期刊常见退稿原因分析',
    author: '陈主编',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Editor2',
    date: '2025-03-10',
    views: 1856,
    likes: 445,
    comments: 65,
  },
  {
    id: 7,
    title: '如何写好Cover Letter？',
    author: '吴研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof5',
    date: '2025-03-05',
    views: 1788,
    likes: 423,
    comments: 61,
  },
  {
    id: 8,
    title: '期刊投稿英语写作技巧',
    author: '孙老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof6',
    date: '2025-03-01',
    views: 1677,
    likes: 398,
    comments: 57,
  },
  {
    id: 9,
    title: '如何应对审稿人的尖锐问题',
    author: '郑研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof7',
    date: '2025-02-25',
    views: 1589,
    likes: 376,
    comments: 52,
  },
  {
    id: 10,
    title: '高分文章选题方向分析',
    author: '黄教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof8',
    date: '2025-02-20',
    views: 1498,
    likes: 355,
    comments: 48,
  }
];

// 表格列定义
const columns = [
  {
    title: '期刊名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`/journals/detail/${record.key}`}>{text}</Link>,
  },
  {
    title: 'ISSN',
    dataIndex: 'issn',
    key: 'issn',
  },
  {
    title: '影响因子',
    dataIndex: 'impactFactor',
    key: 'impactFactor',
    showSorterTooltip: false,
    sorter: (a, b) => a.impactFactor - b.impactFactor,
  },
  {
    title: 'SCI分区',
    dataIndex: 'sciIndex',
    key: 'sciIndex',
    filters: [
      { text: 'Q1', value: 'Q1' },
      { text: 'Q2', value: 'Q2' },
      { text: 'Q3', value: 'Q3' },
      { text: 'Q4', value: 'Q4' },
    ],
    onFilter: (value, record) => record.sciIndex === value,
  },
  {
    title: '出版商',
    dataIndex: 'publisher',
    key: 'publisher',
  },
  {
    title: '开放获取',
    dataIndex: 'openAccess',
    key: 'openAccess',
    render: (openAccess) => openAccess ? <Tag color="green">是</Tag> : <Tag color="orange">否</Tag>,
    filters: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    onFilter: (value, record) => record.openAccess === value,
  },
];

const JournalCategoryPage = () => {
  // 获取URL参数中的类别
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category || '计算机科学'); // 默认值

  // 获取该类别下的期刊数据
  const journals = getCategoryJournals(decodedCategory);

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <BreadcrumbNav
        items={[
          { title: '首页', path: '/' },
          { title: '期刊', path: '/journals' },
          { title: decodedCategory },
        ]}
      />

      {/* 期刊查询搜索框 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>{decodedCategory}期刊查询</Title>
        <Row gutter={16}>
          <Col span={18}>
            <Input.Search
              placeholder="输入期刊名称或ISSN号"
              enterButton="搜索"
              size="large"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%', height: 40 }}
              placeholder="排序方式"
              defaultValue="impactFactor"
            >
              <Option value="impactFactor">按影响因子</Option>
              <Option value="name">按名称</Option>
              <Option value="publisher">按出版商</Option>
            </Select>
          </Col>
        </Row>
      </div>

      {/* 期刊列表 */}
      <div>
        <Title level={4}>{decodedCategory}期刊列表</Title>
        <Table
          dataSource={journals}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey="key"
        />
      </div>
    </>
  );

  // 右侧热门帖子区域
  const rightContent = (
    <HotPosts
      posts={hotJournalPosts}
      title="版块热帖"
      type="journals/post"
    />
  );

  return (
    <SectionLayout
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
};

export default JournalCategoryPage;