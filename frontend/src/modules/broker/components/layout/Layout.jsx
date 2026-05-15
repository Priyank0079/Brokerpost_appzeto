import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, MessageCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

import { useLandingConfig } from '../../../../hooks/useLandingConfig';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  const { config } = useLandingConfig();
  const [stats, setStats] = useState(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const { getPostingStats } = await import('../../services/postingService');
        const res = await getPostingStats();
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch sidebar stats', err);
      }
    };
    if (!isHomePage) fetchStats();
  }, [isHomePage]);

  const contact = config?.contact || {
    whatsapp: "910000000000"
  };

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden relative">
      {!isHomePage && (
        <>
          {sidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <Sidebar 
            isOpen={sidebarOpen} 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            isCollapsed={isCollapsed}
            toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            stats={stats}
          />
        </>
      )}
      
      <div className={`flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-500 ease-in-out ${!isHomePage ? (isCollapsed ? 'lg:ml-20' : 'lg:ml-64') : ''}`}>
        {!isHomePage && (
          <Navbar 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            isCollapsed={isCollapsed}
            toggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        )}
        
        <main className={`flex-1 ${isHomePage ? 'p-0' : (isDashboard ? 'p-6 lg:p-5 bg-[#FAF9F6]' : 'p-4 md:p-6 lg:p-5')} animate-fade-in max-w-[1600px] mx-auto w-full`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
