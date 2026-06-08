import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import MobileDrawer from './MobileDrawer';

import { useLandingConfig } from '../../../../hooks/useLandingConfig';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  const { config } = useLandingConfig();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { getPostingStats } = await import('../../services/postingService');
        const res = await getPostingStats();
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch sidebar stats', err);
      }
    };
    if (!isHomePage) fetchStats();

    window.addEventListener('listing-updated', fetchStats);
    return () => window.removeEventListener('listing-updated', fetchStats);
  }, [isHomePage, location.pathname]);

  // Fetch match count for mobile badge
  useEffect(() => {
    if (isHomePage || !user) return;
    const fetchMatches = async () => {
      try {
        const res = await api.get('/postings/smart-matches');
        if (res.success && res.data) {
          const total = res.data.reduce((s, g) => s + g.matches.length, 0);
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
    fetchMatches();
  }, [isHomePage, user, location.pathname]);

  return (
    <>
      <div className="min-h-screen bg-background flex overflow-x-hidden relative">
        {/* ── Desktop Sidebar ── */}
      {!isHomePage && (
        <>
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            isCollapsed={isCollapsed}
            toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            stats={stats}
          />
        </>
      )}

      {/* ── Mobile Drawer (slide-over) ── */}
      {!isHomePage && (
        <MobileDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          stats={stats}
        />
      )}

      {/* ── Main content ── */}
      <div className={`flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-500 ease-in-out ${!isHomePage ? (isCollapsed ? 'lg:ml-20' : 'lg:ml-64') : ''}`}>

        {/* Desktop Navbar (hidden on mobile) */}
        {!isHomePage && (
          <div className="hidden md:block">
            <Navbar
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              isCollapsed={isCollapsed}
              toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />
          </div>
        )}

        {/* Mobile Top Bar (hidden on desktop) */}
        {!isHomePage && (
          <div className="mob-topbar md:hidden" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#1e3a5f' }}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1e3a5f', fontFamily: "'Playfair Display', serif" }}>
                Brokers<span style={{ color: '#c8962a' }}>Post</span>
              </div>
            </div>
          </div>
        )}

        <main className={`flex-1 ${isHomePage ? 'p-0' : (isDashboard ? 'p-0 md:p-6 lg:p-5 bg-[#FAF9F6] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-6' : 'p-0 md:p-6 lg:p-5 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-6')} animate-fade-in max-w-[1600px] mx-auto w-full`}>
          {children}
        </main>
      </div>

      </div>

      {/* ── Mobile Bottom Navigation (fixed) ── */}
      <MobileBottomNav matchCount={matchCount} />
    </>
  );
};

export default Layout;
