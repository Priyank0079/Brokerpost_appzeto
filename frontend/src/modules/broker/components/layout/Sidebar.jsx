import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Users,
  LogOut,
  Building2,
  Building,
  X,
  Bell,
  Target
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const Sidebar = ({ isOpen, toggleSidebar, stats }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    const fetchMatchesCount = async () => {
      try {
        const res = await api.get('/postings/smart-matches');
        if (res.success && res.data) {
          const total = res.data.reduce((sum, group) => sum + group.matches.length, 0);
          if (location.pathname === '/matches') {
            localStorage.setItem('lastSeenMatches', total);
            setMatchCount(0);
          } else {
            const lastSeen = parseInt(localStorage.getItem('lastSeenMatches')) || 0;
            setMatchCount(Math.max(0, total - lastSeen));
          }
        }
      } catch (e) {}
    };
    fetchMatchesCount();
    const int = setInterval(fetchMatchesCount, 60000); // Check every minute
    return () => clearInterval(int);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const b = stats?.breakdown || {
    residential: { sale: 0, rent: 0, purchase: 0, wantedRent: 0 },
    commercial: { sale: 0, lease: 0, purchase: 0, wantedLease: 0 }
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
        { icon: <div className="w-2 h-2 rounded-full bg-[#56606a]" />, label: 'Available for Sale', path: '/residential?intent=SALE', count: b.residential.sale },
        { icon: <div className="w-2 h-2 rounded-full bg-[#56606a]" />, label: 'Available for Rental', path: '/residential?intent=RENT', count: b.residential.rent },
        { icon: <div className="w-2 h-2 rounded-full bg-[#56606a]" />, label: 'Wanted on Purchase', path: '/residential?intent=PURCHASE', count: b.residential.purchase },
        { icon: <div className="w-2 h-2 rounded-full bg-[#56606a]" />, label: 'Wanted on Rent', path: '/residential?intent=WANTED_RENT', count: b.residential.wantedRent },
      ]
    },
    {
      title: 'COMMERCIAL',
      items: [
        { icon: <div className="w-2 h-2 rounded-full bg-[#56606a]" />, label: 'Available for Sale', path: '/commercial?intent=SALE', count: b.commercial.sale },
        { icon: <div className="w-2 h-2 rounded-full bg-[#56606a]" />, label: 'Available for Lease', path: '/commercial?intent=LEASE', count: b.commercial.lease },
        { icon: <div className="w-2 h-2 rounded-full bg-[#56606a]" />, label: 'Wanted on Purchase', path: '/commercial?intent=PURCHASE', count: b.commercial.purchase },
        { icon: <div className="w-2 h-2 rounded-full bg-[#56606a]" />, label: 'Wanted on Lease', path: '/commercial?intent=WANTED_LEASE', count: b.commercial.wantedLease },
      ]
    },
    {
      title: 'NETWORK',
      items: [
        { icon: <Users size={18} />, label: 'My Groups', path: '/groups' },
        { icon: <Target size={18} />, label: 'Your Matches', path: '/matches', count: matchCount > 0 ? matchCount : undefined },
      ]
    }
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-[#0F172A] w-64 z-50 transition-all flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Brand */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight font-['Times_New_Roman',_serif]"><span className="text-white">Brokers</span><span className="text-[#e8b84b]">Post</span></span>
          <span className="text-[9.5px] font-medium text-[#7d8688] uppercase tracking-[0.2em] mt-0">MY DASHBOARD</span>
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
              {section.items.map((item) => {
                const isActuallyActive = (location.pathname + location.search) === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sb-item justify-between ${isActuallyActive ? 'active' : ''}`}
                    onClick={() => {
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Dynamic active bullet dot color matching mockup */}
                      {section.title === 'RESIDENTIAL' || section.title === 'COMMERCIAL' ? (
                        <div className={`w-2 h-2 rounded-full transition-all ${isActuallyActive ? 'bg-[#c8962a]' : 'bg-[#56606a]'}`} />
                      ) : (
                        item.icon
                      )}
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#c8962a] text-white min-w-[18px] text-center shadow-sm shrink-0">
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <div 
          onClick={() => navigate('/profile')}
          title="View and Edit profile"
          className="flex items-center bg-slate-900/50 rounded-xl p-3 border border-slate-800/50 cursor-pointer hover:bg-slate-800/60 transition-all group"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8.5 h-8.5 rounded-full bg-[#c8962a] flex items-center justify-center text-[#0F172A] font-bold text-[11px] shrink-0 group-hover:scale-105 transition-all overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'SD'
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-white truncate group-hover:text-[#c8962a] transition-all">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.name || 'User')}
              </span>
              <span className="text-[9.5px] text-slate-400 font-medium">Broker</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
