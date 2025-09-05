import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // 调用真实的登录API
      const response = await authAPI.login(values);
      const { access, refresh } = response.data;
      
      // 保存token到localStorage
      localStorage.setItem('auth_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      console.error('登录失败:', error);
      const errorMessage = error.response?.data?.msg || error.response?.data?.detail || '登录失败，请检查用户名和密码';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 64px)',
      padding: '24px',
      backgroundColor: '#f5f5f5'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#2C3E50', marginBottom: 8 }}>用户登录</Title>
          <Text type="secondary">欢迎回到懂研网，请登录您的账号</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 5, message: '用户名长度不能少于5个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码长度不能少于8个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', backgroundColor: '#2C3E50' }}
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Space>
              <Text type="secondary">还没有账号?</Text>
              <Link to="/register" style={{ color: '#F39C12' }}>立即注册</Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;