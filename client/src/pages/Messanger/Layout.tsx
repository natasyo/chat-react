import React, { type ReactNode } from 'react';
import { Sidebar } from '../../components/Sidebar.tsx';
import MessengerHeader from '../../components/messenger/MessengerHeader.tsx';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className={`flex h-screen max-h-screen overflow-auto p-6  justify-between bg-light-bg dark:bg-dark-bg dark:text-white`}
    >
      <Sidebar />
      <div className="flex flex-1 overflow-hidden flex-col w-full bg-light-panel dark:bg-dark-panel rounded-2xl">
        <MessengerHeader />
        <>{children}</>
      </div>
    </div>
  );
};

export default Layout;
