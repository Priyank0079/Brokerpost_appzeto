import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <AdminNavbar 
           toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
           isCollapsed={isCollapsed}
           toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        
        <main className="flex-1 p-4 md:p-8 lg:p-10 animate-fade-in max-w-[1600px] mx-auto w-full">
          <div className="max-w-full">
            {children}
          </div>
        </main>


        <footer className="px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs font-medium">
          <p>© 2026 Brokerpost Administration Console. All rights reserved.</p>
          <div className="flex items-center gap-6">
             <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
