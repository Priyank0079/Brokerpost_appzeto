import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Building2, 
  Building,
  FileText, 
  ClipboardList, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  X,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }) => {

  const { logout } = useAuth();
  const location = useLocation();
  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Building size={20} />, label: 'Residential Property', path: '/post-property?type=RESIDENTIAL' },
    { icon: <Building2 size={20} />, label: 'Commercial Property', path: '/post-property?type=COMMERCIAL' },
    { icon: <FileText size={20} />, label: 'My Listings', path: '/my-listings' },
    { icon: <ClipboardList size={20} />, label: 'My Requirements', path: '/my-requirements' },
    { icon: <Users size={20} />, label: 'Groups', path: '/groups' },
    { icon: <CreditCard size={20} />, label: 'Subscription', path: '/subscription' },
  ];

  const bottomItems = [
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    { icon: <LogOut size={20} />, label: 'Logout', path: '/logout', className: 'text-red-400 hover:text-red-300 hover:bg-red-500/10' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full bg-sidebar z-50 transition-all duration-500 ease-in-out transform flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Brand */}
        <div className={`p-6 flex items-center justify-between ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                <Building2 className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Broker<span className="text-primary-500">post</span></span>
            </div>
          )}

          <button 
             onClick={toggleCollapse}
             className={`hidden lg:flex p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-all ${isCollapsed ? 'bg-slate-800/50' : ''}`}
          >
             {isCollapsed ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </button>

          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>


        {/* Menu */}
        <nav className={`flex-1 px-4 py-4 space-y-1 overflow-y-auto ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : ''}
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={({ isActive }) => {
                const isPropertyLink = item.path.includes('post-property');
                const isReallyActive = isPropertyLink 
                  ? location.pathname + location.search === item.path
                  : isActive;

                return `
                  flex items-center gap-3 rounded-xl transition-all duration-200
                  ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'px-4 py-3 w-full'}
                  ${isReallyActive 
                     ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                     : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
                `;
              }}
            >
              {item.icon}
              {!isCollapsed && <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Menu */}
        <div className={`p-4 border-t border-slate-800/50 space-y-1 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <NavLink
            to="/settings"
            title={isCollapsed ? 'Settings' : ''}
            className={({ isActive }) => `
              flex items-center gap-3 rounded-xl transition-all duration-200 text-sm font-medium
              ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'px-4 py-3 w-full'}
              ${isActive ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
            `}
          >
            <Settings size={20} />
            {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Settings</span>}
          </NavLink>
          
          <button
            onClick={() => {
              logout();
              window.innerWidth < 1024 && toggleSidebar();
            }}
            title={isCollapsed ? 'Logout' : ''}
            className={`
               flex items-center gap-3 transition-all duration-200 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl
               ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'px-4 py-3 w-full'}
            `}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Logout</span>}
          </button>
        </div>


      </aside>
    </>
  );
};

export default Sidebar;
