import React from 'react';
import { Layout, Typography, Row, Col, Card, Input, Table, Breadcrumb, Tag, List, Avatar, Form, Select, InputNumber, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

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

// 模拟学科分类数据
const subjectCategories = [
  {
    key: '1',
    category: '生命科学',
    skillCount: 156,
    popularCount: 42,
    recentUpdates: '2025-04-05',
  },
  {
    key: '2',
    category: '计算机科学',
    skillCount: 203,
    popularCount: 67,
    recentUpdates: '2025-04-06',
  },
  {
    key: '3',
    category: '医学研究',
    skillCount: 245,
    popularCount: 89,
    recentUpdates: '2025-04-02',
  },
  {
    key: '4',
    category: '物理实验',
    skillCount: 178,
    popularCount: 53,
    recentUpdates: '2025-04-01',
  },
  {
    key: '5',
    category: '化学分析',
    skillCount: 192,
    popularCount: 61,
    recentUpdates: '2025-04-03',
  },
  {
    key: '6',
    category: '材料科学',
    skillCount: 167,
    popularCount: 48,
    recentUpdates: '2025-03-30',
  },
  {
    key: '7',
    category: '环境监测',
    skillCount: 134,
    popularCount: 37,
    recentUpdates: '2025-03-28',
  },
  {
    key: '8',
    category: '数据分析',
    skillCount: 112,
    popularCount: 29,
    recentUpdates: '2025-03-25',
  },
];

// 模拟仪器类别数据
const instrumentCategories = [
  {
    key: '1',
    category: '显微镜类',
    deviceCount: 56,
    popularCount: 22,
    recentUpdates: '2025-04-05',
  },
  {
    key: '2',
    category: '光谱仪器',
    deviceCount: 83,
    popularCount: 37,
    recentUpdates: '2025-04-06',
  },
  {
    key: '3',
    category: '色谱设备',
    deviceCount: 65,
    popularCount: 29,
    recentUpdates: '2025-04-02',
  },
  {
    key: '4',
    category: '质谱仪器',
    deviceCount: 48,
    popularCount: 23,
    recentUpdates: '2025-04-01',
  },
  {
    key: '5',
    category: '核磁共振',
    deviceCount: 32,
    popularCount: 18,
    recentUpdates: '2025-04-03',
  },
  {
    key: '6',
    category: '电子显微镜',
    deviceCount: 27,
    popularCount: 15,
    recentUpdates: '2025-03-30',
  },
  {
    key: '7',
    category: '生化分析仪',
    deviceCount: 54,
    popularCount: 27,
    recentUpdates: '2025-03-28',
  },
  {
    key: '8',
    category: '测序仪器',
    deviceCount: 42,
    popularCount: 19,
    recentUpdates: '2025-03-25',
  },
  {
    key: '9',
    category: '测序仪器',
    deviceCount: 42,
    popularCount: 19,
    recentUpdates: '2025-03-25',
  },
];

// 模拟大学学科类别数据
const academicCategories = [
  {
    key: '1',
    category: '理学',
    skillCount: 156,
    popularCount: 42,
    recentUpdates: '2025-04-05',
  },
  {
    key: '2',
    category: '工学',
    skillCount: 203,
    popularCount: 67,
    recentUpdates: '2025-04-06',
  },
  {
    key: '3',
    category: '医学',
    skillCount: 245,
    popularCount: 89,
    recentUpdates: '2025-04-02',
  },
  {
    key: '4',
    category: '农学',
    skillCount: 128,
    popularCount: 43,
    recentUpdates: '2025-04-01',
  },
  {
    key: '5',
    category: '文学',
    skillCount: 92,
    popularCount: 31,
    recentUpdates: '2025-04-03',
  },
  {
    key: '6',
    category: '管理学',
    skillCount: 167,
    popularCount: 48,
    recentUpdates: '2025-03-30',
  },
  {
    key: '7',
    category: '艺术学',
    skillCount: 84,
    popularCount: 27,
    recentUpdates: '2025-03-28',
  },
  {
    key: '8',
    category: '教育学',
    skillCount: 112,
    popularCount: 29,
    recentUpdates: '2025-03-25',
  },
];

// 仪器类别表格列定义
const instrumentColumns = [
  {
    title: '仪器类别',
    dataIndex: 'category',
    key: 'category',
    render: (text) => <Link to={`/skills/category/${text}`}>{text}</Link>,
  },
  {
    title: '设备数量',
    dataIndex: 'deviceCount',
    key: 'deviceCount',
  },
  {
    title: '热门技巧',
    dataIndex: 'popularCount',
    key: 'popularCount',
  },
  {
    title: '最近更新',
    dataIndex: 'recentUpdates',
    key: 'recentUpdates',
  },
];

// 学科类别表格列定义
const academicColumns = [
  {
    title: '学科门类',
    dataIndex: 'category',
    key: 'category',
    render: (text) => <Link to={`/skills/category/${text}`}>{text}</Link>,
  },
  {
    title: '技巧数量',
    dataIndex: 'skillCount',
    key: 'skillCount',
  },
  {
    title: '热门技巧',
    dataIndex: 'popularCount',
    key: 'popularCount',
  },
  {
    title: '最近更新',
    dataIndex: 'recentUpdates',
    key: 'recentUpdates',
  },
];

const SkillsHomePage = () => {
  const [form] = Form.useForm();

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <BreadcrumbNav
        items={[
          { title: '首页', path: '/' },
          { title: '技巧' },
        ]}
      />

      {/* 技巧查询搜索框 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>技巧查询</Title>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="skillKeyword" label="关键词">
                <Input placeholder="输入设备、方法或软件关键词" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="majorSubject" label="学科领域">
                <Select placeholder="选择学科领域">
                  {subjectCategories.map(category => (
                    <Select.Option key={category.key} value={category.category}>
                      {category.category}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="search" label="查询">
                <Button type="primary" htmlType="submit">按当前条件查询</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 操作指南及青英大学老师卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card
            hoverable
            style={{
              background: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: 'none'
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Title level={4} style={{ color: '#006d75', marginBottom: 12, fontWeight: 600 }}>EndNote操作指南</Title>
            <Paragraph style={{ color: '#1a1a1a', marginBottom: 16, fontSize: '15px' }}>
              本指南详细介绍了如何使用EndNote进行文献收集、管理、引用和格式化参考文献。
              无论你是刚开始使用还是想要提高效率，这份操作指南都能帮助你更好地利用EndNote。
            </Paragraph>
            <div>
              <Tag color="#13c2c2" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>文献管理</Tag>
              <Tag color="#13c2c2" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>引用处理</Tag>
              <Tag color="#13c2c2" style={{ color: '#ffffff', fontWeight: 'bold' }}>效率提升</Tag>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            style={{
              background: 'linear-gradient(135deg, #f0f0ff 0%, #d6d6ff 100%)',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: 'none'
            }}
            bodyStyle={{ padding: 20 }}
            onClick={() => window.open('/青英/2青英大学老师.html', '_blank')}
          >
            <Title level={4} style={{ color: '#30336b', marginBottom: 12, fontWeight: 600 }}>青英大学老师 - 1V1咨询前辈和老师操作技巧</Title>
            <Paragraph style={{ color: '#1a1a1a', marginBottom: 16, fontSize: '15px' }}>
              想要了解最实用的实验操作技巧和仪器使用诀窍？我们的平台连接了各领域经验丰富的老师和前辈，
              提供1V1在线咨询，解答您在科研实践中遇到的各种技术难题！
            </Paragraph>
            <div>
              <Tag color="#4834d4" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>1V1咨询</Tag>
              <Tag color="#4834d4" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>经验分享</Tag>
              <Tag color="#4834d4" style={{ color: '#ffffff', fontWeight: 'bold' }}>实战技巧</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 技巧分类表格 */}
      <Row gutter={16}>
        <Col span={12}>
          <div style={{ marginBottom: 24 }}>
            <Title level={4}>仪器类别查看</Title>
            <Table
              dataSource={instrumentCategories}
              columns={instrumentColumns}
              pagination={false}
              rowKey="key"
            />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ marginBottom: 24 }}>
            <Title level={4}>学科类别查看</Title>
            <Table
              dataSource={academicCategories}
              columns={academicColumns}
              pagination={false}
              rowKey="key"
            />
          </div>
        </Col>
      </Row>
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

export default SkillsHomePage;