import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Globe, ArrowLeftRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileBottomNav = ({ matchCount = 0, onAuthRequired }) => {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();

  const tabs = [
    { label: 'Home', icon: <LayoutDashboard />, to: '/dashboard', match: ['/dashboard'] },
    { label: 'Group', icon: <Users />, to: '/groups', match: ['/groups'] },
    { label: 'Public', icon: <Globe />, to: '/', match: ['/'] },
    { label: 'Matches', icon: <ArrowLeftRight />, to: '/matches', match: ['/matches'], badge: matchCount },
    { label: 'Profile', icon: <User />, to: '/profile', match: ['/profile', '/settings'] },
  ];

  const handleClick = (e, tab) => {
    if (!user && tab.to !== '/') {
      e.preventDefault();
      if (onAuthRequired) {
        onAuthRequired();
      }
    }
  };

  return (
    <nav className="mob-bnav md:hidden" aria-label="Bottom Navigation">
      {tabs.map((tab) => {
        const isOn = tab.match.some(m => m === '/' ? path === '/' : path.startsWith(m));
        return (
          <Link
            key={tab.to}
            to={tab.to}
            onClick={(e) => handleClick(e, tab)}
            className={`mob-bn-i ${isOn ? 'on' : ''}`}
            aria-label={tab.label}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span className="absolute -top-0.5 left-[calc(50%+6px)] min-w-[15px] h-[15px] bg-[#c8962a] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1">
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
