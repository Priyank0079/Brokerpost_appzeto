import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden relative">
      {!isHomePage && (
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      )}
      
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out ${!isHomePage ? (isCollapsed ? 'lg:ml-20' : 'lg:ml-72') : ''}`}>
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          isCollapsed={isCollapsed} 
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        
        <main className={`flex-1 p-4 md:p-6 lg:p-10 animate-fade-in max-w-[1600px] mx-auto w-full ${isHomePage ? 'px-0 md:px-0 lg:px-0' : ''}`}>
          {children}
        </main>

        <Footer />
      </div>

      {/* Premium Floating WhatsApp Button */}
      <a 
        href="https://wa.me/910000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] group"
      >
        <div className="relative">
          {/* Animated Pulse Ring */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping duration-[3000ms]" />
          <div className="absolute -inset-2 rounded-full bg-emerald-500/10 animate-pulse duration-[2000ms]" />
          
          <div className="relative flex items-center justify-center w-16 h-16 bg-emerald-500 text-white rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.5)] transform hover:scale-110 active:scale-95 transition-all duration-500 overflow-hidden border border-emerald-400">
             {/* Dynamic Gloss Effect */}
             <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 transform -skew-y-12" />
             <MessageCircle size={32} className="relative z-10 drop-shadow-lg" />
          </div>

          {/* Connect Label (Visible on Hover) */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-2xl border border-white/10">
             Direct Network Bridge
          </div>
        </div>
      </a>
    </div>
  );
};

export default Layout;
