import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Divider,
  Input,
  Select,
  Tag,
  Space,
  List,
  Avatar,
  Form,
  Drawer,
  FloatButton
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  StarOutlined,
  ShareAltOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

// 模拟论文数据
const mockPapers = [
  {
    id: 1,
    title: '大数据及人工智能技术的计算机网络安全防御系统',
    authors: '刘王宁',
    journal: '网络安全技术与应用',
    publishDate: '2023-10-12',
    citations: 16,
    field: '计算机',
    subField: '网络安全',
    // impactFactor: 3.8,
    abstract: '在当前时代背景下，计算机对我们的工作生活影响越来越大，对促进社会经济发展和推动科技进步起到了至关重要的作用。但在应用计算机网络时，安全问题一直受到各界人士的关注，特别是随着大数据时代的到来，对于计算机网络安全防御系统的优化改进，也提出了更多更高的要求。本文研究的主要目的，是探讨基于人工智能技术和大数据时代背景下，如何改进和完善计算机网络安全防御系统，使系统的防御安全性得到保障，并使防御系统的智能化程度得到提升，为人们打造更加安全、稳定的网络使用环境。',
  },
  {
    id: 2,
    title: '低温产纤维素酶菌株的筛选、鉴定及纤维素酶学性质',
    authors: '穆春雷，武晓森，李术娜，马鸣超，李俊，沈德龙，朱宝成',
    journal: '微生物学通报',
    publishDate: '2013-07-30',
    citations: 104,
    field: '医学',
    subField: '生物学',
    // impactFactor: 5.2,
    abstract: '【目的】筛选一株低温产纤维素酶菌株并进行鉴定,初步探索其酶学性质,为微生物肥料生产筛选菌种资源。【方法】常温条件下,采用CMC-刚果红染色法初筛纤维素降解菌株。采用低温条件诱导的方法,筛选耐低温且产纤维素酶能力最强的菌株,经形态学、生理生化特征试验、ITS序列等方面分析系统分类地位。单因素试验确定温度、pH及金属离子对纤维素酶活力的影响。【结果】从秸秆还田土壤中分离出一株在13°C低温环境下高效分解纤维素的真菌M11,鉴定M11为草酸青霉(Penicillium oxalicum)。发酵试验表明:以玉米秸秆粉为唯一碳氮源,13°C、200 r/min摇床发酵培养9 d时,纤维素酶活力最高为33.08 U/mL。对其酶学性质初步研究表明:该酶最适pH为5.0,最适反应温度为20°C,在5°C?20°C间酶活力仍能保持在90%以上。【结论】Penicillium oxalicum M11是一株高效的纤维素降解菌株,在低温条件下可分泌纤维素酶且活性显著,具有潜在的开发价值。',
  },
  {
    id: 3,
    title: '变电站指针式仪表检测与识别方法',
    authors: '邢浩强，杜志岐，苏波',
    journal: '仪器仪表学报',
    publishDate: '2017-11-15',
    citations: 161,
    field: '工程',
    subField: '电力工业',
    // impactFactor: 4.1,
    abstract: '受限于复杂的电磁环境,变电站中的大量模拟式仪表需要人工读取示数,不利于变电站自动化管理。而目前针对仪表自动读数方法的研究大多基于预先获取到的高质量图像,其中仪表目标位于图像中央且占比较大,仪表表盘与相机平面平行,这需要大量预先的仪表测量与相机标定工作,不能满足实际电站环境下的使用要求。为解决上述问题,提出了一种完整的变电站指针式仪表的自动检测与识别方法。首先利用卷积神经网络模型检测当前视野下仪表目标的包围框位置,计算其距离视野中央的偏离值与图像占比,据此调整相机位置和缩放倍数。通过透视变换消除表盘平面与相机平面偏差造成的仪表图像畸变,通过霍夫变换检测仪表的表盘与指针,完成仪表读数识别。变电站实际测试实验结果表明,本方法最大读数误差仅为1.82%,对于复杂背景下多类别仪表的自动检测与识别任务具有良好的准确性与稳定性,可满足变电站实际应用需求。',
  },
  {
    id: 4,
    title: '社交媒体对青少年心理健康的影响研究',
    authors: '郑十一, 王十二',
    journal: '心理学报',
    publishDate: '2023-02-28',
    citations: 25,
    field: '社科',
    subField: '心理学',
    impactFactor: 2.9,
    abstract: '本研究通过问卷调查和实验研究相结合的方法，探讨了社交媒体使用对青少年心理健康的多维度影响...',
  },
];

