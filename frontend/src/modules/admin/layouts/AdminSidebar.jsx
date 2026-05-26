import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  Layout,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../broker/context/AuthContext';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuSections = [
    {
      title: 'OVERVIEW',
      items: [
        { icon: <LayoutDashboard size={16} />, label: 'Dashboard', path: '/admin' },
      ]
    },
    {
      title: 'ADMIN',
      items: [
        { icon: <Users size={16} />, label: 'Manage Brokers', path: '/admin/brokers' },
        { icon: <UsersRound size={16} />, label: 'Manage Groups', path: '/admin/manage-groups' },
        { icon: <Building2 size={16} />, label: 'All Listings', path: '/admin/listings' },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { icon: <Layout size={16} />, label: 'Landing Page', path: '/admin/landing' },
        { icon: <Zap size={16} />, label: 'Subscriptions', path: '/admin/subscriptions' },
        { icon: <CreditCard size={16} />, label: 'Payments', path: '/admin/payments' },
        { icon: <PieChart size={16} />, label: 'Reports', path: '/admin/reports' },
        { icon: <Settings size={16} />, label: 'Taxonomy', path: '/admin/categories' },
        { icon: <Settings size={16} />, label: 'Settings', path: '/admin/settings' },
      ]
    }
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-[#0F172A] w-64 z-50 transition-all flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Brand */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight font-['Times_New_Roman',_serif]"><span className="text-white">Brokers</span><span className="text-[#e8b84b]">Post</span></span>
          <span className="text-[9.5px] font-medium text-[#7d8688] uppercase tracking-[0.2em] mt-0">ADMIN CONSOLE</span>
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
            <h3 className="px-4 text-[9.5px] font-bold text-[#989da3] uppercase tracking-[0.2em] mb-0.5">{section.title}</h3>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-1.5 rounded-lg transition-all text-[12.5px] font-medium
                    ${isActive ? 'bg-[#c6952a] text-[#0F172A] shadow-lg' : 'text-[#c1c0c8] hover:text-white hover:bg-slate-800/50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
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
            <div className="w-8.5 h-8.5 rounded-full bg-[#c8962a] flex items-center justify-center text-[#0F172A] font-bold text-[11px] overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.name?.split(' ').map(n => n[0]).join('') || 'AD'
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-white truncate">{user?.name || 'Administrator'}</span>
              <span className="text-[9.5px] text-slate-200 font-medium tracking-tight uppercase">{user?.role || 'Admin'}</span>
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

export default AdminSidebar;
