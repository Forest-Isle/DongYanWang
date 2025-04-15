import React from 'react';
import { Layout, Typography, Row, Col, Card, Button, Avatar, Table, Tag, List, Space } from 'antd';
import { HeartOutlined, HeartFilled, FireOutlined, UserOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Text, Paragraph } = Typography;

// 模拟技巧数据 - EndNote为例
const skillData = {
  id: 1,
  name: 'EndNote',
  cover: 'https://note.vmecum.com/static/images/endnote.png',
  avgLearningTime: '网友分享经验：平均2.5周',
  masteryRate: '网友分享经验：约85.3%',
  officialWebsite: 'https://endnote.com/',
  userGuide: 'https://endnote.com/support/getting-started/',
  rating: 4.8,
  isHotTop: true,
  isGeneralSoftware: true,
  isRecommended: true,
  followers: 8643,
  todayUpdates: 32,
  moderators: [
    {
      id: 1,
      name: '张教授',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
      title: '主版主'
    },
    {
      id: 2,
      name: '李研究员',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof2',
      title: '副版主'
    },
    {
      id: 3,
      name: '王博士',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof3',
      title: '副版主'
    }
  ]
};

// 模拟网友帖子数据
const communityPosts = [
  {
    id: 1,
    title: 'EndNote快捷键大全整理',
    author: '邹研究生',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GradZou',
    date: '2025-04-08',
    content: '整理了EndNote常用快捷键和操作技巧，提高文献管理效率...',
    views: 1765,
    likes: 412,
    comments: 83,
  },
  {
    id: 2,
    title: 'EndNote与Word联用技巧',
    author: '汤助教',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AssiTang',
    date: '2025-04-07',
    content: '详解EndNote在Word中的引用格式设置和参考文献列表生成方法...',
    views: 1654,
    likes: 378,
    comments: 71,
  },
  {
    id: 3,
    title: 'EndNote文献分类方法',
    author: '龚老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherGong',
    date: '2025-04-06',
    content: '分享高效的文献分类和标签管理方法，方便文献检索和引用...',
    views: 1543,
    likes: 345,
    comments: 64,
  },
  {
    id: 4,
    title: 'EndNote在线同步设置',
    author: '韦工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EngWei',
    date: '2025-04-05',
    content: '介绍EndNote云同步功能的配置和使用方法，实现多设备文献同步...',
    views: 1432,
    likes: 323,
    comments: 57,
  },
  {
    id: 5,
    title: 'EndNote导入格式转换',
    author: '柏文员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ClerkBai',
    date: '2025-04-04',
    content: '解决不同数据库文献导入EndNote时的格式转换问题...',
    views: 1321,
    likes: 298,
    comments: 51,
  },
  {
    id: 6,
    title: 'EndNote文献查重功能',
    author: '穆研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ResMu',
    date: '2025-04-03',
    content: '使用EndNote查找重复文献的方法，保持文献库整洁...',
    views: 1245,
    likes: 276,
    comments: 45,
  },
  {
    id: 7,
    title: 'EndNote参考文献样式定制',
    author: '师编辑',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EditShi',
    date: '2025-04-02',
    content: '如何自定义EndNote参考文献输出样式，满足不同期刊要求...',
    views: 1167,
    likes: 254,
    comments: 41,
  },
  {
    id: 8,
    title: 'EndNote文献全文获取设置',
    author: '岳助理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AssisYue',
    date: '2025-04-01',
    content: '配置EndNote自动下载和关联PDF全文的方法...',
    views: 1089,
    likes: 235,
    comments: 37,
  },
  {
    id: 9,
    title: 'EndNote团队共享功能',
    author: '池博士',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrChi',
    date: '2025-03-31',
    content: '使用EndNote实现课题组文献资源共享的操作指南...',
    views: 978,
    likes: 212,
    comments: 33,
  },
  {
    id: 10,
    title: 'EndNote常见问题解决',
    author: '闵技术员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechMin',
    date: '2025-03-30',
    content: '总结EndNote使用过程中的常见问题和解决方案...',
    views: 867,
    likes: 189,
    comments: 28,
  }
];

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

const SkillDetailPage = () => {
  const { skillId } = useParams();
  const [isFollowing, setIsFollowing] = React.useState(false);

  // 切换关注状态
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <BreadcrumbNav
            items={[
              { title: '首页', path: '/' },
              { title: '技巧', path: '/skills' },
              { title: skillData.name },
            ]}
          />
        </Col>
        <Col>
          <Space size="large">
            <Space>
              <Text>关注数：{skillData.followers}</Text>
              <Text>今日更新：{skillData.todayUpdates}</Text>
            </Space>
            <Button
              type={isFollowing ? 'default' : 'primary'}
              icon={isFollowing ? <HeartFilled /> : <HeartOutlined />}
              onClick={toggleFollow}
            >
              {isFollowing ? '已关注' : '关注'}
            </Button>
            <Avatar.Group
              maxCount={3}
              maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            >
              {skillData.moderators.map(mod => (
                <Avatar
                  key={mod.id}
                  src={mod.avatar}
                  title={`${mod.name} (${mod.title})`}
                />
              ))}
            </Avatar.Group>
          </Space>
        </Col>
      </Row>

      {/* 技巧基本信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={3.5}>
            <img
              src={skillData.cover}
              alt={skillData.name}
              style={{ height: '100px' }}
            />
          </Col>
          <Col span={20}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text><Text strong>名称：</Text>{skillData.name}</Text>
              </Col>
              <Col span={12}>
                  {skillData.isHotTop && <Tag color="red">热度Top2</Tag>}
                  {skillData.isGeneralSoftware && <Tag color="green">通用类软件</Tag>}
                  {skillData.isRecommended && <Tag color="blue">推荐</Tag>}
                  <Tag color="purple">评分 {skillData.rating}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>平均学习时长</Text>
                <br />
                <Text>{skillData.avgLearningTime}</Text>
              </Col>
              <Col span={12}>
                <Text strong>平均掌握比例</Text>
                <br />
                <Text>{skillData.masteryRate}</Text>
              </Col>
              <Col span={12}>
                <Text strong>官方网站</Text>
                <br />
                <a href={skillData.officialWebsite} target="_blank" rel="noopener noreferrer">
                  {skillData.officialWebsite}
                </a>
              </Col>
              <Col span={12}>
                <Text strong>用户指南</Text>
                <br />
                <a href={skillData.userGuide} target="_blank" rel="noopener noreferrer">
                  {skillData.userGuide}
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 网友帖子列表 */}
      <List
        itemLayout="vertical"
        dataSource={communityPosts}
        renderItem={post => (
          <List.Item
            key={post.id}
            actions={[
              <Space>
                <EyeOutlined /> {post.views}
              </Space>,
              <Space>
                <HeartOutlined /> {post.likes}
              </Space>,
              <Space>
                <CommentOutlined /> {post.comments}
              </Space>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={post.avatar} />}
              title={<Link to={`/skills/post/${post.id}`}>{post.title}</Link>}
              description={`${post.author} · ${post.date}`}
            />
            {post.content}
          </List.Item>
        )}
      />
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

export default SkillDetailPage;