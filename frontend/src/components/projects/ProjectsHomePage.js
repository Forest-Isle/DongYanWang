import React from 'react';
import { Layout, Typography, Row, Col, Card, Input, Table, Breadcrumb, Tag, List, Avatar, Form, Select, InputNumber, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

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

// 模拟项目大类数据
const projectCategories = [
  {
    key: '1',
    category: '国家自然科学基金',
    projectCount: 156,
    fundingAmount: '5亿元',
    recentUpdates: '2023-12-10',
  },
  {
    key: '2',
    category: '国家重点研发计划',
    projectCount: 203,
    fundingAmount: '10亿元',
    recentUpdates: '2023-12-15',
  },
  {
    key: '3',
    category: '国家社会科学基金',
    projectCount: 145,
    fundingAmount: '3亿元',
    recentUpdates: '2023-12-12',
  },
  {
    key: '4',
    category: '省部级项目',
    projectCount: 278,
    fundingAmount: '2亿元',
    recentUpdates: '2023-12-08',
  },
  {
    key: '5',
    category: '企业合作项目',
    projectCount: 192,
    fundingAmount: '6亿元',
    recentUpdates: '2023-12-11',
  },
  {
    key: '6',
    category: '国际合作项目',
    projectCount: 87,
    fundingAmount: '4亿元',
    recentUpdates: '2023-12-09',
  },
  {
    key: '7',
    category: '校级科研项目',
    projectCount: 134,
    fundingAmount: '5000万元',
    recentUpdates: '2023-12-07',
  },
  {
    key: '8',
    category: '横向科研项目',
    projectCount: 112,
    fundingAmount: '3亿元',
    recentUpdates: '2023-12-05',
  },
];

// 表格列定义
const columns = [
  {
    title: '项目大类',
    dataIndex: 'category',
    key: 'category',
    render: (text) => <Link to={`/projects/category/${text}`}>{text}</Link>,
  },
  {
    title: '项目数量',
    dataIndex: 'projectCount',
    key: 'projectCount',
  },
  {
    title: '资助金额',
    dataIndex: 'fundingAmount',
    key: 'fundingAmount',
  },
  {
    title: '最近更新',
    dataIndex: 'recentUpdates',
    key: 'recentUpdates',
  },
];

const ProjectsHomePage = () => {
  const [form] = Form.useForm();

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <BreadcrumbNav
        items={[
          { title: '首页', path: '/' },
          { title: '项目' },
        ]}
      />

      {/* 项目查询搜索框 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>项目查询</Title>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={4}>
              <Form.Item name="projectName" label="项目名称">
                <Input placeholder="输入项目名称" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="projectCode" label="项目编号">
                <Input placeholder="输入项目编号" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="researchDirection" label="研究方向">
                <Input placeholder="输入研究方向" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="资助金额范围">
                <Space.Compact>
                  <Form.Item name="minFunding" noStyle>
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="最小值" step={1000} addonAfter='-' />
                  </Form.Item>
                  <Form.Item name="maxFunding" noStyle>
                    <InputNumber style={{ width: '70.4%' }} min={0} placeholder="最大值" step={1000} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="projectStatus" label="项目状态">
                <Select placeholder="选择项目状态">
                  <Select.Option value="inProgress">进行中</Select.Option>
                  <Select.Option value="completed">已结题</Select.Option>
                  <Select.Option value="applying">申请中</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="reset" label="重置">
                <Button onClick={() => form.resetFields()}>重置查询条件</Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="majorCategory" label="项目大类">
                <Select placeholder="选择项目大类">
                  {projectCategories.map(category => (
                    <Select.Option key={category.key} value={category.category}>
                      {category.category}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="subCategory" label="项目小类">
                <Select placeholder="选择项目小类">
                  <Select.Option value="option1">项目小类1</Select.Option>
                  <Select.Option value="option2">项目小类2</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="fundingAgency" label="资助单位">
                <Select placeholder="选择资助单位">
                  <Select.Option value="nsfc">国家自然科学基金委</Select.Option>
                  <Select.Option value="most">科技部</Select.Option>
                  <Select.Option value="moe">教育部</Select.Option>
                  <Select.Option value="local">地方科技厅</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="isCooperation" label="是否合作项目">
                <Select placeholder="选择是否合作项目">
                  <Select.Option value="yes">是</Select.Option>
                  <Select.Option value="no">否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="sortBy" label="结果排序">
                <Select placeholder="选择排序方式">
                  <Select.Option value="funding">按资助金额</Select.Option>
                  <Select.Option value="name">按项目名称</Select.Option>
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

      {/* 项目申请及青英辅学卡片 */}
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
            <Title level={4} style={{ color: '#006d75', marginBottom: 12, fontWeight: 600 }}>国家自然科学基金面上项目正在申请中</Title>
            <Paragraph style={{ color: '#1a1a1a', marginBottom: 16, fontSize: '15px' }}>
              2025年国家自然科学基金面上项目申请已开始，全国各高校、科研院所的科研人员可登录科学基金网络信息系统提交申请。
              申请截止日期为2025年5月20日16:00，请有意向的研究者尽早准备材料。
            </Paragraph>
            <div>
              <Tag color="#13c2c2" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>国家级项目</Tag>
              <Tag color="#13c2c2" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>资助额度50-80万</Tag>
              <Tag color="#13c2c2" style={{ color: '#ffffff', fontWeight: 'bold' }}>期限4年</Tag>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            style={{
              background: 'linear-gradient(135deg, #fcffe6 0%, #f4ffb8 100%)',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: 'none'
            }}
            bodyStyle={{ padding: 20 }}
            onClick={() => window.open('/青英/1青英辅学.html', '_blank')}
          >
            <Title level={4} style={{ color: '#5b8c00', marginBottom: 12, fontWeight: 600 }}>青英辅学 - 大牛教你拿项目</Title>
            <Paragraph style={{ color: '#1a1a1a', marginBottom: 16, fontSize: '15px' }}>
              我们邀请了多位国家级项目评审专家和多位成功获得重大项目资助的学者，为您提供一对一项目申请指导，
              从选题、文献综述、研究方案到预算设计，助您在激烈的项目申请中脱颖而出！
            </Paragraph>
            <div>
              <Tag color="#7cb305" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>专家指导</Tag>
              <Tag color="#7cb305" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>方案优化</Tag>
              <Tag color="#7cb305" style={{ color: '#ffffff', fontWeight: 'bold' }}>提高中标率</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 项目大类表格 */}
      <div>
        <Title level={4}>项目大类浏览</Title>
        <Table
          dataSource={projectCategories}
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

export default ProjectsHomePage;