import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutGrid, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingNavbar = ({ onLoginClick, onRegisterClick }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* ── MOBILE LANDING NAVBAR (light) ── */}
      <div className="md:hidden w-full shrink-0" style={{ height: 'calc(3.5rem + env(safe-area-inset-top))' }} />
      <nav className="md:hidden px-4 fixed top-0 left-0 right-0 z-50 flex items-center" style={{ height: 'calc(3.5rem + env(safe-area-inset-top))', paddingTop: 'env(safe-area-inset-top)', background: '#FAF9F6', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', flex: 1 }}>
          <img src="/logo (1).png" alt="BrokersPost" className="h-6 object-contain" />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <button onClick={() => navigate('/dashboard')} style={{ background: '#e8b84b', color: '#0d1520', border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Dashboard
            </button>
          ) : (
            <>
              <button onClick={onLoginClick} style={{ background: 'transparent', color: '#1a365d', border: '0.5px solid #1a365d', borderRadius: 7, padding: '5px 12px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Login
              </button>
              <button onClick={onRegisterClick} style={{ background: '#e8b84b', color: '#0d1520', border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Join Network
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── DESKTOP LANDING NAVBAR (unchanged) ── */}
      <div className="hidden md:block h-20 w-full shrink-0" />
      <nav className="hidden md:flex h-20 px-6 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-slate-200/60 fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto w-full h-full flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-1">
              <img src="/logo (1).png" alt="BrokersPost" className="h-8 object-contain" />
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-2 ml-auto mr-12">
            <a href="/#inventory" style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }} className="text-[#6e7d90] hover:text-[#c8962a] hover:bg-slate-50/80 transition-all">Browse Inventory</a>
            <a href="/#features" style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }} className="text-[#6e7d90] hover:text-[#c8962a] hover:bg-slate-50/80 transition-all">Features</a>
            <a href="/#how-it-works" style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }} className="text-[#6e7d90] hover:text-[#c8962a] hover:bg-slate-50/80 transition-all">How It Works</a>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <>
                  <button onClick={logout} className="px-5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#1A1A1A] hover:bg-slate-50 transition-all flex items-center gap-2">
                    <LogOut size={14} /> Logout
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="px-5 py-2 rounded-xl bg-[#c0922e] text-xs font-bold text-white hover:bg-[#a67d26] transition-all shadow-sm shadow-[#c0922e]/20 flex items-center gap-2">
                    <LayoutGrid size={14} /> My Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onLoginClick} className="px-3 py-2 rounded-lg border border-[#1a365d] text-xs font-bold tracking-tight text-[#1a365d] hover:bg-[#1e3a5f] hover:text-white transition-all">Login</button>
                  <button onClick={onRegisterClick} className="px-5 py-2.5 rounded-lg bg-[#c0922e] text-xs font-bold text-white hover:bg-[#a67d26] transition-all shadow-sm shadow-[#c0922e]/20">Join as Broker</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default LandingNavbar;
