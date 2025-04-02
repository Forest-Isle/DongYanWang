import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './App.css';

// 导入布局组件
import Navbar from './components/layout/Navbar';

// 导入页面组件
import HomePage from './components/home/HomePage';
import PapersPage from './components/papers/PapersPage';
import InternshipsPage from './components/internships/InternshipsPage';
import CompetitionsPage from './components/competitions/CompetitionsPage';
import ProjectsPage from './components/projects/ProjectsPage';
import ProfilePage from './components/profile/ProfilePage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

// 配置Ant Design主题
const theme = {
  token: {
    colorPrimary: '#2C3E50',
    colorSuccess: '#F39C12',
    borderRadius: 8,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
      fontWeight: 500,
    },
    Card: {
      borderRadius: 8,
    },
  },
};

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '70vh',
      textAlign: 'center'
    }}>
      <h1>404 Not Found</h1>
      <p>The page does not exist.</p>
    </div>
  );
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
