import React from 'react';
import FeatureTiles from './FeatureTiles';
import Content from './Content';

const HomePage = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', marginTop: '-16px', paddingTop: '16px' }}>
      <FeatureTiles />
      <Content />
    </div>
  );
};

export default HomePage;