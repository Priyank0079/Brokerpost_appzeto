import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';


const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex relative">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>

        
        <main className="flex-1 p-4 md:p-8 lg:p-10 animate-fade-in max-w-[1600px] mx-auto w-full">
          <div className="max-w-full">
            {children}
          </div>
        </main>



        <footer className="px-8 py-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs font-medium">
          <p>© 2026 Brokerspost Administration Console. All rights reserved.</p>
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
