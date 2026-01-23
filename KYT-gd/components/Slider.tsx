import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderProps {
  children: React.ReactNode[];
  itemsToShow?: number; // 这里是桌面端默认显示的个数
}

export const Slider: React.FC<SliderProps> = ({ children, itemsToShow = 4 }) => {
  const [index, setIndex] = useState(0);
  // 新增：responsiveItems 用来存储当前屏幕应该显示几个
  const [responsiveItems, setResponsiveItems] = useState(1);

  // 监听屏幕大小变化，自动调整显示个数
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // 手机端：只显示 1 个
        setResponsiveItems(1);
      } else if (window.innerWidth < 1024) {
        // 平板端：显示 2 个
        setResponsiveItems(2);
      } else {
        // 电脑端：使用传入的参数（通常是 4）
        setResponsiveItems(itemsToShow);
      }
    };

    // 初始化运行一次
    handleResize();

    // 监听窗口大小改变
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsToShow]);

  // 计算最大索引时，使用 responsiveItems
  const maxIndex = Math.max(0, children.length - responsiveItems);

  const next = () => setIndex(prev => Math.min(prev + 1, maxIndex));
  const prev = () => setIndex(prev => Math.max(prev - 1, 0));

  // 这里的 gap 是间距，tailwind 的 gap-4 等于 1rem (16px)
  // 我们根据显示个数计算每个子元素的宽度
  // 公式解释：100% / 个数 - (间距 * (个数 - 1) / 个数)
  // 为了简单，我们保留原来的近似计算方式，或者稍微优化一下
  const gap = 16; // gap-4 is 16px

  return (
    <div className="relative group">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out gap-4"
          // 移动距离也要根据 responsiveItems 动态计算
          style={{ transform: `translateX(-${index * (100 / responsiveItems)}%)` }}
        >
          {children.map((child, i) => (
            <div 
              key={i} 
              className="shrink-0" 
              // 关键修改：宽度基于 responsiveItems 计算
              style={{ width: `calc(${100 / responsiveItems}% - ${gap * (responsiveItems - 1) / responsiveItems}px)` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {index > 0 && (
        <button 
          onClick={prev}
          className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-white/90 shadow-lg p-2 rounded-full hover:bg-blue-50 text-blue-600 z-10 transition-colors border border-gray-100"
        >
          <ChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>
      )}
      
      {index < maxIndex && (
        <button 
          onClick={next}
          className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-white/90 shadow-lg p-2 rounded-full hover:bg-blue-50 text-blue-600 z-10 transition-colors border border-gray-100"
        >
          <ChevronRight size={20} className="md:w-6 md:h-6" />
        </button>
      )}
    </div>
  );
};