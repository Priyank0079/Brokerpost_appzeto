import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, LogOut, LayoutGrid, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingNavbar = ({ onLoginClick, onRegisterClick }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="h-20 px-6 bg-[#FAF9F6] border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto w-full h-full flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
              <span className="text-[27px] font-bold text-[#1e3a5f] tracking-tight">Brokers</span>
              <span className="text-[27px] font-bold text-[#c8962a] tracking-tight">Post</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-8 ml-auto mr-12">
            <a href="/#inventory" className="text-xs font-medium text-[#6e7d90] hover:text-[#c8962a] transition-colors">Browse Inventory</a>
            <a href="/#features" className="text-xs font-medium text-[#6e7d90] hover:text-[#c8962a] transition-colors">Features</a>
            <a href="/#how-it-works" className="text-xs font-medium text-[#6e7d90] hover:text-[#c8962a] transition-colors">How It Works</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
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
                    onClick={onRegisterClick}
                    className="px-5 py-2 rounded-xl bg-[#c0922e] text-xs font-bold text-white hover:bg-[#a67d26] transition-all shadow-sm shadow-[#c0922e]/20"
                  >
                    Join as Broker
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[#4A4A4A]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col p-6 gap-4">
              <a
                href="/#inventory"
                className="text-base font-medium text-[#4A4A4A] py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Inventory
              </a>
              <a
                href="/#features"
                className="text-base font-medium text-[#4A4A4A] py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                className="text-base font-medium text-[#4A4A4A] py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </a>

              <div className="h-[1px] bg-slate-100 my-2" />

              <div className="flex flex-col gap-3 sm:hidden">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-5 py-3 rounded-xl border border-slate-300 text-sm font-bold text-[#1A1A1A] flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-5 py-3 rounded-xl bg-[#c0922e] text-sm font-bold text-white flex items-center justify-center gap-2"
                    >
                      <LayoutGrid size={16} />
                      My Dashboard
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onRegisterClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-5 py-3 rounded-xl bg-[#c0922e] text-sm font-bold text-white"
                    >
                      Join as Broker
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default LandingNavbar;
