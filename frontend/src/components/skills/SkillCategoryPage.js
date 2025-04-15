import React from 'react';
import { Layout, Typography, Row, Col, Input, Select, Table, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title } = Typography;
const { Option } = Select;

// 根据类别获取相关技巧数据
const getCategorySkills = (category) => {
  // 这里可以根据传入的category返回不同的数据
  return {
    devices: [
      {
        key: 'd1',
        name: `${category}相关设备A`,
        type: '设备',
        difficulty: '入门',
        viewCount: 1256,
        lastUpdate: '2025-04-05',
      },
      {
        key: 'd2',
        name: `${category}相关设备B`,
        type: '设备',
        difficulty: '中级',
        viewCount: 986,
        lastUpdate: '2025-04-03',
      },
      {
        key: 'd3',
        name: `${category}相关设备C`,
        type: '设备',
        difficulty: '高级',
        viewCount: 1542,
        lastUpdate: '2025-03-28',
      },
    ],
    methods: [
      {
        key: 'm1',
        name: `${category}相关方法A`,
        type: '方法',
        difficulty: '入门',
        viewCount: 856,
        lastUpdate: '2025-04-02',
      },
      {
        key: 'm2',
        name: `${category}相关方法B`,
        type: '方法',
        difficulty: '中级',
        viewCount: 1124,
        lastUpdate: '2025-03-30',
      },
    ],
    software: [
      {
        key: 's1',
        name: `${category}相关软件A`,
        type: '软件',
        difficulty: '中级',
        viewCount: 1435,
        lastUpdate: '2025-04-06',
      },
      {
        key: 's2',
        name: `${category}相关软件B`,
        type: '软件',
        difficulty: '高级',
        viewCount: 928,
        lastUpdate: '2025-03-25',
      },
    ],
  };
};

// 模拟热门技巧帖子数据
const hotSkillPosts = [
  {
    id: 1,
    title: '研究生如何高效管理时间？',
    author: '王教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
    date: '2025-04-01',
    views: 3856,
    likes: 892,
    comments: 156,
  },
  {
    id: 2,
    title: '论文写作必备神器推荐',
    author: '李博士',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof2',
    date: '2025-03-28',
    views: 3542,
    likes: 767,
    comments: 134,
  },
  {
    id: 3,
    title: '如何准备学术会议演讲？',
    author: '张研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof3',
    date: '2025-03-25',
    views: 3187,
    likes: 698,
    comments: 115,
  },
  {
    id: 4,
    title: '实验室数据管理技巧分享',
    author: '赵助理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof4',
    date: '2025-03-20',
    views: 2965,
    likes: 645,
    comments: 98,
  },
  {
    id: 5,
    title: '学术文献阅读方法总结',
    author: '刘老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof5',
    date: '2025-03-15',
    views: 2756,
    likes: 589,
    comments: 87,
  },
  {
    id: 6,
    title: '研究生入学前必备技能',
    author: '陈导师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof6',
    date: '2025-03-10',
    views: 2534,
    likes: 547,
    comments: 82,
  },
  {
    id: 7,
    title: 'EndNote文献管理软件使用指南',
    author: '吴研究生',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student1',
    date: '2025-03-05',
    views: 2398,
    likes: 512,
    comments: 76,
  },
  {
    id: 8,
    title: '如何制作高质量学术海报？',
    author: '孙助教',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1',
    date: '2025-03-01',
    views: 2187,
    likes: 476,
    comments: 69,
  },
  {
    id: 9,
    title: 'LaTeX排版技巧大全',
    author: '郑工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Engineer1',
    date: '2025-02-25',
    views: 2043,
    likes: 445,
    comments: 64,
  },
  {
    id: 10,
    title: '科研项目申请书撰写技巧',
    author: '黄教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof7',
    date: '2025-02-20',
    views: 1967,
    likes: 423,
    comments: 58,
  }
];

// 列定义
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`/skills/detail/${record.key}`}>{text}</Link>,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: (type) => {
      const colors = {
        '设备': 'blue',
        '方法': 'green',
        '软件': 'purple'
      };
      return <Tag color={colors[type]}>{type}</Tag>;
    }
  },
  {
    title: '难度',
    dataIndex: 'difficulty',
    key: 'difficulty',
    filters: [
      { text: '入门', value: '入门' },
      { text: '中级', value: '中级' },
      { text: '高级', value: '高级' },
    ],
    onFilter: (value, record) => record.difficulty === value,
  },
  {
    title: '查看次数',
    dataIndex: 'viewCount',
    key: 'viewCount',
    showSorterTooltip: false,
    sorter: (a, b) => a.viewCount - b.viewCount,
  },
  {
    title: '最近更新',
    dataIndex: 'lastUpdate',
    key: 'lastUpdate',
  },
];

const SkillCategoryPage = () => {
  // 获取URL参数中的类别
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category || '显微镜类');

  // 获取该类别下的技巧数据
  const categoryData = getCategorySkills(decodedCategory);

  // 合并设备、方法、软件为一个列表
  const allItems = [
    ...categoryData.devices,
    ...categoryData.methods,
    ...categoryData.software
  ];

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <BreadcrumbNav
        items={[
          { title: '首页', path: '/' },
          { title: '技巧', path: '/skills' },
          { title: decodedCategory },
        ]}
      />

      {/* 查询搜索框 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>{decodedCategory}相关查询</Title>
        <Row gutter={16}>
          <Col span={18}>
            <Input.Search
              placeholder={`输入${decodedCategory}相关的设备、方法或软件关键词`}
              enterButton="搜索"
              size="large"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%', height: 40 }}
              placeholder="排序方式"
              defaultValue="viewCount"
            >
              <Option value="viewCount">按查看次数</Option>
              <Option value="lastUpdate">按更新时间</Option>
            </Select>
          </Col>
        </Row>
      </div>

      {/* 技巧列表 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>{decodedCategory}相关列表</Title>
        <Table
          dataSource={allItems}
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
      posts={hotSkillPosts}
      title="版块热帖"
      type="skills/post"
    />
  );

  return (
    <SectionLayout
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
};

export default SkillCategoryPage;