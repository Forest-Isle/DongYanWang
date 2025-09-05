import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './App.css';

// 导入布局组件
import Navbar from './components/layout/Navbar';

// 导入页面组件
import HomePage from './components/home/HomePage';

import { JournalsHomePage, JournalCategoryPage, JournalDetailPage } from './components/journals';
import { SkillsHomePage, SkillCategoryPage, SkillDetailPage } from './components/skills';
import { CompetitionsHomePage, CompetitionCategoryPage, CompetitionDetailPage } from './components/competitions';
import { ProjectsHomePage, ProjectCategoryPage, ProjectDetailPage } from './components/projects';
import { AdmissionsHomePage, AdmissionDetailPage } from './components/admissions';

import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProfilePage from './components/profile/ProfilePage';
import TestRegister from './components/auth/TestRegister';
import DebugAPI from './components/auth/DebugAPI';

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
          {/* 首页 */}
          <Route path="/" element={<HomePage />} />

          {/* 期刊模块 */}
          <Route path="/journals" element={<JournalsHomePage />} />
          <Route path="/journals/category/:category" element={<JournalCategoryPage />} />
          <Route path="/journals/detail/:detail" element={<JournalDetailPage />} />

          {/* 技巧模块 */}
          <Route path="/skills" element={<SkillsHomePage />} />
          <Route path="/skills/category/:category" element={<SkillCategoryPage />} />
          <Route path="/skills/detail/:detail" element={<SkillDetailPage />} />

          {/* 竞赛模块 */}
          <Route path="/competitions" element={<CompetitionsHomePage />} />
          <Route path="/competitions/category/:category" element={<CompetitionCategoryPage />} />
          <Route path="/competitions/detail/:id" element={<CompetitionDetailPage />} />

          {/* 项目模块 */}
          <Route path="/projects" element={<ProjectsHomePage />} />
          <Route path="/projects/category/:category" element={<ProjectCategoryPage />} />
          <Route path="/projects/detail/:projectId" element={<ProjectDetailPage />} />

          {/* 招生机会模块 */}
          <Route path="/admissions" element={<AdmissionsHomePage />} />
          <Route path="/admissions/detail/:detail" element={<AdmissionDetailPage />} />

          {/* 认证页面 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/test" element={<TestRegister />} />
          <Route path="/debug" element={<DebugAPI />} />

          {/* 404页面 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;