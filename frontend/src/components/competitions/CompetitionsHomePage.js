import React from 'react';
import { Layout, Typography, Row, Col, Card, Input, Table, Tag, Form, Select, Button } from 'antd';
import { Link } from 'react-router-dom';
import HotPosts from '../common/HotPosts';
import SectionLayout from '../layout/SectionLayout';
import BreadcrumbNav from '../common/BreadcrumbNav';

const { Title, Paragraph } = Typography;

// 竞赛分类数据
const competitionCategories = [
  {
    group: '工科',
    fields: ['数学建模', '材料高分子', '大数据', '交通车辆', '工程机械', '程序设计', '电子&自动化', '船舶海洋', '环境能源', '航空航天', '土木建筑', '计算机&信息技术', '机器人']
  },
  {
    group: '文体',
    fields: ['外语', 'UI设计', '科技文化艺术节', '服装设计', '工业&创意设计', '电子竞技', '艺术素养', '演讲主持&辩论', '体育', '模特', '歌舞书画&摄影']
  },
  {
    group: '理科',
    fields: ['力学', '物理', '数学', '化学化工', '健康生命&医学']
  },
  {
    group: '商科',
    fields: ['商业', '创业', '创青春']
  },
  {
    group: '综合',
    fields: ['社会综合', '环保公益', '职业技能', '挑战杯']
  }
];

const competitionLevels = [
  { value: 'national', label: '国家级' },
  { value: 'provincial', label: '省级' },
  { value: 'municipal', label: '市级' },
  { value: 'school', label: '校级' }
];

const awardLevels = [
  { value: 'special', label: '特等奖' },
  { value: 'first', label: '一等奖' },
  { value: 'second', label: '二等奖' },
  { value: 'third', label: '三等奖' }
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

const CompetitionsHomePage = () => {
  const [form] = Form.useForm();

  // 左侧内容区域
  const leftContent = (
    <>
      {/* 面包屑导航 */}
      <BreadcrumbNav
        items={[
          { title: '首页', path: '/' },
          { title: '竞赛' },
        ]}
      />

      {/* 竞赛查询搜索框 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>竞赛查询</Title>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={4}>
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="输入竞赛名称关键词" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="level" label="竞赛级别">
                <Select placeholder="选择竞赛级别">
                  {competitionLevels.map(level => (
                    <Select.Option key={level.value} value={level.value}>
                      {level.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="category" label="竞赛类别">
                <Select placeholder="选择竞赛类别">
                  {competitionCategories.map(category => (
                    <Select.Option key={category.group} value={category.group}>
                      {category.group}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="awardLevel" label="获奖等级">
                <Select placeholder="选择获奖等级">
                  {awardLevels.map(award => (
                    <Select.Option key={award.value} value={award.value}>
                      {award.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="hasBonus" label="是否有奖金">
                <Select placeholder="是否有奖金">
                  <Select.Option value="yes">有奖金</Select.Option>
                  <Select.Option value="no">无奖金</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="search" label="查询">
                <Button type="primary" htmlType="submit">按当前条件查询</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 竞赛推广及青英辅学卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card
            hoverable
            style={{
              background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: 'none'
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Title level={4} style={{ color: '#003a70', marginBottom: 12, fontWeight: 600 }}>ACM国际大学生程序设计竞赛</Title>
            <Paragraph style={{ color: '#1a1a1a', marginBottom: 16, fontSize: '15px' }}>
              ACM-ICPC是世界最具影响力的大学生程序设计竞赛，旨在展示大学生创新能力、团队精神和在压力下编写程序、分析和解决问题的能力。每年吸引来自全球数千所大学的学生参赛。
            </Paragraph>
            <div>
              <Tag color="#0050b3" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>国际级赛事</Tag>
              <Tag color="#0050b3" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>高含金量</Tag>
              <Tag color="#0050b3" style={{ color: '#ffffff', fontWeight: 'bold' }}>就业敲门砖</Tag>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            style={{
              background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: 'none'
            }}
            bodyStyle={{ padding: 20 }}
            onClick={() => window.open('/青英/1青英辅学.html', '_blank')}
          >
            <Title level={4} style={{ color: '#135200', marginBottom: 12, fontWeight: 600 }}>青英辅学 - 名师带你竞赛拿奖到手软</Title>
            <Paragraph style={{ color: '#1a1a1a', marginBottom: 16, fontSize: '15px' }}>
              我们拥有顶尖竞赛导师团队，一对一指导，专业备赛方案，历届获奖选手经验分享。
              参与我们的培训计划，让你在各类竞赛中脱颖而出！
            </Paragraph>
            <div>
              <Tag color="#237804" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>一对一指导</Tag>
              <Tag color="#237804" style={{ color: '#ffffff', fontWeight: 'bold', marginRight: 8 }}>系统培训</Tag>
              <Tag color="#237804" style={{ color: '#ffffff', fontWeight: 'bold' }}>高效备赛</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 竞赛分类分组布局 */}
      <Row gutter={[16, 16]}>
        {competitionCategories.map(category => (
          <Col span={24} key={category.group}>
            <Card title={category.group} bordered={false}>
              <Row gutter={[8, 8]}>
                {category.fields.map(field => (
                  <Col span={3} key={field}>
                    <Link to={`/competitions/category/${field}`}>{field}</Link>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
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

export default CompetitionsHomePage;