import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import LoginModal from './LoginModal';

const LandingNavbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2 rounded-full border-2 border-[#1A1A1A] text-sm font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default LandingNavbar;
