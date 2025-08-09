import React from 'react';
import { Layout, Typography, Row, Col, Card, Button, Avatar, Table, Tag, List, Space } from 'antd';
import { HeartOutlined, HeartFilled, FireOutlined, UserOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Text, Paragraph } = Typography;

// 模拟期刊数据
const journalData = {
  id: 1,
  name: 'Nature',
  cover: 'http://www.gxaai.com/uploadfile/2019/0802/20190802105017335.jpg',
  averageReviewTime: '网友分享经验：平均6.5个月',
 c: '网友分享经验：约10.62%',
  officialWebsite: 'https://www.nature.com/nature',
  authorGuide: 'https://www.nature.com/nature/for-authors',
  impactFactor: 50.5,
  isSCIE: true,
  isComprehensive: true,
  isTop: true,
  followers: 12345,
  todayUpdates: 25,
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
    title: '期刊投稿选题策略指导',
    author: '马教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProfMa',
    date: '2025-04-08',
    content: '分享如何选择适合期刊定位的研究主题，提高论文录用率...',
    views: 1876,
    likes: 423,
    comments: 89,
  },
  {
    id: 2,
    title: '高分论文写作结构分析',
    author: '丁研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ResDing',
    date: '2025-04-07',
    content: '通过实例解析高分论文的写作结构和技巧，帮助提升论文质量...',
    views: 1654,
    likes: 389,
    comments: 76,
  },
  {
    id: 3,
    title: '投稿邮件书写模板',
    author: '范老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherFan',
    date: '2025-04-06',
    content: '整理了与编辑邮件往来的标准模板，提高投稿效率...',
    views: 1543,
    likes: 345,
    comments: 65,
  },
  {
    id: 4,
    title: '审稿意见回复技巧',
    author: '童博士',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrTong',
    date: '2025-04-05',
    content: '分享如何有效回应审稿人意见，提高论文修改质量...',
    views: 1432,
    likes: 312,
    comments: 58,
  },
  {
    id: 5,
    title: '论文图表制作指南',
    author: '卢工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EngLu',
    date: '2025-04-04',
    content: '介绍专业论文图表设计与制作方法，提升论文视觉表现...',
    views: 1321,
    likes: 287,
    comments: 52,
  },
  {
    id: 6,
    title: 'SI数据分析方法详解',
    author: '石统计师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StatShi',
    date: '2025-04-03',
    content: '详细讲解期刊论文中常用的统计分析方法和工具使用...',
    views: 1234,
    likes: 265,
    comments: 47,
  },
  {
    id: 7,
    title: '参考文献规范引用',
    author: '贺编辑',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EditHe',
    date: '2025-04-02',
    content: '解析各类期刊的参考文献格式规范，避免引用错误...',
    views: 1156,
    likes: 243,
    comments: 42,
  },
  {
    id: 8,
    title: '期刊特刊投稿建议',
    author: '毛主编',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChiefMao',
    date: '2025-04-01',
    content: '分享特刊投稿的时机选择和注意事项，提高录用机会...',
    views: 1087,
    likes: 224,
    comments: 38,
  },
  {
    id: 9,
    title: '高水平综述写作方法',
    author: '田学者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ScholarTian',
    date: '2025-03-31',
    content: '探讨如何撰写高质量的综述论文，梳理研究进展...',
    views: 965,
    likes: 198,
    comments: 34,
  },
  {
    id: 10,
    title: '期刊学术不端检测指南',
    author: '梁审查员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RevLiang',
    date: '2025-03-30',
    content: '介绍主要期刊的学术规范和论文查重要求，确保论文原创性...',
    views: 876,
    likes: 176,
    comments: 29,
  }
];

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

const JournalDetailPage = () => {
  const { journalId } = useParams();
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
              { title: '期刊', path: '/journals' },
              { title: journalData.name },
            ]}
          />
        </Col>
        <Col>
          <Space size="large">
            <Space>
              <Text>关注数：{journalData.followers}</Text>
              <Text>今日更新：{journalData.todayUpdates}</Text>
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
              {journalData.moderators.map(mod => (
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

      {/* 期刊基本信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={3.5}>
            <img
              src={journalData.cover}
              alt={journalData.name}
              style={{ height: '150px' }}
            />
          </Col>
          <Col span={20}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text><Text strong>期刊名称：</Text>{journalData.name}</Text>
              </Col>
              <Col span={12}>
                  {journalData.isSCIE && <Tag color="blue">SCIE</Tag>}
                  {journalData.isComprehensive && <Tag color="green">综合性期刊</Tag>}
                  {journalData.isTop && <Tag color="red">Top</Tag>}
                  <Tag color="purple">IF {journalData.impactFactor}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>平均审稿速度</Text>
                <br />
                <Text>{journalData.averageReviewTime}</Text>
              </Col>
              <Col span={12}>
                <Text strong>平均录用比例</Text>
                <br />
                <Text>{journalData.acceptanceRate}</Text>
              </Col>
              <Col span={12}>
                <Text strong>期刊官网</Text>
                <br />
                <a href={journalData.officialWebsite} target="_blank" rel="noopener noreferrer">
                  {journalData.officialWebsite}
                </a>
              </Col>
              <Col span={12}>
                <Text strong>作者指南</Text>
                <br />
                <a href={journalData.authorGuide} target="_blank" rel="noopener noreferrer">
                  {journalData.authorGuide}
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
              title={<Link to={`/journals/post/${post.id}`}>{post.title}</Link>}
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

export default JournalDetailPage;