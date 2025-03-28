import React, { useState, useEffect } from 'react';
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
  Rate,
  Badge,
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
  YoutubeOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// 模拟竞赛数据
const mockCompetitions = [
  {
    id: 1,
    title: '全国大学生数学建模竞赛',
    organizer: '中国工业与应用数学学会',
    level: '国家级',
    category: '数学建模',
    award: '国家一等奖',
    date: '2023-09-15',
    deadline: '2023-08-30',
    description: '全国大学生数学建模竞赛是全国高校规模最大的基础性学科竞赛，旨在培养学生的创新意识及运用数学方法和计算机技术解决实际问题的能力...',
    requirements: '全日制在校大学生，本科生或研究生均可报名参加，以3人为一队，配备1名指导教师',
    tags: ['数学建模', '算法', '国家级'],
    views: 3456,
    likes: 245,
    comments: 78,
    author: {
      name: '张同学',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User1',
      school: '清华大学',
      major: '应用数学',
    },
    image: 'https://img.themesbrand.com/velzon/images/img-4.gif',
    videoLink: 'https://www.bilibili.com/video/BV1Gx411w7CY',
  },
  {
    id: 2,
    title: 'ACM-ICPC国际大学生程序设计竞赛',
    organizer: 'ACM国际计算机协会',
    level: '国际级',
    category: '程序设计',
    award: '亚洲区域赛金奖',
    date: '2023-10-20',
    deadline: '2023-09-15',
    description: 'ACM国际大学生程序设计竞赛是全球最具影响力的大学生程序设计竞赛，培养学生的团队合作精神和在压力下编写程序、分析和解决问题的能力...',
    requirements: '全日制在校大学生，本科生或研究生均可报名参加，以3人为一队，配备1名教练',
    tags: ['算法', '编程', '国际级'],
    views: 4567,
    likes: 356,
    comments: 92,
    author: {
      name: '李同学',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User2',
      school: '北京大学',
      major: '计算机科学',
    },
    image: 'https://img.themesbrand.com/velzon/images/img-5.gif',
    videoLink: 'https://www.bilibili.com/video/BV1Jx411L7RY',
  },
  {
    id: 3,
    title: '互联网+大学生创新创业大赛',
    organizer: '教育部',
    level: '国家级',
    category: '创新创业',
    award: '金奖',
    date: '2023-07-10',
    deadline: '2023-06-01',
    description: '互联网+大学生创新创业大赛是为深入贯彻落实国家创新驱动发展战略，激发大学生创新创业热情，展示大学生创新创业成果而设立的全国性比赛...',
    requirements: '全日制在校大学生，允许跨校组队，项目成员不超过5人',
    tags: ['创新创业', '商业计划', '国家级'],
    views: 3890,
    likes: 278,
    comments: 65,
    author: {
      name: '王同学',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User3',
      school: '浙江大学',
      major: '工商管理',
    },
    image: 'https://img.themesbrand.com/velzon/images/img-6.gif',
    videoLink: 'https://www.bilibili.com/video/BV1Kx411M7LN',
  },
];

// 筛选选项
const filterOptions = {
  levels: ['全部', '国际级', '国家级', '省级', '校级'],
  categories: ['全部', '数学建模', '程序设计', '创新创业', '机器人', '电子设计', '人工智能'],
  awards: ['全部', '特等奖', '一等奖', '二等奖', '三等奖', '优秀奖'],
};

