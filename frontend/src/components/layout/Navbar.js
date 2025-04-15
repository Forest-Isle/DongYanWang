import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Button, Typography, Space, Input, Avatar } from 'antd';
import { SearchOutlined, MessageOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import logo from '../../assets/logo.png';

const { Header } = Layout;

const Navbar = () => {
  const location = useLocation();
  const navItems = [
    { title: '首页', path: '/' },
    { title: '期刊', path: '/journals' },
    { title: '技巧', path: '/skills' },
    { title: '竞赛', path: '/competitions' },
    { title: '项目', path: '/projects' },
    { title: '招生机会', path: '/admissions' },
  ];

  // 检查当前路径是否匹配导航项路径
  const isActive = (itemPath) => {
    if (location.pathname === '/' && itemPath === '/') {
      return true;
    }
    return location.pathname.match(/^\/[^/]+/)?.[0] === itemPath;
  };

  return (
    <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', backgroundColor: '#2C3E50', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Title level={4} style={{ margin: 0, lineHeight: '64px', marginRight: '24px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img src={logo} alt="懂研青英网Logo" style={{ height: '44px', marginRight: '8px' }} />
              懂研青英网
            </Link>
          </Typography.Title>

          <Space>
            {navItems.map((item) => (
              <Button
                type="text"
                key={item.title}
                style={{
                  color: 'white',
                  margin: '0 4px',
                  borderBottom: isActive(item.path) ? '2px solid #FFFFFF' : 'none'
                }}
              >
                <Link to={item.path} style={{ color: 'white', fontWeight: isActive(item.path) ? 'bold' : 'normal' }}>{item.title}</Link>
              </Button>
            ))}
          </Space>
        </div>

        <Space size="middle">
          <Input
            prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />}
            placeholder="常见审稿意见及应对策略"
            style={{
              width: '300px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              border: 'none',
              color: 'white',
            }}
          />
          <Button type="text" icon={<MessageOutlined />} style={{ color: 'white' }} />
          <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }}>去发帖</Button>
          <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;