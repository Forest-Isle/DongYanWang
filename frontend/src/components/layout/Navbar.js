import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Typography, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const { Header } = Layout;

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const navItems = [
    { title: '论文', path: '/papers' },
    { title: '实习', path: '/internships' },
    { title: '竞赛', path: '/competitions' },
    { title: '项目', path: '/projects' },
    { title: '个人中心', path: '/profile' },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <div style={{ width: 250 }}>
      <Menu
        mode="vertical"
        items={navItems.map((item) => ({
          key: item.path,
          label: <Link to={item.path}>{item.title}</Link>
        }))}
        onClick={toggleDrawer(false)}
      />
    </div>
  );

  return (
    <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', backgroundColor: '#2C3E50', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={4} style={{ margin: 0, lineHeight: '64px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>懂研网</Link>
        </Typography.Title>

        {isMobile ? (
          <>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={toggleDrawer(true)}
              style={{ color: 'white' }}
            />
            <Drawer
              placement="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              width={250}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Space>
            {navItems.map((item) => (
              <Button
                type="text"
                key={item.title}
                style={{
                  color: 'white',
                  margin: '0 4px',
                  '&:hover': {
                    backgroundColor: '#F39C12',
                  }
                }}
              >
                <Link to={item.path} style={{ color: 'white' }}>{item.title}</Link>
              </Button>
            ))}
          </Space>
        )}
      </div>
    </Header>
  );
};

export default Navbar;