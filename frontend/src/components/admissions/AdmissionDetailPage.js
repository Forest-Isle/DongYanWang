import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Button, Avatar, Tag, List, Space } from 'antd';
import { HeartOutlined, HeartFilled, FireOutlined, UserOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Text, Paragraph } = Typography;

// 模拟项目招生数据
const projectData = {
  id: 1,
  name: '中南大学暑期项目',
  applicationDeadline: '网友分享经验：每年4月30日截止',
  acceptanceRate: '网友分享经验：约30%',
  officialWebsite: 'https://www.csu.edu.cn/summer-projects',
  applicationGuide: 'https://www.csu.edu.cn/summer-projects/guide',
  projectDuration: '8周',
  isNational: true,
  isCompetitive: true,
  isScholarship: true,
  followers: 8742,
  todayUpdates: 15,
  moderators: [
    {
      id: 1,
      name: '张教授',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
      title: '主版主'
    },
    {
      id: 2,
      name: '李老师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof2',
      title: '副版主'
    }
  ]
};

// 模拟导师招生数据
const researchData = {
  id: 2,
  name: '中南大学导师招生',
  applicationDeadline: '网友分享经验：每年5月15日截止',
  acceptanceRate: '网友分享经验：约15%',
  officialWebsite: 'https://www.csu.edu.cn/professor-recruitment',
  applicationGuide: 'https://www.csu.edu.cn/professor-recruitment/guide',
  researchAreas: '人工智能、大数据、材料科学',
  isNational: true,
  isCompetitive: true,
  isScholarship: true,
  followers: 9563,
  todayUpdates: 23,
  moderators: [
    {
      id: 1,
      name: '王主任',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof3',
      title: '主版主'
    },
    {
      id: 2,
      name: '赵教授',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof4',
      title: '副版主'
    }
  ]
};

// 模拟暑期项目相关帖子数据
const projectPosts = [
  {
    id: 1,
    title: '分享我申请中南大学暑期项目的经验',
    author: '张同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student1',
    date: '2023-12-15',
    content: '经过精心准备申请材料，最终成功获得了中南大学暑期项目的录取，这里分享一下经验。首先要注意项目申请表格的填写，尤其是个人陈述部分要突出自己的学术背景和对项目的热情。其次，推荐信很重要，最好找熟悉你学术能力的导师撰写。最后，如果有相关的研究或项目经验，一定要详细说明。',
    views: 1256,
    likes: 328,
    comments: 42,
  },
  {
    id: 2,
    title: '暑期项目面试技巧分享',
    author: '王同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student3',
    date: '2023-12-05',
    content: '成功通过中南大学暑期项目面试，我认为关键在于充分准备。面试官特别关注你对项目研究方向的了解程度，建议提前阅读相关导师的研究论文。另外，准备一个简短但有亮点的自我介绍很重要。面试中如果遇到不会的问题，坦诚表达并展示你的思考过程比装懂更重要。',
    views: 1542,
    likes: 426,
    comments: 58,
  },
  {
    id: 3,
    title: '中南大学暑期项目的8周生活是怎样的？',
    author: '刘同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student4',
    date: '2023-11-20',
    content: '参加完今年的暑期项目，分享一下8周的生活体验。每周都有固定的研讨会和实验室工作，强度适中但很充实。项目组织了多次学术讲座和参观活动，能接触到最前沿的研究。住宿条件不错，校园环境优美。最大收获是认识了一群志同道合的朋友，建立了宝贵的学术人脉。对未来申请研究生很有帮助！',
    views: 1325,
    likes: 289,
    comments: 46,
  },
  {
    id: 4,
    title: '暑期项目申请材料准备全攻略',
    author: '陈同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student5',
    date: '2023-10-15',
    content: '去年申请中南大学暑期项目被拒，今年重新准备后成功获录。分享一下申请材料的准备经验：1. 成绩单需要提供正式的中英文版本；2. 个人陈述要突出为什么选择这个项目，以及你能带来什么；3. 简历要重点突出相关的课程项目和技能；4. 推荐信最好找相关领域的教授。另外，提前3-4周开始准备，留出充足时间修改完善。',
    views: 1105,
    likes: 312,
    comments: 39,
  },
];

