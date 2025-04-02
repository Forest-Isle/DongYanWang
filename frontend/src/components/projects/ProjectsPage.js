import React, { useState, useContext } from 'react';
import ResponsiveContext from '../../contexts/ResponsiveContext';
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Divider,
  List,
  Space,
  Tabs,
  Input,
  Select,
  Form,
  Rate,
  Modal,
  Drawer,
  FloatButton
} from 'antd';
import {
  PlusOutlined,
  FilterOutlined,
  LikeOutlined,
  CommentOutlined,
  StarOutlined,
  ShareAltOutlined,
  BankOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

// 模拟项目数据
const mockProjects = [
  {
    id: 1,
    title: '基于深度学习的医学影像分析系统',
    professor: '张教授',
    school: '清华大学',
    department: '计算机科学与技术系',
    category: '人工智能',
    duration: '6个月',
    deadline: '2023-07-30',
    requirements: '熟悉深度学习框架（PyTorch/TensorFlow），有计算机视觉相关经验，熟悉医学影像处理优先',
    description: '本项目旨在开发一套基于深度学习的医学影像分析系统，用于辅助医生诊断多种疾病。项目将使用大量标注数据训练深度神经网络，实现对X光片、CT、MRI等医学影像的自动分析和病变检测。',
    tags: ['深度学习', '医学影像', '计算机视觉'],
    applicants: 15,
    maxApplicants: 3,
    views: 245,
    likes: 56,
    comments: 12,
    professorRating: 4.8,
    image: 'https://picsum.photos/id/1/1080/540',
  },
  {
    id: 2,
    title: '智能交通系统优化研究',
    professor: '李教授',
    school: '北京大学',
    department: '信息科学技术学院',
    category: '智能系统',
    duration: '12个月',
    deadline: '2023-08-15',
    requirements: '熟悉强化学习算法，有交通流模拟经验，熟悉Python编程',
    description: '本项目将研究基于强化学习的智能交通信号控制系统，通过对城市交通流的实时分析和预测，动态调整交通信号配时方案，以减少交通拥堵，提高道路通行效率。',
    tags: ['强化学习', '智能交通', '优化算法'],
    applicants: 8,
    maxApplicants: 2,
    views: 187,
    likes: 42,
    comments: 9,
    professorRating: 4.5,
    image: 'https://picsum.photos/id/2/1080/540',
  },
  {
    id: 3,
    title: '区块链在供应链金融中的应用研究',
    professor: '王教授',
    school: '复旦大学',
    department: '经济学院',
    category: '区块链',
    duration: '9个月',
    deadline: '2023-09-01',
    requirements: '了解区块链技术原理，熟悉智能合约开发，对金融知识有一定了解',
    description: '本项目将研究区块链技术在供应链金融中的应用场景和实施方案，设计基于智能合约的供应链金融平台，解决中小企业融资难、融资贵的问题，提高供应链整体运行效率。',
    tags: ['区块链', '供应链金融', '智能合约'],
    applicants: 12,
    maxApplicants: 4,
    views: 210,
    likes: 38,
    comments: 15,
    professorRating: 4.6,
    image: 'https://picsum.photos/id/3/1080/540',
  },
];

// 筛选选项
const filterOptions = {
  categories: ['全部', '人工智能', '大数据', '区块链', '物联网', '智能系统', '软件工程', '网络安全'],
  schools: ['全部', '清华大学', '北京大学', '复旦大学', '浙江大学', '上海交通大学', '南京大学', '中国科学技术大学'],
  durations: ['全部', '3个月以内', '3-6个月', '6-12个月', '12个月以上'],
};

const ProjectsPage = () => {
  // 状态管理
  const [projects, setProjects] = useState(mockProjects);
  const [filters, setFilters] = useState({
    category: '全部',
    school: '全部',
    duration: '全部',
    keyword: '',
  });
  const [sortBy, setSortBy] = useState('latest');
  const [tabValue, setTabValue] = useState('1');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    major: '',
    grade: '',
    experience: '',
    motivation: '',
  });

  // 移动端控制状态
  const isMobile = useContext(ResponsiveContext);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // 处理筛选变化
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    // 实际项目中应该调用API进行筛选
  };

  // 处理排序变化
  const handleSortChange = (value) => {
    setSortBy(value);
    // 实际项目中应该调用API进行排序
  };

  // 处理标签切换
  const handleTabChange = (key) => {
    setTabValue(key);
    // 实际项目中应该根据标签切换不同的内容
  };

  // 打开项目申请对话框
  const handleOpenDialog = (project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  // 关闭项目申请对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 处理申请表单变化
  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 提交申请
  const handleSubmitApplication = () => {
    // 实际项目中应该调用API提交申请
    console.log('提交申请:', applicationForm);
    console.log('申请加入:', selectedProject);

    // 关闭对话框
    handleCloseDialog();

    // 重置表单
    setApplicationForm({
      name: '',
      email: '',
      phone: '',
      school: '',
      major: '',
      grade: '',
      experience: '',
      motivation: '',
    });
  };

  return (
    <Layout.Content style={{ padding: isMobile ? '24px 16px' : '24px 50px', position: 'relative' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontWeight: 'bold', color: '#2C3E50' }}>
          科研项目
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            backgroundColor: '#F39C12',
            borderColor: '#F39C12'
          }}
        >
          发布项目
        </Button>
      </Row>

      {/* 标签页 */}
      <Tabs
        activeKey={tabValue}
        onChange={handleTabChange}
        style={{ marginBottom: 24 }}
      >
        <TabPane tab="最新项目" key="1" />
        <TabPane tab="热门项目" key="2" />
        <TabPane tab="我的申请" key="3" />
      </Tabs>

      <Row gutter={24}>
        {/* 筛选侧边栏 - 桌面端 */}
        {!isMobile && (
          <Col xs={24} md={6}>
            <Card style={{ marginBottom: 24 }}>
              <Title level={5} style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                <FilterOutlined style={{ marginRight: 8 }} />
                筛选条件
              </Title>
              <Divider style={{ margin: '12px 0' }} />

              <Search
                placeholder="项目名称、导师、学校等"
                allowClear
                onSearch={(value) => handleFilterChange('keyword', value)}
                style={{ marginBottom: 16 }}
              />

              <Form layout="vertical">
                <Form.Item label="研究领域" style={{ marginBottom: 16 }}>
                  <Select
                    value={filters.category}
                    onChange={(value) => handleFilterChange('category', value)}
                    style={{ width: '100%' }}
                  >
                    {filterOptions.categories.map((category) => (
                      <Option key={category} value={category}>{category}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="学校" style={{ marginBottom: 16 }}>
                  <Select
                    value={filters.school}
                    onChange={(value) => handleFilterChange('school', value)}
                    style={{ width: '100%' }}
                  >
                    {filterOptions.schools.map((school) => (
                      <Option key={school} value={school}>{school}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="项目周期" style={{ marginBottom: 16 }}>
                  <Select
                    value={filters.duration}
                    onChange={(value) => handleFilterChange('duration', value)}
                    style={{ width: '100%' }}
                  >
                    {filterOptions.durations.map((duration) => (
                      <Option key={duration} value={duration}>{duration}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="排序方式" style={{ marginBottom: 16 }}>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    style={{ width: '100%' }}
                  >
                    <Option value="latest">最新发布</Option>
                    <Option value="deadline">截止日期</Option>
                    <Option value="popular">热门程度</Option>
                  </Select>
                </Form.Item>

                <Button type="primary" block style={{ marginTop: 8 }}>
                  应用筛选
                </Button>
              </Form>
            </Card>
          </Col>
        )}

        {/* 筛选抽屉 - 移动端 */}
        <Drawer
          title="筛选条件"
          placement="left"
          onClose={() => setFilterDrawerOpen(false)}
          open={filterDrawerOpen}
          // width={isMobile ? '100%' : 320}
          width={ 250 }
        >
          <Form layout="vertical">
            <Search
              placeholder="项目名称、导师、学校等"
              allowClear
              onSearch={(value) => handleFilterChange('keyword', value)}
              style={{ marginBottom: 16 }}
            />

            <Form.Item label="研究领域" style={{ marginBottom: 16 }}>
              <Select
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.categories.map((category) => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="学校" style={{ marginBottom: 16 }}>
              <Select
                value={filters.school}
                onChange={(value) => handleFilterChange('school', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.schools.map((school) => (
                  <Option key={school} value={school}>{school}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="项目周期" style={{ marginBottom: 16 }}>
              <Select
                value={filters.duration}
                onChange={(value) => handleFilterChange('duration', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.durations.map((duration) => (
                  <Option key={duration} value={duration}>{duration}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="排序方式" style={{ marginBottom: 16 }}>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                style={{ width: '100%' }}
              >
                <Option value="latest">最新发布</Option>
                <Option value="deadline">截止日期</Option>
                <Option value="popular">热门程度</Option>
              </Select>
            </Form.Item>

            <Button type="primary" block style={{ marginTop: 8 }}>
              应用筛选
            </Button>
          </Form>
        </Drawer>

        {/* 项目列表 */}
        <Col xs={24} md={isMobile ? 24 : 18}>
          {/* <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Text>
              共找到 <Text strong>{projects.length}</Text> 个项目
            </Text>
          </Row> */}

          <List
            itemLayout="vertical"
            dataSource={projects}
            renderItem={(project) => (
              <Card
                style={{
                  marginBottom: 16,
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                hoverable
                bodyStyle={{ padding: 0 }}
              >
                <Row>
                  {/* <Col xs={24} md={6}>
                    <div style={{
                      height: '100%',
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={project.image}
                        alt={project.title}
                        style={{
                          height: '100%',
                          width: '100%',
                          objectFit: 'cover',
                          minHeight: 200
                        }}
                      />
                    </div>
                  </Col> */}
                  <Col xs={24} md={24}>
                    <div style={{ padding: 24 }}>
                      <Title level={4} style={{ marginTop: 0, fontWeight: 'bold', color: '#2C3E50' }}>
                        {project.title}
                      </Title>

                      <Space wrap style={{ marginBottom: 16 }}>
                        <Space>
                          <UserOutlined style={{ color: '#7F8C8D' }} />
                          <Text type="secondary">{project.professor}</Text>
                        </Space>
                        <Space>
                          <BankOutlined style={{ color: '#7F8C8D' }} />
                          <Text type="secondary">{project.school}</Text>
                        </Space>
                        <Space>
                          <ClockCircleOutlined style={{ color: '#7F8C8D' }} />
                          <Text type="secondary">{project.duration}</Text>
                        </Space>
                        <Space>
                          <CalendarOutlined style={{ color: '#7F8C8D' }} />
                          <Text type="secondary">截止: {project.deadline}</Text>
                        </Space>
                      </Space>

                      <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 16 }}>
                        {project.description}
                      </Paragraph>

                      <div style={{ marginBottom: 16 }}>
                        {project.tags.map((tag) => (
                          <Tag key={tag} style={{ marginBottom: 8 }}>{tag}</Tag>
                        ))}
                      </div>

                      <Row justify="space-between">
                        <Space>
                          <Text type="secondary">导师评分:</Text>
                          <Rate disabled defaultValue={project.professorRating} allowHalf />
                        </Space>
                        <Text type="secondary">
                          已申请: {project.applicants}/{project.maxApplicants}
                        </Text>
                      </Row>
                    </div>

                    <Divider style={{ margin: 0 }} />

                    <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between' }}>
                      <Space>
                        <Button type="text" icon={<LikeOutlined />}>
                          {project.likes}
                        </Button>
                        <Button type="text" icon={<CommentOutlined />}>
                          {project.comments}
                        </Button>
                        <Button type="text" icon={<StarOutlined />} />
                        <Button type="text" icon={<ShareAltOutlined />} />
                      </Space>

                      <Button
                        type="primary"
                        onClick={() => handleOpenDialog(project)}
                        style={{
                          backgroundColor: '#F39C12',
                          borderColor: '#F39C12'
                        }}
                      >
                        申请加入
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}
          />
        </Col>
      </Row>

      {/* 移动端悬浮按钮 */}
      {isMobile && (
        <FloatButton
          icon={<FilterOutlined />}
          type="primary"
          style={{ right: 24, bottom: 24 }}
          onClick={() => setFilterDrawerOpen(true)}
        />
      )}

      {/* 项目申请对话框 */}
      <Modal
        title={<div style={{ fontWeight: 'bold' }}>项目申请: {selectedProject?.title}</div>}
        open={openDialog}
        onCancel={handleCloseDialog}
        onOk={handleSubmitApplication}
        okText="提交申请"
        cancelText="取消"
        width={700}
        okButtonProps={{
          style: { backgroundColor: '#F39C12', borderColor: '#F39C12' }
        }}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="姓名" required>
                <Input
                  name="name"
                  value={applicationForm.name}
                  onChange={handleApplicationChange}
                  placeholder="请输入姓名"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="邮箱" required>
                <Input
                  name="email"
                  type="email"
                  value={applicationForm.email}
                  onChange={handleApplicationChange}
                  placeholder="请输入邮箱"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="电话" required>
                <Input
                  name="phone"
                  value={applicationForm.phone}
                  onChange={handleApplicationChange}
                  placeholder="请输入电话"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="学校" required>
                <Input
                  name="school"
                  value={applicationForm.school}
                  onChange={handleApplicationChange}
                  placeholder="请输入学校"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="专业" required>
                <Input
                  name="major"
                  value={applicationForm.major}
                  onChange={handleApplicationChange}
                  placeholder="请输入专业"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="年级" required>
                <Input
                  name="grade"
                  value={applicationForm.grade}
                  onChange={handleApplicationChange}
                  placeholder="请输入年级"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="相关经验" required>
                <Input.TextArea
                  name="experience"
                  value={applicationForm.experience}
                  onChange={handleApplicationChange}
                  placeholder="请描述你的相关经验"
                  rows={4}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="申请原因" required>
                <Input.TextArea
                  name="motivation"
                  value={applicationForm.motivation}
                  onChange={handleApplicationChange}
                  placeholder="请描述你的申请原因"
                  rows={4}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Layout.Content>
  );
};

export default ProjectsPage;