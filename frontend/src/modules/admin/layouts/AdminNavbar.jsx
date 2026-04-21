import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  User, 
  Settings, 
  ShieldCheck,
  Zap,
  Info,
  X,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


const AdminNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };


  const notifications = [
    { id: 1, title: 'New Broker Request', desc: 'Rajesh Malhotra applied for verification.', time: '2 mins ago', icon: <User className="text-blue-500" /> },
    { id: 2, title: 'Subscription Expiring', desc: 'Suresh Raina plan expires in 3 days.', time: '1 hour ago', icon: <Zap className="text-amber-500" /> },
    { id: 3, title: 'Spam Alert', desc: 'Listing #BP-1044 marked as spam.', time: '5 hours ago', icon: <ShieldCheck className="text-red-500" /> },
  ];

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-[30]">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
           <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl w-full max-w-md group focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary-500/5 transition-all">
          <Search size={18} className="text-slate-400 group-focus-within:text-primary-600" />
          <input 
            type="text" 
            placeholder="Search brokers, listings, transaction ID..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                 <h4 className="font-bold text-slate-900 leading-none">Notifications</h4>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest cursor-pointer hover:underline">Mark all read</span>
                    <button 
                       onClick={() => setShowNotifications(false)}
                       className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-all"
                    >
                       <X size={16} />
                    </button>
                 </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                 {notifications.map(n => (
                   <div key={n.id} className="p-4 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                         {n.icon}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900 leading-tight">{n.title}</p>
                         <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.desc}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{n.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                 <button className="text-xs font-bold text-slate-500 hover:text-primary-600 transition-all uppercase tracking-widest">View All Alerts</button>
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="relative">
          <button 
             onClick={() => setShowUserMenu(!showUserMenu)}
             className={`flex items-center gap-3 p-1.5 md:pl-1.5 md:pr-3 rounded-xl transition-all ${showUserMenu ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
          >
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md animate-fade-in">
              AD
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">System Admin</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">Superuser</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden py-2 animate-slide-up">

              <div className="px-4 py-3 border-b border-slate-50 mb-2 bg-slate-50/50">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Authority</p>
                 <p className="text-sm font-bold text-slate-900 leading-none mt-1">Superuser Console</p>
              </div>
              <div className="px-2 space-y-1">
                 <button 
                   onClick={() => setShowUserMenu(false)}
                   className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all"
                 >
                    <ShieldCheck size={18} className="text-slate-400 group-hover:text-primary-600" />
                    Security Logs
                 </button>
                 <Link 
                   to="/admin/profile"
                   onClick={() => setShowUserMenu(false)}
                   className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all"
                 >
                    <User size={18} className="text-slate-400 group-hover:text-primary-600" />
                    Edit Admin Profile
                 </Link>
                 <Link 
                   to="/admin/settings"
                   onClick={() => setShowUserMenu(false)}

                   className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all"
                 >
                    <Settings size={18} className="text-slate-400 group-hover:text-primary-600" />
                    Global Settings
                 </Link>
                 <button 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all"
                 >
                    <Info size={18} className="text-slate-400 group-hover:text-primary-600" />
                    Help & Support
                 </button>

                 <div className="h-[1px] bg-slate-50 my-2 mx-2" />
                 
                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                 >
                    <LogOut size={18} />
                    Logout Console
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default AdminNavbar;
