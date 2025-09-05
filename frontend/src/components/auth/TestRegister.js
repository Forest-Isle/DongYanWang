import React, { useState } from 'react';
import { Button, message, Card, Typography } from 'antd';
import { authAPI } from '../../services/api';

const { Title } = Typography;

const TestRegister = () => {
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const testRegister = async () => {
    try {
      setLoading(true);
      console.log('开始测试注册...');
      
      const testData = {
        username: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'Test123456',
        confirm_password: 'Test123456'
      };
      
      console.log('发送数据:', testData);
      console.log('API URL:', 'http://127.0.0.1:8000/api/auth/register/');
      
      const response = await authAPI.register(testData);
      
      console.log('注册响应:', response);
      setRegisteredUser(testData); // 保存注册的用户信息
      message.success('注册测试成功！用户名: ' + testData.username);
    } catch (error) {
      console.error('注册测试失败:', error);
      console.error('错误详情:', error.response?.data);
      console.error('错误状态码:', error.response?.status);
      console.error('错误状态文本:', error.response?.statusText);
      console.error('完整错误对象:', error);
      message.error('注册测试失败: ' + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    try {
      setLoading(true);
      console.log('开始测试登录...');
      
      if (!registeredUser) {
        message.warning('请先进行注册测试！');
        return;
      }
      
      const testData = {
        username: registeredUser.username, // 使用注册时的用户名
        password: registeredUser.password
      };
      
      console.log('发送数据:', testData);
      
      const response = await authAPI.login(testData);
      
      console.log('登录响应:', response);
      message.success('登录测试成功！');
    } catch (error) {
      console.error('登录测试失败:', error);
      console.error('错误详情:', error.response?.data);
      message.error('登录测试失败: ' + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <Title level={2}>API 测试页面</Title>
        <p>这个页面用于测试前后端API连接</p>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button 
            type="primary" 
            loading={loading}
            onClick={testRegister}
          >
            测试注册API
          </Button>
          
          <Button 
            type="default" 
            loading={loading}
            onClick={testLogin}
          >
            测试登录API
          </Button>
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h4>测试说明：</h4>
          <ul>
            <li>点击"测试注册API"会发送一个注册请求到后端</li>
            <li>点击"测试登录API"会发送一个登录请求到后端</li>
            <li>请打开浏览器开发者工具查看控制台输出</li>
            <li>如果看到错误信息，请检查网络连接和后端服务状态</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default TestRegister;
