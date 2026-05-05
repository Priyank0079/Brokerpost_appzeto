import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const LandingNavbar = () => {
  return (
    <nav className="h-20 px-6 bg-[#FAF9F6] border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto w-full h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            <span className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Brokers</span>
            <span className="text-3xl font-bold text-[#C59D3F] tracking-tight">Post</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8 ml-auto mr-12">
          <Link to="/inventory" className="text-sm font-medium text-[#4A4A4A] hover:text-[#C59D3F] transition-colors">Browse Inventory</Link>
          <Link to="/features" className="text-sm font-medium text-[#4A4A4A] hover:text-[#C59D3F] transition-colors">Features</Link>
          <Link to="/how-it-works" className="text-sm font-medium text-[#4A4A4A] hover:text-[#C59D3F] transition-colors">How It Works</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="px-6 py-2 rounded-full border-2 border-[#1A1A1A] text-sm font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