const CompetitionsPage = () => {
  // 状态管理
  const [competitions, setCompetitions] = useState(mockCompetitions);
  const [filters, setFilters] = useState({
    level: '全部',
    category: '全部',
    award: '全部',
    keyword: '',
  });
  const [sortBy, setSortBy] = useState('latest');
  const [tabValue, setTabValue] = useState('1');

  // 移动端控制状态
  const [isMobile, setIsMobile] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // 检测屏幕宽度变化，判断是否为移动端
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

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
          竞赛分享
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
          分享竞赛
        </Button>
      </Row>

      {/* 标签页 */}
      <Tabs
        activeKey={tabValue}
        onChange={handleTabChange}
        style={{ marginBottom: 16 }}
      >
        <TabPane tab="最新竞赛" key="1" />
        <TabPane tab="热门讨论" key="2" />
        <TabPane tab="竞赛问答" key="3" />
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
                  placeholder="搜索竞赛名称、组织者等"
                  allowClear
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  style={{ marginBottom: 16 }}
                />

                <Form layout="vertical" style={{ width: '100%' }}>
                  <Form.Item label="竞赛级别" style={{ marginBottom: 16 }}>
                    <Select
                      value={filters.level}
                      onChange={(value) => handleFilterChange('level', value)}
                      style={{ width: '100%' }}
                    >
                      {filterOptions.levels.map(level => (
                        <Option key={level} value={level}>{level}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="竞赛类别" style={{ marginBottom: 16 }}>
                    <Select
                      value={filters.category}
                      onChange={(value) => handleFilterChange('category', value)}
                      style={{ width: '100%' }}
                    >
                      {filterOptions.categories.map(category => (
                        <Option key={category} value={category}>{category}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="获奖等级" style={{ marginBottom: 16 }}>
                    <Select
                      value={filters.award}
                      onChange={(value) => handleFilterChange('award', value)}
                      style={{ width: '100%' }}
                    >
                      {filterOptions.awards.map(award => (
                        <Option key={award} value={award}>{award}</Option>
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
                      <Option value="popular">最多浏览</Option>
                      <Option value="comments">最多评论</Option>
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
              placeholder="搜索竞赛名称、组织者等"
              allowClear
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              style={{ marginBottom: 16 }}
            />

            <Form.Item label="竞赛级别" style={{ marginBottom: 16 }}>
              <Select
                value={filters.level}
                onChange={(value) => handleFilterChange('level', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.levels.map(level => (
                  <Option key={level} value={level}>{level}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="竞赛类别" style={{ marginBottom: 16 }}>
              <Select
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="获奖等级" style={{ marginBottom: 16 }}>
              <Select
                value={filters.award}
                onChange={(value) => handleFilterChange('award', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.awards.map(award => (
                  <Option key={award} value={award}>{award}</Option>
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
                <Option value="popular">最多浏览</Option>
                <Option value="comments">最多评论</Option>
              </Select>
            </Form.Item>

            <Button type="primary" block style={{ marginTop: 16 }}>
              应用筛选
            </Button>
          </Form>
        </Drawer>

        {/* 竞赛列表 */}
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
            dataSource={competitions}
            renderItem={competition => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={competition.title}
                      src={competition.image}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Tooltip title="点赞">
                      <Space>
                        <LikeOutlined key="like" />
                        <span>{competition.likes}</span>
                      </Space>
                    </Tooltip>,
                    <Tooltip title="评论">
                      <Space>
                        <CommentOutlined key="comment" />
                        <span>{competition.comments}</span>
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
                        <Text strong style={{ fontSize: 16 }}>{competition.title}</Text>
                        <Space align="center">
                          <Text type="secondary" style={{ fontSize: 12 }}>{competition.organizer}</Text>
                          {competition.videoLink && (
                            <Tooltip title="视频讲解">
                              <YoutubeOutlined style={{ color: '#FF0000' }} />
                            </Tooltip>
                          )}
                        </Space>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={8} style={{ width: '100%', marginTop: 8 }}>
                        <Space wrap>
                          <Tag color="blue">{competition.level}</Tag>
                          <Tag color="green">{competition.category}</Tag>
                          <Tag color="gold">{competition.award}</Tag>
                        </Space>

                        <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                          {competition.description}
                        </Paragraph>

                        <Space align="center">
                          <Avatar src={competition.author.avatar} size="small" />
                          <Text style={{ fontSize: 12 }}>{competition.author.name}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>{competition.author.school}</Text>
                        </Space>

                        <Row justify="space-between" align="middle">
                          <Col>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              截止日期: {competition.deadline}
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

export default CompetitionsPage;