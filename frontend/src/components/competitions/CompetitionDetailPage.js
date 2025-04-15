import React from 'react';
import { Layout, Typography, Row, Col, Card, Button, Avatar, Table, Tag, List, Space } from 'antd';
import { HeartOutlined, HeartFilled, FireOutlined, UserOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Text, Paragraph } = Typography;

// 模拟竞赛数据 - 以数学建模竞赛为例
const competitionData = {
  id: 1,
  name: '全国大学生数学建模竞赛',
  cover: 'https://pic3.zhimg.com/v2-efb019dce60462eea47da4049474365c_b.jpg',
  averageContestDuration: '网友分享经验：平均3天',
  averageWinRate: '网友分享经验：约25%',
  officialWebsite: 'https://www.mcm.edu.cn',
  registrationLink: 'https://www.mcm.edu.cn/register',
  hostOrganization: '中国工业与应用数学学会',
  isNational: true,
  hasScholarship: true,
  isEducationMinistry: true,
  isMathContest: true,
  followers: 23456,
  todayUpdates: 18,
  moderators: [
    {
      id: 1,
      name: '王教授',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
      title: '主版主'
    },
    {
      id: 2,
      name: '李博士',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof2',
      title: '副版主'
    },
    {
      id: 3,
      name: '张工程师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof3',
      title: '副版主'
    }
  ]
};

// 模拟网友帖子数据
const communityPosts = [
  {
    id: 1,
    title: '数模竞赛新手入门指南',
    author: '戚教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CoachQi',
    date: '2025-04-08',
    content: '为首次参加数学建模竞赛的同学整理了基础知识和准备要点...',
    views: 1854,
    likes: 432,
    comments: 87,
  },
  {
    id: 2,
    title: '数模竞赛常用模型总结',
    author: '尹学长',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SeniorYin',
    date: '2025-04-07',
    content: '系统总结了数模竞赛中常用的数学模型和应用场景...',
    views: 1723,
    likes: 398,
    comments: 75,
  },
  {
    id: 3,
    title: '数模竞赛工具软件教程',
    author: '金工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EngJin',
    date: '2025-04-06',
    content: '详解MATLAB、Lingo等数模竞赛常用软件的使用方法...',
    views: 1612,
    likes: 367,
    comments: 69,
  },
  {
    id: 4,
    title: '数据预处理技巧分享',
    author: '蒋分析师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnaJiang',
    date: '2025-04-05',
    content: '分享数据清洗、处理和分析的实用方法和注意事项...',
    views: 1534,
    likes: 345,
    comments: 62,
  },
  {
    id: 5,
    title: '论文撰写规范解析',
    author: '魏老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherWei',
    date: '2025-04-04',
    content: '详细介绍数模竞赛论文的格式要求和撰写技巧...',
    views: 1423,
    likes: 312,
    comments: 56,
  },
  {
    id: 6,
    title: '数模竞赛答辩技巧',
    author: '齐导师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MentorQi',
    date: '2025-04-03',
    content: '总结历届数模竞赛答辩环节的经验和注意事项...',
    views: 1345,
    likes: 289,
    comments: 49,
  },
  {
    id: 7,
    title: '编程代码优化方法',
    author: '卓程序员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CoderZhuo',
    date: '2025-04-02',
    content: '分享数模竞赛中算法实现和代码优化的技巧...',
    views: 1256,
    likes: 267,
    comments: 44,
  },
  {
    id: 8,
    title: '可视化图表制作指南',
    author: '时设计师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignShi',
    date: '2025-04-01',
    content: '教你制作美观专业的数据可视化图表...',
    views: 1187,
    likes: 245,
    comments: 39,
  },
  {
    id: 9,
    title: '历届赛题解析汇总',
    author: '计研究生',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GradJi',
    date: '2025-03-31',
    content: '整理近年数模竞赛真题及其解题思路...',
    views: 1098,
    likes: 223,
    comments: 35,
  },
  {
    id: 10,
    title: '竞赛团队协作经验',
    author: '昌队长',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CaptChang',
    date: '2025-03-30',
    content: '分享数模竞赛团队配合与任务分工的经验...',
    views: 987,
    likes: 198,
    comments: 31,
  }
];