// 模拟导师招生相关帖子数据
const researchPosts = [
  {
    id: 1,
    title: '如何联系中南大学意向导师？经验分享',
    author: '李研究生',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student2',
    date: '2023-12-10',
    content: '成功联系上心仪导师的经验分享。首先，阅读导师近5年的论文，了解研究方向和成果。其次，邮件联系要简洁明了，包括自我介绍、为什么选择该导师、自己的学术背景和研究兴趣。最好附上简历，但不要太长。一般2-3周内会收到回复，没回复可以礼貌地再次发送提醒邮件。一些导师更喜欢视频面谈，做好准备。',
    views: 986,
    likes: 215,
    comments: 36,
  },
  {
    id: 2,
    title: '中南大学各学院导师招生情况调查',
    author: '赵博士',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student6',
    date: '2023-11-25',
    content: '整理了中南大学各学院的导师招生情况。信息与电气工程学院今年招生名额较多，尤其是人工智能和大数据方向；材料科学与工程学院的导师资源丰富，但竞争也最激烈；地球科学学院有较多国家项目，奖学金待遇好。建议关注学院官网和导师个人主页，有些导师会提前公布具体的招生计划和要求。',
    views: 1623,
    likes: 486,
    comments: 67,
  },
  {
    id: 3,
    title: '导师面试常见问题及如何应对',
    author: '孙研究生',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student7',
    date: '2023-11-15',
    content: '总结了中南大学导师面试中常见的问题：1.为什么选择这个研究方向？2.本科阶段的研究经历？3.对导师研究领域的了解？4.未来的研究计划和职业规划？准备时建议深入了解导师的研究方向和最新成果，准备3-5个能展示自己专业能力的研究案例，思考清楚为什么选择这位导师。面试态度要谦虚但自信。',
    views: 1432,
    likes: 358,
    comments: 52,
  },
  {
    id: 4,
    title: '中南大学人工智能方向导师招生情况',
    author: '吴同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student8',
    date: '2023-10-05',
    content: '整理了中南大学人工智能方向导师的招生情况。张教授团队主要研究计算机视觉，每年招收2-3名学生；李教授团队专注于自然语言处理，今年有国家重点项目，招生名额较多；王教授团队研究强化学习与机器人，要求较高但资源丰富。大部分导师要求有相关的编程背景和数学基础，有些还需要英语较好。建议提前半年联系心仪导师。',
    views: 1654,
    likes: 423,
    comments: 61,
  },
];

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

const AdmissionDetailPage = () => {
  const location = useLocation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [pageTitle, setPageTitle] = useState('');
  const [postsList, setPostsList] = useState([]);

  // 根据URL参数确定显示项目还是导师招生信息
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');

    if (type === 'project') {
      setPageData(projectData);
      setPageTitle('暑期项目');
      setPostsList(projectPosts);
    } else if (type === 'research') {
      setPageData(researchData);
      setPageTitle('导师招生');
      setPostsList(researchPosts);
    } else {
      // 默认显示项目信息
      setPageData(projectData);
      setPageTitle('暑期项目');
      setPostsList(projectPosts);
    }
  }, [location]);

  // 切换关注状态
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (!pageData) {
    return <div>加载中...</div>;
  }

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <BreadcrumbNav
            items={[
              { title: '首页', path: '/' },
              { title: '招生机会', path: '/admissions' },
              { title: pageData.name },
            ]}
          />
        </Col>
        <Col>
          <Space size="large">
            <Space>
              <Text>关注数：{pageData.followers}</Text>
              <Text>今日更新：{pageData.todayUpdates}</Text>
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
              {pageData.moderators.map(mod => (
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

      {/* 招生基本信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={4}>{pageData.name}</Title>
            <Tag color="red">热点Top10</Tag>
            <Tag color="blue">985院校</Tag>
            <Tag color="green">竞争激烈</Tag>
          </Col>
          {pageTitle === '暑期项目' && (
            <Col span={12}>
              <Text strong>项目周期</Text>
              <br />
              <Text>{pageData.projectDuration}</Text>
            </Col>
          )}
          {pageTitle === '导师招生' && (
            <Col span={12}>
              <Text strong>研究方向</Text>
              <br />
              <Text>{pageData.researchAreas}</Text>
            </Col>
          )}
          <Col span={12}>
            <Text strong>申请截止日期</Text>
            <br />
            <Text>{pageData.applicationDeadline}</Text>
          </Col>
          <Col span={12}>
            <Text strong>录取比例</Text>
            <br />
            <Text>{pageData.acceptanceRate}</Text>
          </Col>
          <Col span={12}>
            <Text strong>官方网站</Text>
            <br />
            <a href={pageData.officialWebsite} target="_blank" rel="noopener noreferrer">
              {pageData.officialWebsite}
            </a>
          </Col>
          <Col span={12}>
            <Text strong>申请指南</Text>
            <br />
            <a href={pageData.applicationGuide} target="_blank" rel="noopener noreferrer">
              {pageData.applicationGuide}
            </a>
          </Col>
        </Row>
      </Card>

      {/* 网友帖子列表 */}
      <Title level={4} style={{ marginBottom: 16 }}>网友经验分享</Title>
      <List
        itemLayout="vertical"
        dataSource={postsList}
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
              title={<Link to={`/admissions/post/${post.id}`}>{post.title}</Link>}
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
      posts={hotAdmissionPosts}
      title="版块热帖"
      type="admissions/post"
    />
  );

  return (
    <SectionLayout
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
};

export default AdmissionDetailPage;