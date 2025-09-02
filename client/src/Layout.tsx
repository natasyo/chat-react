import React, { type ReactNode } from 'react';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className={`flex flex-col w-full justify-between h-screen bg-white dark:bg-gray-800 dark:text-white`}
    >
      <Header />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