// 模拟热门竞赛帖子数据
const hotCompetitionPosts = [
  {
    id: 1,
    title: '2025全国研究生数学建模竞赛报名开始',
    author: '王组长',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Organizer1',
    date: '2025-04-01',
    views: 4256,
    likes: 936,
    comments: 168,
  },
  {
    id: 2,
    title: '第十届"互联网+"大学生创新创业大赛简介',
    author: '李主任',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Director1',
    date: '2025-03-28',
    views: 3987,
    likes: 845,
    comments: 142,
  },
  {
    id: 3,
    title: '挑战杯全国大学生课外学术竞赛经验分享',
    author: '张教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coach1',
    date: '2025-03-25',
    views: 3654,
    likes: 778,
    comments: 126,
  },
  {
    id: 4,
    title: '2025年ACM程序设计大赛备赛指南',
    author: '赵指导',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor1',
    date: '2025-03-20',
    views: 3432,
    likes: 712,
    comments: 108,
  },
  {
    id: 5,
    title: '全国大学生电子设计竞赛报名须知',
    author: '刘老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1',
    date: '2025-03-15',
    views: 3198,
    likes: 654,
    comments: 95,
  },
  {
    id: 6,
    title: '研究生创新实践系列竞赛最新通知',
    author: '陈秘书',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Secretary1',
    date: '2025-03-10',
    views: 2876,
    likes: 598,
    comments: 87,
  },
  {
    id: 7,
    title: '"华为杯"研究生数学竞赛参赛攻略',
    author: '吴教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
    date: '2025-03-05',
    views: 2654,
    likes: 543,
    comments: 79,
  },
  {
    id: 8,
    title: '生物医学创新设计大赛筹备工作',
    author: '孙主管',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager1',
    date: '2025-03-01',
    views: 2432,
    likes: 487,
    comments: 71,
  },
  {
    id: 9,
    title: '人工智能创新应用大赛评分标准公布',
    author: '郑评委',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Judge1',
    date: '2025-02-25',
    views: 2198,
    likes: 456,
    comments: 64,
  },
  {
    id: 10,
    title: '研究生企业管理案例大赛往届回顾',
    author: '黄导师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Supervisor1',
    date: '2025-02-20',
    views: 2087,
    likes: 423,
    comments: 58,
  }
];

const CompetitionDetailPage = () => {
  const { id } = useParams();
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
              { title: '竞赛', path: '/competitions' },
              { title: competitionData.name },
            ]}
          />
        </Col>
        <Col>
          <Space size="large">
            <Space>
              <Text>关注数：{competitionData.followers}</Text>
              <Text>今日更新：{competitionData.todayUpdates}</Text>
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
              {competitionData.moderators.map(mod => (
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

      {/* 竞赛基本信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={3.5}>
            <img
              src={competitionData.cover}
              alt={competitionData.name}
              style={{ height: '100px' }}
            />
          </Col>
          <Col span={20}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text><Text strong>竞赛名称：</Text>{competitionData.name}</Text>
              </Col>
              <Col span={12}>
                  {competitionData.isNational && <Tag color="blue">国家级</Tag>}
                  {competitionData.hasScholarship && <Tag color="gold">有奖金</Tag>}
                  {competitionData.isEducationMinistry && <Tag color="green">教育部</Tag>}
                  {competitionData.isMathContest && <Tag color="purple">数学类比赛</Tag>}
              </Col>
              <Col span={12}>
                <Text strong>平均比赛时长</Text>
                <br />
                <Text>{competitionData.averageContestDuration}</Text>
              </Col>
              <Col span={12}>
                <Text strong>平均获奖比例</Text>
                <br />
                <Text>{competitionData.averageWinRate}</Text>
              </Col>
              <Col span={12}>
                <Text strong>比赛网站</Text>
                <br />
                <a href={competitionData.officialWebsite} target="_blank" rel="noopener noreferrer">
                  {competitionData.officialWebsite}
                </a>
              </Col>
              <Col span={12}>
                <Text strong>比赛报名网址</Text>
                <br />
                <a href={competitionData.registrationLink} target="_blank" rel="noopener noreferrer">
                  {competitionData.registrationLink}
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
              title={<Link to={`/competitions/post/${post.id}`}>{post.title}</Link>}
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
      posts={hotCompetitionPosts}
      title="版块热帖"
      type="competitions/post"
    />
  );

  return (
    <SectionLayout
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
};

export default CompetitionDetailPage;