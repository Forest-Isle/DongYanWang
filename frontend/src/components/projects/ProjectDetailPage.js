import React from 'react';
import { Layout, Typography, Row, Col, Card, Button, Avatar, Table, Tag, List, Space } from 'antd';
import { HeartOutlined, HeartFilled, FireOutlined, UserOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Text, Paragraph } = Typography;

// 模拟项目数据
const projectData = {
  id: 1,
  name: '基于人工智能的碳中和战略研究',
  code: 'NSFC2023A001',
  cover: 'https://cl.ustc.edu.cn/images/NSFC.jpeg',
  averageDuration: '3年',
  startDate: '2023-07-01',
  endDate: '2026-06-30',
  officialWebsite: 'https://www.nsfc.gov.cn',
  applicationGuide: 'https://www.nsfc.gov.cn/publish/portal0/tab568/info88015.htm',
  fundingAmount: '500万元',
  category: '国家自然科学基金重点项目',
  status: '进行中',
  isCooperation: true,
  followers: 8765,
  todayUpdates: 15,
  moderators: [
    {
      id: 1,
      name: '张教授',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof1',
      title: '项目负责人'
    },
    {
      id: 2,
      name: '李研究员',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof2',
      title: '项目骨干'
    },
    {
      id: 3,
      name: '王博士',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof3',
      title: '项目骨干'
    }
  ]
};

// 模拟网友帖子数据
const communityPosts = [
  {
    id: 1,
    title: 'NSFC项目预算编制关键点',
    author: '阎主任',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DirectorYan',
    date: '2025-04-08',
    content: '详细解读国家自然科学基金项目预算编制的要点和注意事项...',
    views: 1876,
    likes: 423,
    comments: 86,
  },
  {
    id: 2,
    title: 'NSFC项目进度管理经验',
    author: '施教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProfShi',
    date: '2025-04-07',
    content: '分享国家自然科学基金项目执行过程中的进度把控方法...',
    views: 1765,
    likes: 389,
    comments: 74,
  },
  {
    id: 3,
    title: 'NSFC新版申报系统指南',
    author: '庞工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EngPang',
    date: '2025-04-06',
    content: '图文详解国家自然科学基金新版申报系统的操作流程...',
    views: 1654,
    likes: 356,
    comments: 68,
  },
  {
    id: 4,
    title: 'NSFC中期检查材料准备',
    author: '谭秘书',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SecTan',
    date: '2025-04-05',
    content: '整理中期检查需要准备的材料清单和撰写要求...',
    views: 1543,
    likes: 334,
    comments: 61,
  },
  {
    id: 5,
    title: 'NSFC项目组会议记录规范',
    author: '翁助理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AssisWeng',
    date: '2025-04-04',
    content: '分享项目组会议记录的标准格式和重点内容...',
    views: 1432,
    likes: 298,
    comments: 54,
  },
  {
    id: 6,
    title: 'NSFC结题材料审核要点',
    author: '虞研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ResYu',
    date: '2025-04-03',
    content: '详解结题材料审核过程中的关键点和常见问题...',
    views: 1321,
    likes: 276,
    comments: 48,
  },
  {
    id: 7,
    title: 'NSFC项目延期申请指南',
    author: '樊老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherFan',
    date: '2025-04-02',
    content: '解析项目延期申请的条件、流程和材料要求...',
    views: 1234,
    likes: 254,
    comments: 43,
  },
  {
    id: 8,
    title: 'NSFC支出凭证管理规范',
    author: '窦会计',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AccDou',
    date: '2025-04-01',
    content: '介绍项目经费支出凭证的整理和归档要求...',
    views: 1143,
    likes: 232,
    comments: 38,
  },
  {
    id: 9,
    title: 'NSFC项目资产采购流程',
    author: '益采购员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PurYi',
    date: '2025-03-31',
    content: '详细说明项目设备和材料采购的规范流程...',
    views: 1087,
    likes: 212,
    comments: 34,
  },
  {
    id: 10,
    title: 'NSFC项目成果统计方法',
    author: '雍统计师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StatYong',
    date: '2025-03-30',
    content: '分享项目成果的分类统计和整理方法...',
    views: 965,
    likes: 189,
    comments: 29,
  }
];

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

const ProjectDetailPage = () => {
  const { projectId } = useParams();
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
              { title: '项目', path: '/projects' },
              { title: projectData.name },
            ]}
          />
        </Col>
        <Col>
          <Space size="large">
            <Space>
              <Text>关注数：{projectData.followers}</Text>
              <Text>今日更新：{projectData.todayUpdates}</Text>
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
              {projectData.moderators.map(mod => (
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

      {/* 项目基本信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={4}>
            <img
              src={projectData.cover}
              alt={projectData.name}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={20}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text><Text strong>项目名称：</Text>{projectData.name}</Text>
              </Col>
              <Col span={12}>
                <Text><Text strong>项目编号：</Text>{projectData.code}</Text>
              </Col>
              <Col span={12}>
                <Text><Text strong>项目类别：</Text>{projectData.category}</Text>
              </Col>
              <Col span={12}>
                <Space>
                  <Tag color={projectData.status === '进行中' ? 'blue' : projectData.status === '已结题' ? 'green' : 'orange'}>
                    {projectData.status}
                  </Tag>
                  {projectData.isCooperation && <Tag color="purple">合作项目</Tag>}
                </Space>
              </Col>
              <Col span={12}>
                <Text strong>项目周期</Text>
                <br />
                <Text>{projectData.startDate} 至 {projectData.endDate}</Text>
              </Col>
              <Col span={12}>
                <Text strong>资助金额</Text>
                <br />
                <Text>{projectData.fundingAmount}</Text>
              </Col>
              <Col span={12}>
                <Text strong>项目申报指南</Text>
                <br />
                <a href={projectData.officialWebsite} target="_blank" rel="noopener noreferrer">
                  {projectData.officialWebsite}
                </a>
              </Col>
              <Col span={12}>
                <Text strong>申请指南</Text>
                <br />
                <a href={projectData.applicationGuide} target="_blank" rel="noopener noreferrer">
                  {projectData.applicationGuide}
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
              title={<Link to={`/projects/post/${post.id}`}>{post.title}</Link>}
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

export default ProjectDetailPage;