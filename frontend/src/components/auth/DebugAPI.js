import React, { useState } from 'react';
import { Button, message, Card, Typography, Input, Form } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const DebugAPI = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const testDirectAPI = async () => {
    try {
      setLoading(true);
      console.log('开始直接测试API...');
      
      const testData = {
        username: 'debuguser' + Date.now(),
        email: 'debug' + Date.now() + '@example.com',
        password: 'Test123456',
        confirm_password: 'Test123456'
      };
      
      console.log('发送数据:', testData);
      
      // 直接使用axios，不通过API服务层
      const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', testData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      
      console.log('直接API响应:', response);
      message.success('直接API测试成功！');
    } catch (error) {
      console.error('直接API测试失败:', error);
      console.error('错误详情:', error.response?.data);
      console.error('错误状态码:', error.response?.status);
      console.error('错误状态文本:', error.response?.statusText);
      message.error('直接API测试失败: ' + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  const testWithForm = async (values) => {
    try {
      setLoading(true);
      console.log('开始表单测试API...');
      console.log('表单数据:', values);
      
      // 直接使用axios，不通过API服务层
      const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', values, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      
      console.log('表单API响应:', response);
      message.success('表单API测试成功！');
    } catch (error) {
      console.error('表单API测试失败:', error);
      console.error('错误详情:', error.response?.data);
      console.error('错误状态码:', error.response?.status);
      console.error('错误状态文本:', error.response?.statusText);
      message.error('表单API测试失败: ' + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2}>API 调试页面</Title>
        <p>这个页面用于调试前后端API连接问题</p>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button 
            type="primary" 
            loading={loading}
            onClick={testDirectAPI}
          >
            直接测试API
          </Button>
        </div>

        <div style={{ marginTop: '30px' }}>
          <Title level={4}>表单测试</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={testWithForm}
            style={{ maxWidth: 400, margin: '0 auto' }}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="用户名" />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱格式' }
              ]}
            >
              <Input placeholder="邮箱" />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码至少8位' }
              ]}
            >
              <Input.Password placeholder="密码" />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="确认密码" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ width: '100%' }}
              >
                表单测试API
              </Button>
            </Form.Item>
          </Form>
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <Title level={4}>调试说明：</Title>
          <ul>
            <li>点击"直接测试API"会发送预设的测试数据</li>
            <li>填写表单后点击"表单测试API"会发送表单数据</li>
            <li>请打开浏览器开发者工具查看控制台输出</li>
            <li>对比两种方式的差异，找出问题所在</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default DebugAPI;
