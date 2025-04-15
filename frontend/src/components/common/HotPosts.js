import React from 'react';
import { Typography, List, Avatar, Tag } from 'antd';
import { FireOutlined, StarOutlined, EyeOutlined, CommentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

/**
 * 热门帖子组件 - 用于各板块首页右侧显示
 * @param {Array} posts - 帖子数据数组
 * @param {string} title - 标题
 * @param {string} type - 帖子类型（用于构建链接）
 */
const HotPosts = ({ posts, title = '热门帖子', type = 'post' }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <>
      <Title level={4}>
        <FireOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
        {title}
      </Title>
      <List
        itemLayout="horizontal"
        dataSource={posts.slice(0, 10)}
        renderItem={(item, index) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={
                <span>
                  <span style={rankStyles[index + 1] || rankStyles.default}>{index + 1}</span>
                  {' '}<Link to={`/${type}/${item.id}`} style={{ color: 'black' }}>{item.title}</Link>
                </span>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default HotPosts;

const rankStyles = {
  1: { backgroundColor: '#ff4d4f', color: 'white', padding: '2px 8px', borderRadius: '4px' },
  2: { backgroundColor: '#ff7a45', color: 'white', padding: '2px 8px', borderRadius: '4px' },
  3: { backgroundColor: '#ffc53d', color: 'white', padding: '2px 8px', borderRadius: '4px' },
  default: { backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }
};