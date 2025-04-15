import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

/**
 * 面包屑导航组件 - 用于各板块页面
 * @param {Array} items - 面包屑项目数组，格式为 [{title: string, path: string}]
 */
const BreadcrumbNav = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb
      items={items.map((item, index) => ({
        title: item.path ? <Link to={item.path}>{item.title}</Link> : item.title
      }))}
      style={{ marginBottom: 16 }}
    />
  );
};

export default BreadcrumbNav;