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

// 模拟特定类别下的项目数据
const getCategoryProjects = (category) => {
  // 这里可以根据传入的category返回不同的数据
  // 这里仅作为示例，实际应该从API获取
  return [
    {
      key: '1',
      name: `${category}领域重点项目A`,
      code: 'XYZ2024001',
      fundingAmount: '500万元',
      status: '进行中',
      fundingAgency: '国家自然科学基金委',
      isCooperation: true,
    },
    {
      key: '2',
      name: `${category}领域重大项目B`,
      code: 'XYZ2024002',
      fundingAmount: '800万元',
      status: '申请中',
      fundingAgency: '科技部',
      isCooperation: false,
    },
    {
      key: '3',
      name: `${category}研究前沿项目C`,
      code: 'XYZ2024003',
      fundingAmount: '300万元',
      status: '进行中',
      fundingAgency: '教育部',
      isCooperation: true,
    },
    {
      key: '4',
      name: `${category}综合研究项目D`,
      code: 'XYZ2024004',
      fundingAmount: '250万元',
      status: '已结题',
      fundingAgency: '地方科技厅',
      isCooperation: false,
    },
    {
      key: '5',
      name: `${category}专项研究项目E`,
      code: 'XYZ2024005',
      fundingAmount: '150万元',
      status: '进行中',
      fundingAgency: '企业合作',
      isCooperation: true,
    },
  ];
};

// 模拟热门项目帖子数据
const hotProjectPosts = [
  {
    id: 1,
    title: '2025科技创新基金项目申报指南',
    author: '王主任',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Director1',
    date: '2025-04-01',
    views: 4578,
    likes: 967,
    comments: 175,
  },
  {
    id: 2,
    title: '人工智能领域重点研发项目发布',
    author: '李教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
    date: '2025-03-28',
    views: 4234,
    likes: 892,
    comments: 156,
  },
  {
    id: 3,
    title: '青年科学基金项目申请经验分享',
    author: '张博士',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhD1',
    date: '2025-03-25',
    views: 3876,
    likes: 834,
    comments: 138,
  },
  {
    id: 4,
    title: '国家重点实验室开放课题招募',
    author: '赵研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Researcher1',
    date: '2025-03-20',
    views: 3654,
    likes: 767,
    comments: 124,
  },
  {
    id: 5,
    title: '产学研合作项目对接指南',
    author: '刘主管',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager1',
    date: '2025-03-15',
    views: 3432,
    likes: 698,
    comments: 112,
  },
  {
    id: 6,
    title: '重大科技专项申报要点解析',
    author: '陈专家',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Expert1',
    date: '2025-03-10',
    views: 3198,
    likes: 645,
    comments: 98,
  },
  {
    id: 7,
    title: '横向项目合同书撰写技巧',
    author: '吴老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1',
    date: '2025-03-05',
    views: 2987,
    likes: 587,
    comments: 86,
  },
  {
    id: 8,
    title: '国际合作项目申请流程详解',
    author: '孙教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof2',
    date: '2025-03-01',
    views: 2765,
    likes: 534,
    comments: 79,
  },
  {
    id: 9,
    title: '项目预算编制最新规定',
    author: '郑会计',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Account1',
    date: '2025-02-25',
    views: 2543,
    likes: 476,
    comments: 72,
  },
  {
    id: 10,
    title: '结题报告撰写要点指南',
    author: '黄秘书',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Secretary1',
    date: '2025-02-20',
    views: 2321,
    likes: 445,
    comments: 65,
  }
];

// 表格列定义
const columns = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`/projects/detail/${record.key}`}>{text}</Link>,
  },
  {
    title: '项目编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '资助金额',
    dataIndex: 'fundingAmount',
    key: 'fundingAmount',
    showSorterTooltip: false,
    sorter: (a, b) => {
      const amountA = parseFloat(a.fundingAmount.replace(/[^0-9.]/g, ''));
      const amountB = parseFloat(b.fundingAmount.replace(/[^0-9.]/g, ''));
      return amountA - amountB;
    },
  },
  {
    title: '项目状态',
    dataIndex: 'status',
    key: 'status',
    filters: [
      { text: '进行中', value: '进行中' },
      { text: '已结题', value: '已结题' },
      { text: '申请中', value: '申请中' },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => {
      let color = 'blue';
      if (status === '已结题') {
        color = 'green';
      } else if (status === '申请中') {
        color = 'orange';
      }
      return <Tag color={color}>{status}</Tag>;
    }
  },
  {
    title: '资助单位',
    dataIndex: 'fundingAgency',
    key: 'fundingAgency',
  },
  {
    title: '合作项目',
    dataIndex: 'isCooperation',
    key: 'isCooperation',
    render: (isCooperation) => isCooperation ? <Tag color="green">是</Tag> : <Tag color="orange">否</Tag>,
    filters: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    onFilter: (value, record) => record.isCooperation === value,
  },
];

const ProjectCategoryPage = () => {
  // 获取URL参数中的类别
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category || '国家自然科学基金'); // 默认值

  // 获取该类别下的项目数据
  const projects = getCategoryProjects(decodedCategory);

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <BreadcrumbNav
        items={[
          { title: '首页', path: '/' },
          { title: '项目', path: '/projects' },
          { title: decodedCategory },
        ]}
      />

      {/* 项目查询搜索框 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>{decodedCategory}查询</Title>
        <Row gutter={16}>
          <Col span={18}>
            <Input.Search
              placeholder="输入项目名称或项目编号"
              enterButton="搜索"
              size="large"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%', height: 40 }}
              placeholder="排序方式"
              defaultValue="fundingAmount"
            >
              <Option value="fundingAmount">按资助金额</Option>
              <Option value="name">按名称</Option>
              <Option value="fundingAgency">按资助单位</Option>
            </Select>
          </Col>
        </Row>
      </div>

      {/* 项目列表 */}
      <div>
        <Title level={4}>{decodedCategory}列表</Title>
        <Table
          dataSource={projects}
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
      posts={hotProjectPosts}
      title="版块热帖"
      type="projects/post"
    />
  );

  return (
    <SectionLayout
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
};

export default ProjectCategoryPage;