import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UsersRound, 
  Zap, 
  CreditCard, 
  Settings, 
  LogOut,
  X,
  PieChart,
  ArrowLeft,
  ArrowRight,
  Image,
  Layout
} from 'lucide-react';

import { useAuth } from '../../broker/context/AuthContext';

const menuItems = [
  { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/admin/landing', icon: <Layout size={20} />, label: 'Landing Page' },
  { path: '/admin/brokers', icon: <Users size={20} />, label: 'Brokers' },
  { path: '/admin/listings', icon: <Building2 size={20} />, label: 'Listings' },
  { path: '/admin/groups', icon: <UsersRound size={20} />, label: 'Groups' },
  { path: '/admin/subscriptions', icon: <Zap size={20} />, label: 'Subscriptions' },
  { path: '/admin/payments', icon: <CreditCard size={20} />, label: 'Payments' },
  { path: '/admin/reports', icon: <PieChart size={20} />, label: 'Reports' },
  { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
];

const AdminSidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden animate-fade-in"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-[#0F172A] text-white z-[50] transition-all duration-500 ease-in-out border-r border-white/5 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-72'}`}>
        
        {/* Logo Section */}
        <div className={`h-20 flex items-center justify-between px-6 border-b border-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
               <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center font-black text-xl shadow-lg shadow-primary-600/20 leading-none">B</div>
               <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tighter leading-none">BROKERS<span className="text-primary-400">POST</span></span>
                 <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mt-1">Admin Panel</span>
               </div>
            </div>
          )}

          <button 
             onClick={toggleCollapse}
             className={`hidden lg:flex p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-all ${isCollapsed ? 'bg-slate-800/50' : ''}`}
          >
             {isCollapsed ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </button>

          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white p-1">
             <X size={24} />
          </button>
        </div>


        {/* Navigation */}
        <nav className={`p-4 space-y-2 overflow-y-auto h-[calc(100%-160px)] custom-scrollbar ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : ''}
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-xl transition-all duration-300 group
                ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'px-4 py-3.5 w-full'}
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20 font-semibold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
              `}
            >
              <span className={`transition-colors duration-300`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="text-sm tracking-wide animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>}
              {!isCollapsed && item.label === 'Brokers' && (
                <span className="ml-auto bg-amber-500 text-[10px] text-slate-900 font-bold px-1.5 py-0.5 rounded-md animate-in zoom-in duration-300">12</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className={`absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-[#0F172A] ${isCollapsed ? 'flex justify-center' : ''}`}>
           <button 
              onClick={handleLogout}
              title={isCollapsed ? 'System Logout' : ''}
              className={`
                 flex items-center gap-3 transition-all duration-300 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl
                 ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'px-4 py-3.5 w-full'}
              `}
           >
              <LogOut size={20} />
              {!isCollapsed && <span className="text-sm font-semibold tracking-wide animate-in fade-in slide-in-from-left-2 duration-300">System Logout</span>}
           </button>
        </div>


      </aside>
    </>
  );
};

export default AdminSidebar;