// 筛选选项
const filterOptions = {
  fields: ['全部', '计算机', '医学', '工程', '社科', '物理', '化学', '生物', '经济'],
  years: ['全部', '2023', '2022', '2021', '2020', '2019', '更早'],
  citations: ['全部', '100+', '50-99', '10-49', '0-9'],
};

const PapersPage = () => {
  // 状态管理
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    journal: '',
    issn: '',
    direction: '',
    impactFactor: '',
    sciIndex: '',
    majorCategory: '',
    minorCategory: '',
  });

  const [filters, setFilters] = useState({
    field: '全部',
    year: '全部',
    citation: '全部',
  });

  const [papers, setPapers] = useState(mockPapers);

  // 移动端控制状态
  const [isMobile, setIsMobile] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
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

  // 处理搜索参数变化
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理筛选变化
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    // 这里可以添加实际的筛选逻辑
    // 目前使用模拟数据，实际项目中应该调用API进行筛选
  };

  // 执行搜索
  const handleSearch = () => {
    // 实际项目中应该调用API进行搜索
    console.log('搜索参数:', searchParams);
    console.log('筛选条件:', filters);

    // 模拟搜索结果
    // 实际项目中这里应该是API调用
  };

  return (
    <Layout.Content style={{ padding: isMobile ? '24px 16px' : '24px 50px', position: 'relative' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontWeight: 'bold', color: '#2C3E50' }}>
          论文资源
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
          上传论文
        </Button>
      </Row>

      {/* 搜索区域 - 桌面端显示 */}
      {!isMobile && (
        <Card style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space align="center">
              <SearchOutlined />
              <Text strong>论文搜索</Text>
            </Space>
            <Divider style={{ margin: '12px 0' }} />

            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item label="关键词搜索">
                    <Input
                      placeholder="输入论文标题、作者、关键词等"
                      name="keyword"
                      value={searchParams.keyword}
                      onChange={handleSearchChange}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="期刊名称">
                    <Input
                      placeholder="输入期刊名称"
                      name="journal"
                      value={searchParams.journal}
                      onChange={handleSearchChange}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="ISSN">
                    <Input
                      placeholder="输入ISSN号"
                      name="issn"
                      value={searchParams.issn}
                      onChange={handleSearchChange}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="研究方向">
                    <Input
                      placeholder="输入研究方向"
                      name="direction"
                      value={searchParams.direction}
                      onChange={handleSearchChange}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="影响因子">
                    <Select
                      placeholder="选择影响因子范围"
                      name="impactFactor"
                      value={searchParams.impactFactor}
                      onChange={(value) => setSearchParams(prev => ({ ...prev, impactFactor: value }))}
                      style={{ width: '100%' }}
                    >
                      <Option value="">全部</Option>
                      <Option value="5+">5.0以上</Option>
                      <Option value="3-5">3.0-5.0</Option>
                      <Option value="1-3">1.0-3.0</Option>
                      <Option value="0-1">1.0以下</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="SCI索引">
                    <Select
                      placeholder="选择SCI索引区间"
                      name="sciIndex"
                      value={searchParams.sciIndex}
                      onChange={(value) => setSearchParams(prev => ({ ...prev, sciIndex: value }))}
                      style={{ width: '100%' }}
                    >
                      <Option value="">全部</Option>
                      <Option value="Q1">Q1区</Option>
                      <Option value="Q2">Q2区</Option>
                      <Option value="Q3">Q3区</Option>
                      <Option value="Q4">Q4区</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="学科大类">
                    <Select
                      placeholder="选择学科大类"
                      name="majorCategory"
                      value={searchParams.majorCategory}
                      onChange={(value) => setSearchParams(prev => ({ ...prev, majorCategory: value }))}
                      style={{ width: '100%' }}
                    >
                      <Option value="">全部</Option>
                      <Option value="理学">理学</Option>
                      <Option value="工学">工学</Option>
                      <Option value="医学">医学</Option>
                      <Option value="农学">农学</Option>
                      <Option value="社科">社会科学</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="学科小类">
                    <Select
                      placeholder="选择学科小类"
                      name="minorCategory"
                      value={searchParams.minorCategory}
                      onChange={(value) => setSearchParams(prev => ({ ...prev, minorCategory: value }))}
                      style={{ width: '100%' }}
                    >
                      <Option value="">全部</Option>
                      <Option value="计算机">计算机科学与技术</Option>
                      <Option value="电子">电子信息</Option>
                      <Option value="机械">机械工程</Option>
                      <Option value="生物">生物医学</Option>
                      <Option value="化学">化学工程</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="center">
                <Col>
                  <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                    搜索论文
                  </Button>
                </Col>
              </Row>
            </Form>
          </Space>
        </Card>
      )}

      {/* 搜索抽屉 - 移动端 */}
      <Drawer
        title="论文搜索"
        placement="right"
        onClose={() => setSearchDrawerOpen(false)}
        open={searchDrawerOpen}
        // width={isMobile ? '100%' : 520}
        width={ 250 }
      >
        <Form layout="vertical">
          <Form.Item label="关键词搜索">
            <Input
              placeholder="输入论文标题、作者、关键词等"
              name="keyword"
              value={searchParams.keyword}
              onChange={handleSearchChange}
            />
          </Form.Item>

          <Form.Item label="期刊名称">
            <Input
              placeholder="输入期刊名称"
              name="journal"
              value={searchParams.journal}
              onChange={handleSearchChange}
            />
          </Form.Item>

          <Form.Item label="ISSN">
            <Input
              placeholder="输入ISSN号"
              name="issn"
              value={searchParams.issn}
              onChange={handleSearchChange}
            />
          </Form.Item>

          <Form.Item label="研究方向">
            <Input
              placeholder="输入研究方向"
              name="direction"
              value={searchParams.direction}
              onChange={handleSearchChange}
            />
          </Form.Item>

          <Form.Item label="影响因子">
            <Select
              placeholder="选择影响因子范围"
              name="impactFactor"
              value={searchParams.impactFactor}
              onChange={(value) => setSearchParams(prev => ({ ...prev, impactFactor: value }))}
              style={{ width: '100%' }}
            >
              <Option value="">全部</Option>
              <Option value="5+">5.0以上</Option>
              <Option value="3-5">3.0-5.0</Option>
              <Option value="1-3">1.0-3.0</Option>
              <Option value="0-1">1.0以下</Option>
            </Select>
          </Form.Item>

          <Form.Item label="SCI索引">
            <Select
              placeholder="选择SCI索引区间"
              name="sciIndex"
              value={searchParams.sciIndex}
              onChange={(value) => setSearchParams(prev => ({ ...prev, sciIndex: value }))}
              style={{ width: '100%' }}
            >
              <Option value="">全部</Option>
              <Option value="Q1">Q1区</Option>
              <Option value="Q2">Q2区</Option>
              <Option value="Q3">Q3区</Option>
              <Option value="Q4">Q4区</Option>
            </Select>
          </Form.Item>

          <Form.Item label="学科大类">
            <Select
              placeholder="选择学科大类"
              name="majorCategory"
              value={searchParams.majorCategory}
              onChange={(value) => setSearchParams(prev => ({ ...prev, majorCategory: value }))}
              style={{ width: '100%' }}
            >
              <Option value="">全部</Option>
              <Option value="理学">理学</Option>
              <Option value="工学">工学</Option>
              <Option value="医学">医学</Option>
              <Option value="农学">农学</Option>
              <Option value="社科">社会科学</Option>
            </Select>
          </Form.Item>

          <Form.Item label="学科小类">
            <Select
              placeholder="选择学科小类"
              name="minorCategory"
              value={searchParams.minorCategory}
              onChange={(value) => setSearchParams(prev => ({ ...prev, minorCategory: value }))}
              style={{ width: '100%' }}
            >
              <Option value="">全部</Option>
              <Option value="计算机">计算机科学与技术</Option>
              <Option value="电子">电子信息</Option>
              <Option value="机械">机械工程</Option>
              <Option value="生物">生物医学</Option>
              <Option value="化学">化学工程</Option>
            </Select>
          </Form.Item>

          <Button type="primary" block onClick={handleSearch} style={{ marginTop: 16 }}>
            搜索论文
          </Button>
        </Form>
      </Drawer>

      {/* 筛选和结果区域 */}
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

              <Form layout="vertical" style={{ width: '100%' }}>
                <Form.Item label="学科领域" style={{ marginBottom: 16 }}>
                  <Select
                    value={filters.field}
                    onChange={(value) => handleFilterChange('field', value)}
                    style={{ width: '100%' }}
                  >
                    {filterOptions.fields.map(field => (
                      <Option key={field} value={field}>{field}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="发表年份" style={{ marginBottom: 16 }}>
                  <Select
                    value={filters.year}
                    onChange={(value) => handleFilterChange('year', value)}
                    style={{ width: '100%' }}
                  >
                    {filterOptions.years.map(year => (
                      <Option key={year} value={year}>{year}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="引用次数" style={{ marginBottom: 16 }}>
                  <Select
                    value={filters.citation}
                    onChange={(value) => handleFilterChange('citation', value)}
                    style={{ width: '100%' }}
                  >
                    {filterOptions.citations.map(citation => (
                      <Option key={citation} value={citation}>{citation}</Option>
                    ))}
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
            <Form.Item label="学科领域" style={{ marginBottom: 16 }}>
              <Select
                value={filters.field}
                onChange={(value) => handleFilterChange('field', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.fields.map(field => (
                  <Option key={field} value={field}>{field}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="发表年份" style={{ marginBottom: 16 }}>
              <Select
                value={filters.year}
                onChange={(value) => handleFilterChange('year', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.years.map(year => (
                  <Option key={year} value={year}>{year}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="引用次数" style={{ marginBottom: 16 }}>
              <Select
                value={filters.citation}
                onChange={(value) => handleFilterChange('citation', value)}
                style={{ width: '100%' }}
              >
                {filterOptions.citations.map(citation => (
                  <Option key={citation} value={citation}>{citation}</Option>
                ))}
              </Select>
            </Form.Item>

            <Button type="primary" block style={{ marginTop: 16 }}>
              应用筛选
            </Button>
          </Form>
        </Drawer>

        {/* 论文列表 */}
        <Col xs={24} md={15}>
          <List
            itemLayout="vertical"
            dataSource={papers}
            renderItem={paper => (
              <List.Item
                key={paper.id}
                actions={[
                  <Text type="secondary">引用: {paper.citations}</Text>,
                  <Button key="bookmark" type="text" icon={<StarOutlined />}>收藏</Button>,
                  <Button key="share" type="text" icon={<ShareAltOutlined />}>分享</Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={`https://picsum.photos/id/${paper.id}/32/32`} />}
                  title={paper.title}
                  description={
                    <Space direction="vertical">
                      <Text type="secondary">{paper.authors}</Text>
                      <Text type="secondary">{paper.journal} - {paper.publishDate}</Text>
                      <Space direction="horizontal">
                        <Tag color="blue">{paper.field}</Tag>
                        <Tag color="geekblue">{paper.subField}</Tag>
                      </Space>
                    </Space>
                  }
                />
                <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>
                  {paper.abstract}
                </Paragraph>
              </List.Item>
            )}
          />
        </Col>
      </Row>

      {/* 移动端悬浮按钮 */}
      {isMobile && (
        <>
          <FloatButton
            icon={<SearchOutlined />}
            type="primary"
            style={{ right: 24, bottom: 84 }}
            onClick={() => setSearchDrawerOpen(true)}
            // tooltip="搜索"
          />
          <FloatButton
            icon={<FilterOutlined />}
            type="primary"
            style={{ right: 24, bottom: 24 }}
            onClick={() => setFilterDrawerOpen(true)}
            // tooltip="筛选"
          />
        </>
      )}
    </Layout.Content>
  );
};

export default PapersPage;
