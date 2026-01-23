import React from 'react';
import ReactDOM from 'react-dom/client';
// 👇 1. 新增：引入路由工具 BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* 👇 2. 新增：用 BrowserRouter 把 <App /> 包起来 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);