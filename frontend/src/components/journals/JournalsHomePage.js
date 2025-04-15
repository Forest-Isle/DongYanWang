import React from 'react';
import { Layout, Typography, Row, Col, Card, Input, Table, Breadcrumb, Tag, List, Avatar, Form, Select, InputNumber, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

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

// 模拟研究大类数据
const researchCategories = [
  {
    key: '1',
    category: '地球科学',
    journalCount: 156,
    highImpactCount: 42,
    recentUpdates: '2023-12-10',
  },
  {
    key: '2',
    category: '计算机科学',
    journalCount: 203,
    highImpactCount: 67,
    recentUpdates: '2023-12-15',
  },
  {
    key: '3',
    category: '生物医学',
    journalCount: 245,
    highImpactCount: 89,
    recentUpdates: '2023-12-12',
  },
  {
    key: '4',
    category: '物理学',
    journalCount: 178,
    highImpactCount: 53,
    recentUpdates: '2023-12-08',
  },
  {
    key: '5',
    category: '化学',
    journalCount: 192,
    highImpactCount: 61,
    recentUpdates: '2023-12-11',
  },
  {
    key: '6',
    category: '材料科学',
    journalCount: 167,
    highImpactCount: 48,
    recentUpdates: '2023-12-09',
  },
  {
    key: '7',
    category: '环境科学',
    journalCount: 134,
    highImpactCount: 37,
    recentUpdates: '2023-12-07',
  },
  {
    key: '8',
    category: '社会科学',
    journalCount: 112,
    highImpactCount: 29,
    recentUpdates: '2023-12-05',
  },
];

// 表格列定义
const columns = [
  {
    title: '研究大类',
    dataIndex: 'category',
    key: 'category',
    render: (text) => <Link to={`/journals/category/${text}`}>{text}</Link>,
  },
  {
    title: '期刊数量',
    dataIndex: 'journalCount',
    key: 'journalCount',
  },
  {
    title: '高影响因子期刊',
    dataIndex: 'highImpactCount',
    key: 'highImpactCount',
  },
  {
    title: '最近更新',
    dataIndex: 'recentUpdates',
    key: 'recentUpdates',
  },
];

const JournalsHomePage = () => {
  const [form] = Form.useForm();

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <BreadcrumbNav
        items={[
          { title: '首页', path: '/' },
          { title: '期刊' },
        ]}
      />

      {/* 期刊查询搜索框 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>期刊查询</Title>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={4}>
              <Form.Item name="journalName" label="期刊名">
                <Input placeholder="输入期刊名称" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="issn" label="ISSN">
                <Input placeholder="输入ISSN号" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="researchDirection" label="研究方向">
                <Input placeholder="输入研究方向" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="影响因子范围">
                <Space.Compact>
                  <Form.Item name="minImpactFactor" noStyle>
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="最小值" addonAfter='-' />
                  </Form.Item>
                  {/* <span style={{ margin: '0 8px' }}>_</span> */}
                  <Form.Item name="maxImpactFactor" noStyle>
                    <InputNumber style={{ width: '70.4%' }} min={0} placeholder="最大值" />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="sciIndexed" label="SCI收录">
                <Select placeholder="选择SCI收录情况">
                  <Select.Option value="yes">是</Select.Option>
                  <Select.Option value="no">否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="reset" label="重置">
                <Button onClick={() => form.resetFields()}>重置查询条件</Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="majorSubject" label="大类学科">
                <Select placeholder="选择大类学科">
                  {researchCategories.map(category => (
                    <Select.Option key={category.key} value={category.category}>
                      {category.category}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="minorSubject" label="小类学科">
                <Select placeholder="选择小类学科">
                  <Select.Option value="option1">小类学科1</Select.Option>
                  <Select.Option value="option2">小类学科2</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="casZone" label="中国科学院分区">
                <Select placeholder="选择分区">
                  <Select.Option value="1">1区</Select.Option>
                  <Select.Option value="2">2区</Select.Option>
                  <Select.Option value="3">3区</Select.Option>
                  <Select.Option value="4">4区</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="isOA" label="是否OA期刊">
                <Select placeholder="选择是否OA期刊">
                  <Select.Option value="yes">是</Select.Option>
                  <Select.Option value="no">否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="sortBy" label="结果排序">
                <Select placeholder="选择排序方式">
                  <Select.Option value="impact">按影响因子</Select.Option>
                  <Select.Option value="name">按期刊名称</Select.Option>
                  <Select.Option value="date">按更新日期</Select.Option>
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

      {/* 期刊推广及青英辅学卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card
            hoverable
            style={{
              background: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: 'none'
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Title level={4} style={{ color: '#10239e', marginBottom: 12, fontWeight: 600 }}>《自然科学进展》期刊正在征稿</Title>
            <Paragraph style={{ color: '#1a1a1a', marginBottom: 16, fontSize: '15px' }}>
              中国科学院主办的综合性科学期刊，现正面向全球征集相关领域的优秀研究论文。
              2025年第4期征稿截止日期为2025年6月30日，欢迎各位学者投稿。
            </Paragraph>
            <div>
              <Tag color="#2f54eb" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>SCI收录</Tag>
              <Tag color="#2f54eb" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>影响因子4.2</Tag>
              <Tag color="#2f54eb" style={{ color: '#ffffff', fontWeight: 'bold' }}>中科院2区</Tag>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            style={{
              background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: 'none'
            }}
            bodyStyle={{ padding: 20 }}
            onClick={() => window.open('/青英/1青英辅学.html', '_blank')}
          >
            <Title level={4} style={{ color: '#531dab', marginBottom: 12, fontWeight: 600 }}>青英辅学 - 名师带你论文零到一</Title>
            <Paragraph style={{ color: '#1a1a1a', marginBottom: 16, fontSize: '15px' }}>
              我们的学术写作专家团队提供一对一指导，从选题、文献综述、方法设计到论文撰写和投稿，
              全程陪伴，帮助你实现高质量学术论文的零基础到发表的飞跃！
            </Paragraph>
            <div>
              <Tag color="#722ed1" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>专业指导</Tag>
              <Tag color="#722ed1" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>全程跟踪</Tag>
              <Tag color="#722ed1" style={{ color: '#ffffff', fontWeight: 'bold' }}>提高发表率</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 研究大类表格 */}
      <div>
        <Title level={4}>研究大类浏览</Title>
        <Table
          dataSource={researchCategories}
          columns={columns}
          pagination={false}
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

export default JournalsHomePage;