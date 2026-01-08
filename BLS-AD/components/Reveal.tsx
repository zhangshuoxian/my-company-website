
import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'none';
  delay?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({ children, direction = 'bottom', delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getInitialStyles = () => {
    switch (direction) {
      case 'left': return 'opacity-0 -translate-x-10';
      case 'right': return 'opacity-0 translate-x-10';
      case 'top': return 'opacity-0 -translate-y-2'; // 缩减位移
      case 'bottom': return 'opacity-0 translate-y-2'; // 缩减位移
      default: return 'opacity-0';
    }
  };

  const getVisibleStyles = () => {
    switch (direction) {
      case 'left':
      case 'right': return 'opacity-100 translate-x-0';
      case 'top':
      case 'bottom': return 'opacity-100 translate-y-0';
      default: return 'opacity-100';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible ? getVisibleStyles() : getInitialStyles()
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
