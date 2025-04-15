// 招生机会模块首页
import React from 'react';
import { Layout, Typography, Row, Col, Card, Input, Breadcrumb, Tag, Form, Button, Table, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

// 模拟热门招生帖子数据
const hotAdmissionPosts = [
  {
    id: 1,
    title: '2025年秋季TOP50高校科研项目汇总',
    author: '王主任',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Director1',
    date: '2025-04-01',
    views: 5678,
    likes: 1245,
    comments: 286,
  },
  {
    id: 2,
    title: '985高校预推免科研经历要求',
    author: '李教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
    date: '2025-03-28',
    views: 5234,
    likes: 1156,
    comments: 245,
  },
  {
    id: 3,
    title: '2025考研国家线预测与分析',
    author: '张老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1',
    date: '2025-03-25',
    views: 4876,
    likes: 987,
    comments: 203,
  },
  {
    id: 4,
    title: '顶尖高校课题组汇总指南',
    author: '赵导师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Supervisor1',
    date: '2025-03-20',
    views: 4543,
    likes: 876,
    comments: 187,
  },
  {
    id: 5,
    title: '硕士生科研能力培养攻略',
    author: '刘研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Researcher1',
    date: '2025-03-15',
    views: 4234,
    likes: 798,
    comments: 165,
  },
  {
    id: 6,
    title: '双一流高校科研平台介绍',
    author: '陈学长',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Senior1',
    date: '2025-03-10',
    views: 3987,
    likes: 734,
    comments: 148,
  },
  {
    id: 7,
    title: '跨专业考研实验室选择',
    author: '吴同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student1',
    date: '2025-03-05',
    views: 3765,
    likes: 687,
    comments: 134,
  },
  {
    id: 8,
    title: '高校实验室设备配置对比',
    author: '孙助教',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Assistant1',
    date: '2025-03-01',
    views: 3543,
    likes: 645,
    comments: 126,
  },
  {
    id: 9,
    title: '考研调剂实验室推荐',
    author: '郑老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher2',
    date: '2025-02-25',
    views: 3321,
    likes: 589,
    comments: 112,
  },
  {
    id: 10,
    title: '联合培养项目申请攻略',
    author: '黄教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof2',
    date: '2025-02-20',
    views: 3198,
    likes: 534,
    comments: 98,
  }
];

// 更新项目表格数据为简化版本
const projectTableData = {
  domestic: [
    { key: 'd1', name: '清华大学' },
    { key: 'd2', name: '北京大学' },
    { key: 'd3', name: '中国科学院' },
    { key: 'd4', name: '浙江大学' },
    { key: 'd5', name: '复旦大学' },
  ],
  international: [
    { key: 'i1', name: '麻省理工学院' },
    { key: 'i2', name: '新加坡国立大学' },
    { key: 'i3', name: '牛津大学' },
    { key: 'i4', name: '斯坦福大学' },
    { key: 'i5', name: '剑桥大学' },
  ],
  enterprise: [
    { key: 'e1', name: '华为' },
    { key: 'e2', name: '英特尔' },
    { key: 'e3', name: '百度' },
    { key: 'e4', name: '腾讯' },
    { key: 'e5', name: '阿里巴巴' },
  ],
};

// 更新学校分类数据为简化版本
const researchGroupCategories = {
  domestic: {
    type: '国内',
    subCategories: [
      {
        name: 'C9',
        schools: [
          { key: 'c1', name: '清华大学' },
          { key: 'c2', name: '北京大学' },
          { key: 'c3', name: '复旦大学' },
          { key: 'c4', name: '上海交通大学' },
          { key: 'c5', name: '浙江大学' },
          { key: 'c6', name: '中国科学技术大学' },
          { key: 'c7', name: '南京大学' },
          { key: 'c8', name: '哈尔滨工业大学' },
          { key: 'c9', name: '西安交通大学' },
        ]
      },
      {
        name: '985',
        schools: [
          { key: '985_1', name: '武汉大学' },
          { key: '985_2', name: '华中科技大学' },
          { key: '985_3', name: '南开大学' },
          { key: '985_4', name: '天津大学' },
          { key: '985_5', name: '同济大学' },
          { key: '985_6', name: '华东师范大学' },
          { key: '985_7', name: '四川大学' },
        ]
      },
    ]
  },
  international: {
    type: '国际',
    subCategories: [
      {
        name: 'Top 30',
        schools: [
          { key: 't30_1', name: '哈佛大学' },
          { key: 't30_2', name: '麻省理工学院' },
          { key: 't30_3', name: '斯坦福大学' },
          { key: 't30_4', name: '牛津大学' },
          { key: 't30_5', name: '剑桥大学' },
        ]
      },
      {
        name: 'Top 100',
        schools: [
          { key: 't100_1', name: '多伦多大学' },
          { key: 't100_2', name: '苏黎世联邦理工' },
          { key: 't100_3', name: '东京大学' },
          { key: 't100_4', name: '新加坡国立大学' },
          { key: 't100_5', name: '慕尼黑工业大学' },
        ]
      },
    ]
  }
};

// 简化项目表格列定义
const projectColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <Link to={`/admissions/detail/${record.name}?type=project`}>{text}</Link>
    ),
  },
];

