import React, { useState, useContext } from 'react';
import ResponsiveContext from '../../contexts/ResponsiveContext';
import {
  Layout,
  Typography,
  Space,
  Row,
  Col,
  Card,
  Button,
  Divider,
  Input,
  Select,
  Tag,
  Tabs,
  Avatar,
  List,
  Form,
  Tooltip,
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
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// 模拟实习数据
const mockInternships = [
  {
    id: 1,
    title: '字节跳动-后端开发实习生',
    company: '字节跳动',
    location: '北京',
    department: '技术部门',
    duration: '3个月',
    salary: '400元/天',
    description: '参与抖音后端服务开发，使用Go语言进行高并发系统设计，负责接口开发和性能优化...',
    requirements: '计算机相关专业，熟悉Go/Java/Python等语言，了解基本数据结构和算法，有分布式系统开发经验优先',
    tags: ['后端开发', 'Go', '分布式系统'],
    postDate: '2023-05-10',
    deadline: '2023-06-30',
    views: 2345,
    likes: 156,
    comments: 42,
    author: {
      name: '张同学',
      avatar: 'https://mui.com/static/images/avatar/1.jpg',
      school: '清华大学',
      major: '计算机科学与技术',
    },
    image: 'https://lf3-ea.bytetos.com/obj/eaoffice/ies/bytedance_official/_next/static/images/0-390b5def140dc370854c98b8e82ad394.png',
  },
  {
    id: 2,
    title: '腾讯-前端开发实习生',
    company: '腾讯',
    location: '深圳',
    department: 'WXG微信事业群',
    duration: '6个月',
    salary: '350元/天',
    description: '参与微信小程序相关功能开发，负责前端界面实现和交互优化，使用React进行组件开发...',
    requirements: '本科及以上学历，熟悉HTML/CSS/JavaScript，熟练使用React/Vue等前端框架，对前端工程化有一定了解',
    tags: ['前端开发', 'React', '微信小程序'],
    postDate: '2023-05-15',
    deadline: '2023-06-15',
    views: 1987,
    likes: 132,
    comments: 38,
    author: {
      name: '李同学',
      avatar: 'https://mui.com/static/images/avatar/2.jpg',
      school: '北京大学',
      major: '软件工程',
    },
    image: 'https://www.tencent.com/img/banners/brief-1.jpg',
  },
  {
    id: 3,
    title: '阿里巴巴-算法实习生',
    company: '阿里巴巴',
    location: '杭州',
    department: '达摩院',
    duration: '6个月',
    salary: '400元/天',
    description: '参与推荐系统算法研发，负责模型训练和优化，使用深度学习技术提升推荐效果...',
    requirements: '硕士及以上学历，熟悉机器学习和深度学习算法，熟练使用PyTorch/TensorFlow等框架，有推荐系统相关经验优先',
    tags: ['算法', '机器学习', '推荐系统'],
    postDate: '2023-05-05',
    deadline: '2023-06-20',
    views: 2156,
    likes: 189,
    comments: 56,
    author: {
      name: '王同学',
      avatar: 'https://mui.com/static/images/avatar/3.jpg',
      school: '浙江大学',
      major: '人工智能',
    },
    image: 'https://x0.ifengimg.com/ucms/2023_13/E8DC5A2C9752F14E1F8B30E7901EAEB92B467FD7_size77_w1035_h582.jpg',
  },
  {
    id: 4,
    title: '游卡-精英应届生',
    company: '游卡',
    location: '上海',
    department: 'HRBP',
    duration: '4个月',
    salary: '250元/天',
    description: '系统化和定制化培养体系加持，参与挑战性的项目内容，资深导师辅导，通过3-5年以远超行业平均水平的速度，培养成为游卡未来的核心专业或管理人才。期待与你，一起创造和分享快乐',
    requirements: '对行业、竞品公司等专题分析，输出核心业务报告，为管理层决策提供支持，并在业务推进过程中持续提供支持',
    tags: ['战略分析', '深度挖掘'],
    postDate: '2023-07-01',
    deadline: '2023-07-10',
    views: 6666,
    likes: 249,
    comments: 66,
    author: {
      name: '张同学',
      avatar: 'https://mui.com/static/images/avatar/4.jpg',
      school: '中南大学',
      major: '信息安全',
    },
    image: 'https://www.yokagames.com/wp-content/uploads/2022/12/%E5%AE%98%E7%BD%91kv%E6%A8%AA%E3%80%901920X940%E3%80%91.png',
  },
];

// 筛选选项
const filterOptions = {
  companies: ['全部', '字节跳动', '腾讯', '阿里巴巴', '百度', '华为', '美团', '京东', '网易'],
  locations: ['全部', '北京', '上海', '深圳', '杭州', '广州', '南京', '成都', '武汉'],
  durations: ['全部', '1-3个月', '3-6个月', '6个月以上'],
};

const InternshipsPage = () => {
  // 状态管理
  const [internships, setInternships] = useState(mockInternships);
  const [filters, setFilters] = useState({
    company: '全部',
    location: '全部',
    duration: '全部',
    keyword: '',
  });
  const [sortBy, setSortBy] = useState('latest');
  const [tabValue, setTabValue] = useState('1');

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

  return (
    <Layout.Content style={{ padding: isMobile ? '24px 16px' : '24px 50px', position: 'relative' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontWeight: 'bold', color: '#2C3E50' }}>
          实习经验
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            backgroundColor: '#F39C12',
            borderColor: '#F39C12',
            fontWeight: 'bold'
          }}
        >
          分享实习
        </Button>
      </Row>

      {/* 标签页 */}
      <Tabs
        activeKey={tabValue}
        onChange={handleTabChange}
        style={{ marginBottom: 16 }}
      >
        <TabPane tab="最新实习" key="1" />
        <TabPane tab="热门讨论" key="2" />
        <TabPane tab="实习问答" key="3" />
      </Tabs>

      <Row gutter={24}>
        {/* 筛选侧边栏 - 桌面端 */}
        {!isMobile && (
          <Col xs={24} md={6}>
            <Card style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space align="center">
                  <FilterOutlined />
                  <Text strong>筛选条件</Text>
                </Space>
                <Divider style={{ margin: '12px 0' }} />

                <Search
                  placeholder="搜索实习职位、公司等"
                  allowClear
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  style={{ marginBottom: 16 }}
                />

                <Form layout="vertical" style={{ width: '100%' }}>
                  <Form.Item label="公司" style={{ marginBottom: 16 }}>
                    <Select
                      value={filters.company}
                      onChange={(value) => handleFilterChange('company', value)}
                      style={{ width: '100%' }}
                    >
                      {filterOptions.companies.map(company => (
                        <Option key={company} value={company}>{company}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="地点" style={{ marginBottom: 16 }}>
                    <Select
                      value={filters.location}
                      onChange={(value) => handleFilterChange('location', value)}
                      style={{ width: '100%' }}
                    >
                      {filterOptions.locations.map(location => (
                        <Option key={location} value={location}>{location}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="实习时长" style={{ marginBottom: 16 }}>
                    <Select
                      value={filters.duration}
                      onChange={(value) => handleFilterChange('duration', value)}
                      style={{ width: '100%' }}
                    >
                      {filterOptions.durations.map(duration => (
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
                      <Option value="salary">薪资最高</Option>
                      <Option value="popular">最多浏览</Option>
                    </Select>
                  </Form.Item>
                </Form>

                <Button type="primary" block>
                  应用筛选
                </Button>
              </Space>
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
          <Form layout="vertical" style={{ width: '100%' }}>
            <Search
              placeholder="搜索实习职位、公司等"
              allowClear
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              style={{ marginBottom: 16 }}
            />

            <Form.Item label="公司" style={{ marginBottom: 16 }}>
              <Select
                value={filters.company}
                onChange={(value) => handleFilterChange('company', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.companies.map(company => (
                  <Option key={company} value={company}>{company}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="地点" style={{ marginBottom: 16 }}>
              <Select
                value={filters.location}
                onChange={(value) => handleFilterChange('location', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.locations.map(location => (
                  <Option key={location} value={location}>{location}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="实习时长" style={{ marginBottom: 16 }}>
              <Select
                value={filters.duration}
                onChange={(value) => handleFilterChange('duration', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.durations.map(duration => (
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
                <Option value="salary">薪资最高</Option>
                <Option value="popular">最多浏览</Option>
              </Select>
            </Form.Item>

            <Button type="primary" block style={{ marginTop: 16 }}>
              应用筛选
            </Button>
          </Form>
        </Drawer>

        {/* 实习列表 */}
        <Col xs={24} md={isMobile ? 24 : 18}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 1,
              lg: 2,
              xl: 2,
              xxl: 3,
            }}
            dataSource={internships}
            renderItem={internship => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={internship.title}
                      src={internship.image}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Tooltip title="点赞">
                      <Space>
                        <LikeOutlined key="like" />
                        <span>{internship.likes}</span>
                      </Space>
                    </Tooltip>,
                    <Tooltip title="评论">
                      <Space>
                        <CommentOutlined key="comment" />
                        <span>{internship.comments}</span>
                      </Space>
                    </Tooltip>,
                    <Tooltip title="收藏">
                      <StarOutlined key="bookmark" />
                    </Tooltip>,
                    <Tooltip title="分享">
                      <ShareAltOutlined key="share" />
                    </Tooltip>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Text strong style={{ fontSize: 16 }}>{internship.title}</Text>
                        <Text type="secondary" style={{ fontSize: 14 }}>{internship.company}</Text>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={8} style={{ width: '100%', marginTop: 8 }}>
                        <Space>
                          <EnvironmentOutlined />
                          <Text type="secondary">{internship.location}</Text>
                          <ClockCircleOutlined style={{ marginLeft: 8 }} />
                          <Text type="secondary">{internship.duration}</Text>
                        </Space>

                        <Text strong style={{ color: '#F39C12' }}>{internship.salary}</Text>

                        <Space wrap>
                          {internship.tags.map(tag => (
                            <Tag key={tag} color="blue">{tag}</Tag>
                          ))}
                        </Space>

                        <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                          {internship.description}
                        </Paragraph>

                        <Space align="center">
                          <Avatar src={internship.author.avatar} size="small" />
                          <Text style={{ fontSize: 12 }}>{internship.author.name}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>{internship.author.school}</Text>
                        </Space>

                        <Row justify="space-between" align="middle">
                          <Col>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              截止日期: {internship.deadline}
                            </Text>
                          </Col>
                          <Col>
                            <Button type="link" size="small" style={{ padding: 0 }}>
                              查看详情
                            </Button>
                          </Col>
                        </Row>
                      </Space>
                    }
                  />
                </Card>
              </List.Item>
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
    </Layout.Content>
  );
};

export default InternshipsPage;