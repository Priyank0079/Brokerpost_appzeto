import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Bell, 
  Search, 
  ChevronDown, 
  User, 
  X, 
  LayoutGrid, 
  PanelLeftClose, 
  PanelLeftOpen,
  Settings,
  LogOut,
  Shield,
  Building2,
  Globe,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLandingConfig } from '../../../../hooks/useLandingConfig';

const Navbar = ({ toggleSidebar, isCollapsed, toggleCollapse }) => {
  const { user, logout } = useAuth();
  const { config } = useLandingConfig();
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
    <nav className="h-16 px-6 lg:px-10 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
      {/* Left: Logo & Controls */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10 group-hover:scale-105 transition-transform">
            <Building2 size={20} />
          </div>
          <span className="text-base font-black text-[#1e3a5f] tracking-tighter hidden xs:block">
            BROKERS<span className="text-primary-600">POST</span>
          </span>
        </Link>

        {!isHomePage && (
          <div className="h-6 w-[1px] bg-slate-100 mx-1 hidden lg:block" />
        )}

        {!isHomePage && (
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={toggleSidebar}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={toggleCollapse}
              className="hidden lg:flex p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>
        )}

        {/* Dynamic Page Title */}
        {!isHomePage && (
          <div className="hidden md:flex items-center gap-3 ml-2 shrink-0">
             <div className="h-4 w-[2px] bg-primary-600/30 rounded-full" />
             <h1 className="text-lg font-serif text-[#1e3a5f] capitalize tracking-tight">
               {location.pathname.split('/').pop() || 'Dashboard'}
             </h1>
          </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-sm mx-4 relative hidden lg:block group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
        <input 
          type="text" 
          placeholder="Search listings..."
          className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-transparent focus:border-primary-100 focus:bg-white rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-600 transition-all outline-none shadow-sm"
        />
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className={`w-10 h-10 flex items-center justify-center rounded-xl relative transition-all ${showNotifications ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-2xl border border-slate-100 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <span className="font-black text-slate-900 text-xs tracking-tight uppercase">Recent Activity</span>
                  <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-white rounded-lg text-slate-400"><X size={14} /></button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50/50 cursor-pointer group">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-primary-600">New Requirement Post</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Someone matches your inventory in Gurgaon Sector 45.</p>
                      <p className="text-[9px] font-black text-slate-300 uppercase mt-2 tracking-widest">2h ago</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-5 w-[1px] bg-slate-100 mx-1" />

        {/* Profile Info & Dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-slate-900 leading-none mb-0.5">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[9px] text-primary-600 font-bold uppercase tracking-widest">{user?.role || 'Broker'}</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className={`flex items-center gap-2 p-1 rounded-xl transition-all group ${showProfile ? 'bg-primary-50 ring-1 ring-primary-100' : 'hover:bg-slate-50'}`}
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center">
                {user?.profileImage ? (
                  <img src={user.profileImage} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-600 font-black text-xs bg-primary-50">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                )}
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-2xl border border-slate-100 overflow-hidden py-2 z-50"
                >
                  <div className="px-5 py-4 border-b border-slate-50 mb-2 bg-slate-50/30">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Profile</p>
                      <p className="text-sm font-black text-slate-900 truncate mt-1">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium truncate">{user?.email}</p>
                  </div>
                  
                  <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all mx-2 rounded-xl">
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all mx-2 rounded-xl">
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>

                  <div className="h-[1px] bg-slate-50 my-2 mx-4" />

                  <button onClick={handleLogout} className="flex items-center gap-3 w-[calc(100%-16px)] px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all mx-2 rounded-xl">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

