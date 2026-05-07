import React from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Users,
  LogOut,
  Building2,
  Building,
  X
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuSections = [
    {
      title: 'OVERVIEW',
      items: [
        { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
      ]
    },
    {
      title: 'RESIDENTIAL',
      items: [
        { icon: <div className="w-2 h-2 rounded-full bg-slate-400" />, label: 'Available for Sale', path: '/residential?intent=SALE', count: 0 },
        { icon: <div className="w-2 h-2 rounded-full bg-slate-400" />, label: 'Available for Rental', path: '/residential?intent=RENT', count: 0 },
        { icon: <div className="w-2 h-2 rounded-full bg-slate-400" />, label: 'Wanted on Purchase', path: '/residential?intent=PURCHASE', count: 0 },
        { icon: <div className="w-2 h-2 rounded-full bg-slate-400" />, label: 'Wanted on Rent', path: '/residential?intent=WANTED_RENT', count: 0 },
      ]
    },
    {
      title: 'COMMERCIAL',
      items: [
        { icon: <div className="w-2 h-2 rounded-full bg-slate-400" />, label: 'Available for Sale', path: '/commercial?intent=SALE', count: 0 },
        { icon: <div className="w-2 h-2 rounded-full bg-slate-400" />, label: 'Available for Lease', path: '/commercial?intent=LEASE', count: 0 },
        { icon: <div className="w-2 h-2 rounded-full bg-slate-400" />, label: 'Wanted on Purchase', path: '/commercial?intent=PURCHASE', count: 0 },
        { icon: <div className="w-2 h-2 rounded-full bg-slate-400" />, label: 'Wanted on Lease', path: '/commercial?intent=WANTED_LEASE', count: 0 },
      ]
    },
    {
      title: 'NETWORK',
      items: [
        { icon: <Users size={18} />, label: 'My Groups', path: '/groups' },
      ]
    }
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-[#0F172A] w-64 z-50 transition-all flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Brand */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight font-['Times_New_Roman',_serif]"><span className="text-[#1e3a5f]">Brokers</span><span className="text-[#c8962a]">Post</span></span>
          <span className="text-[9.5px] font-bold text-slate-200 uppercase tracking-[0.2em] mt-1">MY DASHBOARD</span>
        </div>
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-1 space-y-4 overflow-y-auto scrollbar-hide">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-0.5">
            <h3 className="px-4 text-[9.5px] font-bold text-slate-200 uppercase tracking-widest mb-0.5">{section.title}</h3>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={() => {
                    const isActuallyActive = (location.pathname + location.search) === item.path;
                    return `
                      flex items-center justify-between px-4 py-1.5 rounded-lg transition-all text-[12.5px] font-medium
                      ${isActuallyActive ? 'bg-[#c6952a] text-[#0F172A] shadow-lg' : 'text-slate-200 hover:text-white hover:bg-slate-800/50'}
                    `;
                  }}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full bg-[#c8962a] text-[#0F172A] min-w-[18px] text-center">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3 border border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-full bg-[#c8962a] flex items-center justify-center text-[#0F172A] font-bold text-[11px]">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'SD'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-white truncate">{user?.name || 'Sakshi Dwivedi'}</span>
              <span className="text-[9.5px] text-slate-200 font-medium">Broker</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
