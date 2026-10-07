import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-amber-100 selection:text-[#C58B38]">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