const AdmissionsHomePage = () => {
  const [form] = Form.useForm();

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <BreadcrumbNav
        items={[
          { title: '首页', path: '/' },
          { title: '招生机会' },
        ]}
      />

      {/* 招生机会查询搜索框 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>招生机会查询</Title>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="name" label="名称">
                <Input placeholder="输入招生项目名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="school" label="学校">
                <Input placeholder="输入学校名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="location" label="地点">
                <Input placeholder="输入地点" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="search" label=" ">
                <Button type="primary" htmlType="submit">按当前条件查询</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 课题组及青英联盟卡片 */}
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
            <Title level={4} style={{ color: '#1d39c4', marginBottom: 12, fontWeight: 600 }}>中南大学人工智能研究所课题组接受考研调剂</Title>
            <Paragraph style={{ color: '#1a1a1a', marginBottom: 16, fontSize: '15px' }}>
              中南大学人工智能研究所徐教授课题组现接受2025年考研调剂生，研究方向包括自然语言处理、多模态学习与知识图谱。
              要求计算机、数学或相关专业背景，有较强的编程能力，具备机器学习基础知识。有意者请于4月30日前提交申请材料。
            </Paragraph>
            <div>
              <Tag color="#2f54eb" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>考研调剂</Tag>
              <Tag color="#2f54eb" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>人工智能方向</Tag>
              <Tag color="#2f54eb" style={{ color: '#ffffff', fontWeight: 'bold' }}>全额奖学金</Tag>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            style={{
              background: 'linear-gradient(135deg, #fff0f6 0%, #ffadd2 100%)',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: 'none'
            }}
            bodyStyle={{ padding: 20 }}
            onClick={() => window.open('/青英/3青英机会.html', '_blank')}
          >
            <Title level={4} style={{ color: '#c41d7f', marginBottom: 12, fontWeight: 600 }}>青英联盟正在招审稿人、编辑、答主</Title>
            <Paragraph style={{ color: '#1a1a1a', marginBottom: 16, fontSize: '15px' }}>
              青英联盟平台现面向各高校硕博生及教师招募审稿人、专栏编辑和学术答主。
              加入我们，您将接触前沿学术资讯，积累学术编辑经验，并获得一定报酬。特别欢迎有专业背景的科研工作者参与！
            </Paragraph>
            <div>
              <Tag color="#eb2f96" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>兼职工作</Tag>
              <Tag color="#eb2f96" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>学术交流</Tag>
              <Tag color="#eb2f96" style={{ color: '#ffffff', fontWeight: 'bold' }}>简历加分项</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 短期科研项目和课题组招生区域 */}
      <Row gutter={24}>
        <Col span={12}>
          <Card title={<Title level={4}>短期科研项目</Title>} style={{ marginBottom: 24 }}>
            <Tabs
              defaultActiveKey="domestic"
              items={[
                {
                  key: 'domestic',
                  label: '国内项目',
                  children: <Table
                    columns={projectColumns}
                    dataSource={projectTableData.domestic}
                    pagination={false}
                    size="small"
                  />,
                },
                {
                  key: 'international',
                  label: '国际项目',
                  children: <Table
                    columns={projectColumns}
                    dataSource={projectTableData.international}
                    pagination={false}
                    size="small"
                  />,
                },
                {
                  key: 'enterprise',
                  label: '企业实习',
                  children: <Table
                    columns={projectColumns}
                    dataSource={projectTableData.enterprise}
                    pagination={false}
                    size="small"
                  />,
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={<Title level={4}>课题组招生</Title>} style={{ marginBottom: 24 }}>
            <Tabs
              defaultActiveKey="domestic"
              items={[
                {
                  key: 'domestic',
                  label: '国内',
                  children: (
                    <>
                      {researchGroupCategories.domestic.subCategories.map((category, index) => (
                        <div key={index} style={{ marginBottom: 24 }}>
                          <Table
                            columns={[{
                              title: category.name,
                              dataIndex: 'name',
                              key: 'name',
                              render: (text, record) => (
                                <Link to={`/admissions/detail/${record.name}?type=research`}>{text}</Link>
                              ),
                            }]}
                            dataSource={category.schools}
                            pagination={false}
                            size="small"
                          />
                        </div>
                      ))}
                    </>
                  ),
                },
                {
                  key: 'international',
                  label: '国际',
                  children: (
                    <>
                      {researchGroupCategories.international.subCategories.map((category, index) => (
                        <div key={index} style={{ marginBottom: 24 }}>
                          <Table
                            columns={[{
                              title: category.name,
                              dataIndex: 'name',
                              key: 'name',
                              render: (text, record) => (
                                <Link to={`/admissions/detail/${record.name}?type=research`}>{text}</Link>
                              ),
                            }]}
                            dataSource={category.schools}
                            pagination={false}
                            size="small"
                          />
                        </div>
                      ))}
                    </>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );

  // 右侧热门帖子区域
  const rightContent = (
    <HotPosts
      posts={hotAdmissionPosts}
      title="版块热帖"
      type="admissions/detail"
      urlParams={(post) => `${post.id}?type=post`}
    />
  );

  return (
    <SectionLayout
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
};

export default AdmissionsHomePage;