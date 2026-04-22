import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  ChevronDown, 
  User, 
  X, 
  LayoutTemplate, 
  PanelLeftClose, 
  PanelLeftOpen,
  Settings,
  LogOut,
  Shield,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ toggleSidebar, isCollapsed, toggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-16 px-6 lg:px-10 border-b border-slate-50 bg-white sticky top-0 z-30 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform">
            <Building2 size={24} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">BROKER<span className="text-primary-600">POST</span></span>
        </Link>

        {/* Sidebar Controls (Hidden on Home) */}
        {!isHomePage && (
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSidebar}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={toggleCollapse}
              className="hidden lg:flex p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search inventories, brokers or regions..."
          className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/5 text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all shadow-inner"
        />
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dashboard Link on Home Page */}
        {isHomePage && (
          <Link to="/dashboard">
            <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 mr-2">
               <LayoutTemplate size={14} />
               <span>Go to Dashboard</span>
            </button>
          </Link>
        )}
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className={`p-2 rounded-xl relative transition-all ${showNotifications ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <span className="font-black text-slate-900 tracking-tight">Activity Feed</span>
                <div className="flex items-center gap-2">
                   <button className="text-[9px] font-black text-primary-600 uppercase tracking-widest hover:underline">Clear</button>
                   <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-white rounded-lg text-slate-400"><X size={14} /></button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50/50 cursor-pointer group">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600">New Requirement Post</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Rajesh Kumar posted a new 3BHK requirement in Thane West.</p>
                    <p className="text-[10px] font-black text-slate-300 uppercase mt-2">15 mins ago</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-50">
                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">View All Archive</button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-slate-100 mx-1 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className={`flex items-center gap-3 p-1.5 rounded-xl transition-all group ${showProfile ? 'bg-primary-50 ring-1 ring-primary-100' : 'hover:bg-slate-50'}`}
          >
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold border border-primary-200 overflow-hidden shadow-sm">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={20} />}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none">{user?.name || 'Guest User'}</p>
              <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1 opacity-70">{user?.role || 'Visit Account'}</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="px-4 py-3 border-b border-slate-50 mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.email || 'broker@network.com'}</p>
               </div>
               
               <Link 
                  to="/profile" 
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all mx-2 rounded-xl"
               >
                  <User size={18} />
                  <span>My Profile</span>
               </Link>
               
               <Link 
                  to="/settings" 
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all mx-2 rounded-xl"
               >
                  <Settings size={18} />
                  <span>Account Settings</span>
               </Link>

               <div className="h-[1px] bg-slate-50 my-2 mx-4" />

               <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-[calc(100%-16px)] px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all mx-2 rounded-xl"
               >
                  <LogOut size={18} />
                  <span>Logout Portfolio</span>
               </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

