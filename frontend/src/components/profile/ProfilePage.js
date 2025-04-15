import React, { useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Avatar,
  List,
  Tabs,
  Input,
  Modal,
  Badge,
  Menu,
  Form,
  Dropdown
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  BankOutlined,
  TrophyOutlined,
  ScheduleOutlined,
  SettingOutlined,
  BellOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LikeOutlined,
  CommentOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 模拟用户数据
const mockUser = {
  id: 1,
  name: '张明',
  avatar: 'https://faculty.csu.edu.cn/_resources/group1/M00/00/66/wKiylWIVrryAL8fCAALhPSV0JkU358.png',
  coverImage: 'https://www.csu.edu.cn/images/banner/xuexiaobangongshiv8.png',
  school: '中南大学',
  major: '计算机科学与技术',
  degree: '硕士研究生',
  grade: '2022级',
  location: '湖南省长沙市',
  email: 'zhangming@example.com',
  phone: '138****5678',
  bio: '热爱计算机科学与人工智能，专注于深度学习和计算机视觉研究。曾参与多个国家级科研项目，发表SCI论文3篇。希望通过平台寻找更多学术交流与合作机会。',
  interests: ['深度学习', '计算机视觉', '自然语言处理', '机器学习'],
  skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'C++'],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/zhangming',
    github: 'https://github.com/zhangming',
  },
  stats: {
    papers: 5,
    projects: 3,
    competitions: 4,
    internships: 2,
    followers: 128,
    following: 86,
  }
};

// 模拟收藏数据
const mockCollections = {
  papers: [
    {
      id: 1,
      title: '基于深度学习的自然语言处理研究进展',
      authors: '张三, 李四, 王五',
      journal: '计算机学报',
      publishDate: '2023-05-15',
      savedDate: '2023-05-20',
    },
    {
      id: 2,
      title: '新型冠状病毒肺炎疫苗研发的最新进展',
      authors: '赵六, 钱七',
      journal: '生物医学工程学报',
      publishDate: '2023-04-22',
      savedDate: '2023-04-25',
    },
  ],
  projects: [
    {
      id: 1,
      title: '基于深度学习的医学影像分析系统',
      professor: '张教授',
      school: '清华大学',
      savedDate: '2023-06-10',
    },
  ],
  competitions: [
    {
      id: 1,
      title: '全国大学生数学建模竞赛',
      organizer: '中国工业与应用数学学会',
      savedDate: '2023-05-30',
    },
  ],
  internships: [
    {
      id: 1,
      title: '字节跳动-后端开发实习生',
      company: '字节跳动',
      location: '北京',
      savedDate: '2023-06-05',
    },
  ],
};

// 模拟动态数据
const mockActivities = [
  {
    id: 1,
    type: 'paper',
    action: '分享了论文',
    title: '基于注意力机制的图像识别算法研究',
    date: '2023-06-15',
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    type: 'competition',
    action: '参加了竞赛',
    title: '2023年全国人工智能创新大赛',
    date: '2023-06-10',
    likes: 36,
    comments: 12,
  },
  {
    id: 3,
    type: 'project',
    action: '申请了项目',
    title: '智能交通系统优化研究',
    date: '2023-06-05',
    likes: 18,
    comments: 5,
  },
  {
    id: 4,
    type: 'internship',
    action: '分享了实习经验',
    title: '在百度AI部门的实习体验',
    date: '2023-05-28',
    likes: 42,
    comments: 15,
  },
];

// 模拟通知数据
const mockNotifications = [
  {
    id: 1,
    type: 'application',
    message: '您申请的"智能交通系统优化研究"项目已被接受',
    date: '2023-06-15',
    read: false,
  },
  {
    id: 2,
    type: 'comment',
    message: '李同学评论了您的实习经验分享',
    date: '2023-06-14',
    read: false,
  },
  {
    id: 3,
    type: 'like',
    message: '王教授赞了您的实习经验分享',
    date: '2023-06-14',
    read: true,
  },
];

