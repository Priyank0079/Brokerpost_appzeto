import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Users, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileDrawer = ({ isOpen, onClose, stats }) => {
  const { user } = useAuth();
  const location = useLocation();
  const b = stats?.breakdown || {
    residential: { sale: 0, rent: 0, purchase: 0, wantedRent: 0 },
    commercial: { sale: 0, lease: 0, purchase: 0, wantedLease: 0 }
  };

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`.toUpperCase()
    : user?.name?.slice(0, 2).toUpperCase() || 'BR';

  const sections = [
    {
      label: 'OVERVIEW',
      items: [
        { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> }
      ]
    },
    {
      label: 'RESIDENTIAL',
      items: [
        { label: 'Avail. for Sale', to: '/residential?intent=SALE', count: b.residential.sale },
        { label: 'Avail. for Rental', to: '/residential?intent=RENT', count: b.residential.rent },
        { label: 'Wanted Purchase', to: '/residential?intent=PURCHASE', count: b.residential.purchase },
        { label: 'Wanted Rent', to: '/residential?intent=WANTED_RENT', count: b.residential.wantedRent },
      ]
    },
    {
      label: 'COMMERCIAL',
      items: [
        { label: 'Avail. for Sale', to: '/commercial?intent=SALE', count: b.commercial.sale },
        { label: 'Avail. for Lease', to: '/commercial?intent=LEASE', count: b.commercial.lease },
        { label: 'Wanted Purchase', to: '/commercial?intent=PURCHASE', count: b.commercial.purchase },
        { label: 'Wanted Lease', to: '/commercial?intent=WANTED_LEASE', count: b.commercial.wantedLease },
      ]
    },
    {
      label: 'NETWORK',
      items: [
        { label: 'My Groups', to: '/groups', icon: <Users size={18} /> },
        { label: 'My Matches', to: '/matches', icon: <Target size={18} /> },
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="mob-drawer-overlay md:hidden" onClick={onClose}>
      <div className="mob-drawer" onClick={e => e.stopPropagation()}>
        {/* Brand */}
        <div className="mob-dr-top">
          <div className="mob-dr-brand">Brokers<b>Post</b></div>
          <div className="mob-dr-tag">My Dashboard</div>
        </div>

        {/* Sections */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sections.map((sec) => (
            <div key={sec.label} className="mob-dr-sec">
              <div className="mob-dr-lbl">{sec.label}</div>
              {sec.items.map((item) => {
                const isOn = (location.pathname + location.search) === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`mob-dr-item ${isOn ? 'on' : ''}`}
                  >
                    {item.icon ? (
                      <div className="mr-3 text-[#56606a]">{item.icon}</div>
                    ) : sec.label === 'NETWORK' || sec.label === 'OVERVIEW' ? null : (
                      <div className="mob-dr-dot" />
                    )}
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.count !== undefined && (
                      <span className="mob-dr-badge">
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="mob-dr-user" onClick={() => {}}>
          <div className="mob-dr-av">{initials}</div>
          <div>
            <div className="mob-dr-uname">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.name || 'Broker'}
            </div>
            <div className="mob-dr-role">Broker</div>
          </div>
        </div>
      </div>
      {/* Close area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', padding: 'calc(12px + env(safe-area-inset-top)) 10px 12px 10px' }} onClick={onClose}>
        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={16} color="#fff" />
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
