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

          <span className="text-base font-black text-[#1e3a5f] tracking-tighter hidden xs:block">
            BROKERS<span className="text-primary-600">POST</span>
          </span>
        </Link>



        {!isHomePage && (
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={toggleSidebar}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>

          </div>
        )}

        {/* Dynamic Page Title */}
        {!isHomePage && (
          <div className="hidden md:flex items-center gap-3 -ml-16 shrink-0">

             <h1 className="text-xl font-light font-serif text-[#717b8e] capitalize tracking-tight">
               {location.pathname.split('/').pop() || 'Dashboard'}
             </h1>
             <div className="w-[300px] relative group">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">🔍</span>
               <input 
                 type="text" 
                 placeholder="Search listings..."
                 className="w-full pl-11 pr-4 py-3 bg-[#faf7f2] border border-[#ede8df] focus:border-primary-100 rounded-lg text-xs text-slate-700 placeholder:text-[#94827c] transition-all outline-none shadow-sm"
               />
             </div>
          </div>
        )}
      </div>

      <Link 
        to="/" 
        className="flex items-center gap-2 px-1.5 py-1 bg-[#fdfbf7] border border-[#ede8df] rounded-md text-xs font-semibold text-[#1e3a5f] hover:bg-[#faf7f2] transition-all shadow-sm"
      >
        <span>←</span>
        <span>Public Site</span>
      </Link>
    </nav>
  );
};

export default Navbar;