const ProfilePage = () => {
  // 状态管理
  const [user, setUser] = useState(mockUser);
  const [collections, setCollections] = useState(mockCollections);
  const [activities, setActivities] = useState(mockActivities);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [tabValue, setTabValue] = useState('1');
  const [collectionTabValue, setCollectionTabValue] = useState('1');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    school: user.school,
    major: user.major,
    bio: user.bio,
    email: user.email,
    phone: user.phone,
    location: user.location,
  });
  const [notificationOpen, setNotificationOpen] = useState(false);

  // 处理标签切换
  const handleTabChange = (key) => {
    setTabValue(key);
  };

  // 处理收藏标签切换
  const handleCollectionTabChange = (key) => {
    setCollectionTabValue(key);
  };

  // 打开编辑对话框
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  // 关闭编辑对话框
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  // 处理编辑表单变化
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 提交编辑表单
  const handleSubmitEdit = () => {
    // 实际项目中应该调用API更新用户信息
    setUser(prev => ({
      ...prev,
      ...editForm
    }));

    // 关闭对话框
    handleCloseEditDialog();
  };

  // 打开通知菜单
  const handleOpenNotificationMenu = () => {
    setNotificationOpen(true);
  };

  // 关闭通知菜单
  const handleCloseNotificationMenu = () => {
    setNotificationOpen(false);
  };

  // 标记通知为已读
  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // 获取未读通知数量
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // 根据类型获取图标
  const getActivityIcon = (type) => {
    switch(type) {
      case 'paper':
        return <FileTextOutlined />;
      case 'internship':
        return <ScheduleOutlined />;
      case 'competition':
        return <TrophyOutlined />;
      case 'project':
        return <ScheduleOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const notificationMenu = (
    <Menu>
      <Menu.Item style={{ fontWeight: 'bold', padding: '8px 16px' }}>
        通知
      </Menu.Item>
      <Menu.Divider />
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Menu.Item
            key={notification.id}
            onClick={() => handleMarkAsRead(notification.id)}
            style={{
              backgroundColor: notification.read ? 'transparent' : 'rgba(24, 144, 255, 0.08)'
            }}
          >
            <Text>{notification.message}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{notification.date}</Text>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>
          <Text>暂无通知</Text>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Layout.Content style={{ padding: '24px 50px', position: 'relative' }}>
      {/* 个人信息卡片 */}
      <Card style={{ marginBottom: 24, overflow: 'hidden', borderRadius: 8 }}>
        {/* 封面图 */}
        <div style={{ position: 'relative', height: '200px' }}>
          <div style={{
            backgroundImage: `url(${user.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '200px'
          }} />
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 8
          }}>
            <Dropdown
              overlay={notificationMenu}
              trigger={['click']}
              open={notificationOpen}
              onOpenChange={setNotificationOpen}
            >
              <Button
                shape="circle"
                icon={<Badge count={unreadCount}><BellOutlined /></Badge>}
                style={{ backgroundColor: 'white' }}
                onClick={handleOpenNotificationMenu}
              />
            </Dropdown>
            <Button
              shape="circle"
              icon={<SettingOutlined />}
              style={{ backgroundColor: 'white' }}
            />
          </div>
        </div>

        {/* 用户信息 */}
        <div style={{ padding: 0, paddingTop: 0 }}>
          <Row gutter={24}>
            <Col span={6} style={{ marginTop: -40, textAlign: 'center' }}>
              <Avatar
                size={120}
                src={user.avatar}
                alt={user.name}
                style={{
                  border: '4px solid white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              />
              <Title level={4} style={{ marginTop: 16, fontWeight: 'bold' }}>
                {user.name}
              </Title>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                <BankOutlined style={{ marginRight: 4 }} />
                <Text type="secondary">{user.school}</Text>
              </div>
              <Text type="secondary">
                {user.degree} · {user.major}
              </Text>
              <div>
                <Button
                  style={{ marginTop: 16 }}
                  icon={<EditOutlined />}
                  onClick={handleOpenEditDialog}
                >
                  编辑资料
                </Button>
              </div>
            </Col>

            <Col span={18}>
              <div style={{ marginBottom: 24 }}>
                <Title level={5} style={{ fontWeight: 'bold' }}>
                  个人简介
                </Title>
                <Paragraph>
                  {user.bio}
                </Paragraph>

                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <MailOutlined style={{ marginRight: 8, color: 'rgba(0,0,0,0.45)' }} />
                      <Text type="secondary">{user.email}</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneOutlined style={{ marginRight: 8, color: 'rgba(0,0,0,0.45)' }} />
                      <Text type="secondary">{user.phone}</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <EnvironmentOutlined style={{ marginRight: 8, color: 'rgba(0,0,0,0.45)' }} />
                      <Text type="secondary">{user.location}</Text>
                    </div>
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Title level={5} style={{ fontWeight: 'bold' }}>
                  研究兴趣
                </Title>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {user.interests.map((interest, index) => (
                    <Tag key={index} color="blue">{interest}</Tag>
                  ))}
                </div>
              </div>

              <div>
                <Title level={5} style={{ fontWeight: 'bold' }}>
                  技能
                </Title>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {user.skills.map((skill, index) => (
                    <Tag key={index} color="purple">{skill}</Tag>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* 统计信息 */}
        <div style={{ backgroundColor: '#f5f5f5', padding: 16, marginTop: 16 }}>
          <Row gutter={16} justify="center">
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ marginBottom: 0, color: '#2C3E50' }}>
                  {user.stats.papers}
                </Title>
                <Text type="secondary">论文</Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ marginBottom: 0, color: '#2C3E50' }}>
                  {user.stats.projects}
                </Title>
                <Text type="secondary">项目</Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ marginBottom: 0, color: '#2C3E50' }}>
                  {user.stats.competitions}
                </Title>
                <Text type="secondary">竞赛</Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ marginBottom: 0, color: '#2C3E50' }}>
                  {user.stats.internships}
                </Title>
                <Text type="secondary">实习</Text>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* 内容标签页 */}
      <Card style={{ marginBottom: 24 }}>
        <Tabs
          activeKey={tabValue}
          onChange={handleTabChange}
        >
          <TabPane tab="个人动态" key="1">
            <List
              itemLayout="vertical"
              dataSource={activities}
              renderItem={(activity) => (
                <List.Item
                  key={activity.id}
                  actions={[
                    <Button type="text" icon={<LikeOutlined />}>{activity.likes}</Button>,
                    <Button type="text" icon={<CommentOutlined />}>{activity.comments}</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={getActivityIcon(activity.type)} style={{ backgroundColor: '#F39C12' }} />}
                    title={
                      <div>
                        <Text strong>{user.name}</Text>
                        {' '}{activity.action}{' '}
                        <Text strong>{activity.title}</Text>
                      </div>
                    }
                    description={activity.date}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="收藏内容" key="2">
            <Tabs
              activeKey={collectionTabValue}
              onChange={handleCollectionTabChange}
            >
              <TabPane tab="论文" key="1">
                <List
                  itemLayout="horizontal"
                  dataSource={collections.papers}
                  renderItem={(paper) => (
                    <List.Item
                      actions={[
                        <Button type="text" icon={<DeleteOutlined />} />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#3498DB' }} />}
                        title={paper.title}
                        description={
                          <div>
                            <Text type="secondary">{paper.authors} - {paper.journal}, {paper.publishDate}</Text>
                            <br />
                            <Text type="secondary" style={{fontSize: '12px'}}>收藏于 {paper.savedDate}</Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="项目" key="2">
                <List
                  itemLayout="horizontal"
                  dataSource={collections.projects}
                  renderItem={(project) => (
                    <List.Item
                      actions={[
                        <Button type="text" icon={<DeleteOutlined />} />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<ScheduleOutlined />} style={{ backgroundColor: '#9B59B6' }} />}
                        title={project.title}
                        description={
                          <div>
                            <Text type="secondary">{project.professor} - {project.school}</Text>
                            <br />
                            <Text type="secondary" style={{fontSize: '12px'}}>收藏于 {project.savedDate}</Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="竞赛" key="3">
                <List
                  itemLayout="horizontal"
                  dataSource={collections.competitions}
                  renderItem={(competition) => (
                    <List.Item
                      actions={[
                        <Button type="text" icon={<DeleteOutlined />} />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<TrophyOutlined />} style={{ backgroundColor: '#F39C12' }} />}
                        title={competition.title}
                        description={
                          <div>
                            <Text type="secondary">{competition.organizer}</Text>
                            <br />
                            <Text type="secondary" style={{fontSize: '12px'}}>收藏于 {competition.savedDate}</Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="实习" key="4">
                <List
                  itemLayout="horizontal"
                  dataSource={collections.internships}
                  renderItem={(internship) => (
                    <List.Item
                      actions={[
                        <Button type="text" icon={<DeleteOutlined />} />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<ScheduleOutlined />} style={{ backgroundColor: '#2ECC71' }} />}
                        title={internship.title}
                        description={
                          <div>
                            <Text type="secondary">{internship.company} - {internship.location}</Text>
                            <br />
                            <Text type="secondary" style={{fontSize: '12px'}}>收藏于 {internship.savedDate}</Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </TabPane>
          <TabPane tab="关注" key="3">
            <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(0,0,0,0.45)' }}>
              关注功能开发中...
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 编辑个人资料对话框 */}
      <Modal
        title="编辑个人资料"
        open={openEditDialog}
        onCancel={handleCloseEditDialog}
        cancelText="取消"
        onOk={handleSubmitEdit}
        okText="保存"
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="姓名">
            <Input
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
            />
          </Form.Item>
          <Form.Item label="学校">
            <Input
              name="school"
              value={editForm.school}
              onChange={handleEditFormChange}
            />
          </Form.Item>
          <Form.Item label="专业">
            <Input
              name="major"
              value={editForm.major}
              onChange={handleEditFormChange}
            />
          </Form.Item>
          <Form.Item label="个人简介">
            <TextArea
              name="bio"
              value={editForm.bio}
              onChange={handleEditFormChange}
              rows={4}
            />
          </Form.Item>
          <Form.Item label="邮箱">
            <Input
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
            />
          </Form.Item>
          <Form.Item label="电话">
            <Input
              name="phone"
              value={editForm.phone}
              onChange={handleEditFormChange}
            />
          </Form.Item>
          <Form.Item label="所在地">
            <Input
              name="location"
              value={editForm.location}
              onChange={handleEditFormChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Content>
  );
};

export default ProfilePage;