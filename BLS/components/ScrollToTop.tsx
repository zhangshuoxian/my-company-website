import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 每次路径(pathname)变化时，将窗口滚动到坐标(0, 0)即左上角
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // 这个组件不需要渲染任何画面
}