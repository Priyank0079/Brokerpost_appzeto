import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-10 animate-fade-in max-w-[1600px] mx-auto w-full">
          {children}
        </main>


        <footer className="px-6 py-4 border-t border-slate-100 text-center text-slate-400 text-xs">
          © 2026 Brokerpost Network Platform. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
