import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, LogOut, LayoutGrid } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const LandingNavbar = () => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="h-20 px-6 bg-[#FAF9F6] border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto w-full h-full flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
              <span className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Brokers</span>
              <span className="text-3xl font-bold text-[#C59D3F] tracking-tight">Post</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-8 ml-auto mr-12">
            <a href="/#inventory" className="text-sm font-medium text-[#4A4A4A] hover:text-[#C59D3F] transition-colors">Browse Inventory</a>
            <a href="/#features" className="text-sm font-medium text-[#4A4A4A] hover:text-[#C59D3F] transition-colors">Features</a>
            <a href="/#how-it-works" className="text-sm font-medium text-[#4A4A4A] hover:text-[#C59D3F] transition-colors">How It Works</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button 
                  onClick={logout}
                  className="px-5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#1A1A1A] hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Logout
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2 rounded-xl bg-[#c0922e] text-xs font-bold text-white hover:bg-[#a67d26] transition-all shadow-sm shadow-[#c0922e]/20 flex items-center gap-2"
                >
                  <LayoutGrid size={14} />
                  My Dashboard
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#1A1A1A] hover:bg-slate-50 transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="px-5 py-2 rounded-xl bg-[#c0922e] text-xs font-bold text-white hover:bg-[#a67d26] transition-all shadow-sm shadow-[#c0922e]/20"
                >
                  Join as Broker
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />
    </>
  );
};

export default LandingNavbar;
