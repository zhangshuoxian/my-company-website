import React, { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  bgColor?: 'white' | 'gray';
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = '', bgColor = 'white', id }) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${bgColor === 'gray' ? 'bg-gray-50' : 'bg-white'} ${className}`}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
};

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, align = 'center' }) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
      {subtitle && <div className={`h-1 w-20 bg-brand-green rounded ${align === 'center' ? 'mx-auto' : ''}`}></div>}
      {subtitle && <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
};
