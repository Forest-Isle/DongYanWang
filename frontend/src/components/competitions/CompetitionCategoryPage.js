import React from 'react';
import { Layout, Typography, Row, Col, Card, Input, Table, Breadcrumb, Tag, List, Avatar, Select, Divider, Form, Button } from 'antd';
import { SearchOutlined, FireOutlined, StarOutlined, FilterOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;

// 模拟特定类别下的竞赛数据
const getCategoryCompetitions = (category) => {
  // 这里可以根据传入的category返回不同的数据
  // 这里仅作为示例，实际应该从API获取
  return [
    {
      key: '1',
      name: `${category}全国大学生竞赛A`,
      level: '国家级',
      organizer: '教育部',
      deadline: '2025-06-15',
      bonus: true,
      bonusAmount: '50000元',
      popularityScore: 95,
    },
    {
      key: '2',
      name: `${category}创新创业大赛B`,
      level: '国家级',
      organizer: '科技部',
      deadline: '2025-07-20',
      bonus: true,
      bonusAmount: '100000元',
      popularityScore: 92,
    },
    {
      key: '3',
      name: `${category}省级学科竞赛C`,
      level: '省级',
      organizer: '浙江省教育厅',
      deadline: '2025-05-30',
      bonus: true,
      bonusAmount: '20000元',
      popularityScore: 85,
    },
    {
      key: '4',
      name: `${category}校企联合竞赛D`,
      level: '市级',
      organizer: '杭州市科技局',
      deadline: '2025-08-10',
      bonus: false,
      bonusAmount: '-',
      popularityScore: 78,
    },
    {
      key: '5',
      name: `${category}学院杯E`,
      level: '校级',
      organizer: '浙江大学',
      deadline: '2025-04-25',
      bonus: false,
      bonusAmount: '-',
      popularityScore: 65,
    },
  ];
};

// 竞赛级别选项
const competitionLevels = [
  { value: 'national', label: '国家级' },
  { value: 'provincial', label: '省级' },
  { value: 'municipal', label: '市级' },
  { value: 'school', label: '校级' }
];

// 模拟热门竞赛帖子数据
const hotCompetitionPosts = [
  {
    id: 1,
    title: '2025全国研究生数学建模竞赛报名开始',
    author: '王组长',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Organizer1',
    date: '2025-04-01',
    views: 4256,
    likes: 936,
    comments: 168,
  },
  {
    id: 2,
    title: '第十届"互联网+"大学生创新创业大赛简介',
    author: '李主任',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Director1',
    date: '2025-03-28',
    views: 3987,
    likes: 845,
    comments: 142,
  },
  {
    id: 3,
    title: '挑战杯全国大学生课外学术竞赛经验分享',
    author: '张教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coach1',
    date: '2025-03-25',
    views: 3654,
    likes: 778,
    comments: 126,
  },
  {
    id: 4,
    title: '2025年ACM程序设计大赛备赛指南',
    author: '赵指导',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor1',
    date: '2025-03-20',
    views: 3432,
    likes: 712,
    comments: 108,
  },
  {
    id: 5,
    title: '全国大学生电子设计竞赛报名须知',
    author: '刘老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1',
    date: '2025-03-15',
    views: 3198,
    likes: 654,
    comments: 95,
  },
  {
    id: 6,
    title: '研究生创新实践系列竞赛最新通知',
    author: '陈秘书',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Secretary1',
    date: '2025-03-10',
    views: 2876,
    likes: 598,
    comments: 87,
  },
  {
    id: 7,
    title: '"华为杯"研究生数学竞赛参赛攻略',
    author: '吴教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
    date: '2025-03-05',
    views: 2654,
    likes: 543,
    comments: 79,
  },
  {
    id: 8,
    title: '生物医学创新设计大赛筹备工作',
    author: '孙主管',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager1',
    date: '2025-03-01',
    views: 2432,
    likes: 487,
    comments: 71,
  },
  {
    id: 9,
    title: '人工智能创新应用大赛评分标准公布',
    author: '郑评委',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Judge1',
    date: '2025-02-25',
    views: 2198,
    likes: 456,
    comments: 64,
  },
  {
    id: 10,
    title: '研究生企业管理案例大赛往届回顾',
    author: '黄导师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Supervisor1',
    date: '2025-02-20',
    views: 2087,
    likes: 423,
    comments: 58,
  }
];

// 表格列定义
const columns = [
  {
    title: '竞赛名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`/competitions/detail/${record.key}`}>{text}</Link>,
  },
  {
    title: '竞赛级别',
    dataIndex: 'level',
    key: 'level',
    filters: [
      { text: '国家级', value: '国家级' },
      { text: '省级', value: '省级' },
      { text: '市级', value: '市级' },
      { text: '校级', value: '校级' },
    ],
    onFilter: (value, record) => record.level === value,
  },
  {
    title: '主办单位',
    dataIndex: 'organizer',
    key: 'organizer',
  },
  {
    title: '报名截止',
    dataIndex: 'deadline',
    key: 'deadline',
    showSorterTooltip: false,
    sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
  },
  {
    title: '奖金设置',
    dataIndex: 'bonus',
    key: 'bonus',
    render: (bonus, record) => bonus ? <Tag color="green">{record.bonusAmount}</Tag> : <Tag color="orange">无奖金</Tag>,
    filters: [
      { text: '有奖金', value: true },
      { text: '无奖金', value: false },
    ],
    onFilter: (value, record) => record.bonus === value,
  },
  {
    title: '热度指数',
    dataIndex: 'popularityScore',
    key: 'popularityScore',
    showSorterTooltip: false,
    sorter: (a, b) => a.popularityScore - b.popularityScore,
  },
];

const CompetitionCategoryPage = () => {
  // 获取URL参数中的类别
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category || '创新创业类'); // 默认值
  const [form] = Form.useForm();

  // 获取该类别下的竞赛数据
  const competitions = getCategoryCompetitions(decodedCategory);

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <BreadcrumbNav
        items={[
          { title: '首页', path: '/' },
          { title: '竞赛', path: '/competitions' },
          { title: decodedCategory },
        ]}
      />

      {/* 竞赛查询搜索框 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>{decodedCategory}竞赛查询</Title>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="keyword">
                <Input.Search
                  placeholder="输入竞赛名称关键词"
                  enterButton="搜索"
                  size="large"
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="level">
                <Select
                style={{ width: '100%', height: 40 }}
                placeholder="竞赛级别">
                  {competitionLevels.map(level => (
                    <Select.Option key={level.value} value={level.value}>
                      {level.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="bonus">
                <Select
                style={{ width: '100%', height: 40 }}
                placeholder="奖金设置">
                  <Select.Option value="yes">有奖金</Select.Option>
                  <Select.Option value="no">无奖金</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 竞赛列表 */}
      <div>
        <Title level={4}>{decodedCategory}竞赛列表</Title>
        <Table
          dataSource={competitions}
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
      posts={hotCompetitionPosts}
      title="版块热帖"
      type="competitions/post"
    />
  );

  return (
    <SectionLayout
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
};

export default CompetitionCategoryPage;