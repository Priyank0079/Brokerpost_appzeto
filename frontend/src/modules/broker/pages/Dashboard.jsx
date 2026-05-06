import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, subtitle }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">{label}</p>
    <div className="space-y-1">
      <h3 className="text-2xl font-serif text-[#1e3a8a] leading-none">{value}</h3>
      <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
    </div>
  </div>
);

const BreakdownRow = ({ label, value }) => (
  <div className="group">
    <div className="flex items-center gap-4">
      <div className="flex flex-col min-w-[140px]">
        <span className="text-[11px] font-medium text-slate-600">{label}</span>
        <span className="text-[9px] text-slate-400">...</span>
      </div>
      <div className="flex-1 h-[2px] bg-[#f5f0e5] rounded-full relative top-1" />
      <span className="text-[13px] font-serif text-[#1e3a8a] font-bold w-4 text-right">{value}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-10">
      {/* Custom Header within Dashboard */}
      <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 mb-4 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 md:gap-6">
          <h1 className="text-base md:text-lg font-serif text-[#1e3a8a]">Dashboard</h1>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
            <input 
              type="text" 
              placeholder="Search listings..."
              className="w-[180px] lg:w-[240px] pl-9 pr-4 py-1.5 bg-[#fefce8] border border-[#eab308]/20 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/40 transition-all text-slate-600"
            />
          </div>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-3 md:px-4 py-1.5 rounded-full border border-slate-200 text-[#1e3a8a] text-[10px] md:text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={14} /> 
          <span className="hidden xs:inline">Public Site</span>
        </button>
      </div>

      <div className="space-y-1 px-2 md:px-0">
        <h2 className="text-xl md:text-2xl font-serif text-slate-900">Welcome back, {user?.name?.split(' ')[0] || 'Sakshi'}</h2>
        <p className="text-[10px] md:text-[11px] text-slate-400 font-medium tracking-tight">Your personal inventory & network overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 px-2 md:px-0">
        <StatCard label="MY LISTINGS" value="0" subtitle="25 slots remaining" />
        <StatCard label="NETWORK" value="45" subtitle="All brokers" />
        <StatCard label="AVAILABILITY" value="30" subtitle="Sale/Rent/Lease" />
        <StatCard label="WANTED" value="15" subtitle="Buy/Rent/Lease" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Recent Listings Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">My Recent Listings</h3>
              <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">View All</button>
            </div>
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#fdf8f3] rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">No listings yet</h4>
              <p className="text-xs text-slate-400 mt-1">Use "+ Add Listing" in each section</p>
            </div>
          </div>
        </div>

        {/* Breakdown Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-2.5 border-b border-slate-50">
              <h3 className="text-sm font-serif font-bold text-[#1e3a8a]">My Listing Breakdown</h3>
            </div>
            
            <div className="p-6 pt-4 space-y-2">
              <BreakdownRow label="Residential Available" value="0" />
              <BreakdownRow label="Residential Available" value="0" />
              <BreakdownRow label="Residential Wanted on" value="0" />
              <BreakdownRow label="Residential Wanted on" value="0" />
              <BreakdownRow label="Commercial Available" value="0" />
              <BreakdownRow label="Commercial Available" value="0" />
              <BreakdownRow label="Commercial Wanted on ..." value="0" />
              <BreakdownRow label="Commercial Wanted on ..." value="0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
