import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const statCards = [
    { label: 'MY LISTINGS', value: '0', sub: 'No limit (admin)', color: 'text-slate-900' },
    { label: 'NETWORK LISTINGS', value: '45', sub: 'All brokers', color: 'text-slate-900' },
    { label: 'AVAILABILITY', value: '30', sub: 'For sale / rent / lease', color: 'text-slate-900' },
    { label: 'REQUIREMENTS', value: '15', sub: 'Wanted buy / rent / lease', color: 'text-slate-900' },
  ];

  const breakdownItems = [
    { label: 'Residential Available', value: '0' },
    { label: 'Residential Available', value: '0' },
    { label: 'Residential Wanted on', value: '0' },
    { label: 'Residential Wanted on', value: '0' },
    { label: 'Commercial Available', value: '0' },
    { label: 'Commercial Available', value: '0' },
    { label: 'Commercial Wanted on...', value: '0' },
    { label: 'Commercial Wanted on...', value: '0' },
  ];

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-6 md:space-y-8 pb-10">
        {/* Custom Header */}
        <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 mb-4 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <h1 className="text-base md:text-lg font-serif text-black">Dashboard</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
              <input 
                type="text" 
                placeholder="Search listings..."
                className="w-[180px] lg:w-[240px] pl-9 pr-4 py-1.5 bg-[#fefce8] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/40 transition-all text-slate-600"
              />
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-3 md:px-4 py-1.5 rounded-full border border-slate-200 text-black text-[10px] md:text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={14} /> 
            <span className="hidden xs:inline">Public Site</span>
          </button>
        </div>

        {/* Welcome Section */}
        <div className="space-y-1 px-2 md:px-0">
          <h2 className="text-xl md:text-2xl font-serif text-black">Welcome back, Shyam</h2>
          <p className="text-[10px] md:text-[11px] text-slate-400 font-medium tracking-tight">Your personal Inventory & network overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-2 md:px-0">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-3">{card.label}</p>
              <div className="flex flex-col">
                <span className="text-2xl md:text-4xl font-serif text-[#1e3a8a] leading-none">{card.value}</span>
                <span className="text-[10px] md:text-[11px] text-slate-400 font-medium mt-1.5 md:mt-2 truncate">{card.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 px-2 md:px-0">
          {/* Recent Listings Card */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xs md:text-sm font-bold text-slate-900">My Recent Listings</h3>
              <button className="px-3 md:px-4 py-1 rounded-lg border border-slate-200 text-[10px] md:text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all">View All</button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-16 text-center px-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#faf9f6] rounded-xl flex items-center justify-center mb-4">
                <span className="text-xl md:text-2xl opacity-40">📋</span>
              </div>
              <h4 className="text-sm md:text-base font-bold text-slate-900">No listings yet</h4>
              <p className="text-[10px] md:text-[11px] text-slate-400 mt-1">Use "+ Add Listing" in each section</p>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-5 py-4 border-b border-slate-50">
              <h3 className="text-xs md:text-sm font-bold text-slate-900">My Listing Breakdown</h3>
            </div>
            <div className="p-5 md:p-6 space-y-3 md:space-y-4 flex-1">
              {breakdownItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="space-y-1 flex-1 mr-6 md:mr-8">
                    <p className="text-[10px] md:text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors leading-none truncate">{item.label}</p>
                    <div className="w-full h-[1.5px] bg-[#f5f0e5] rounded-full relative mt-1.5">
                       <div className="absolute left-0 top-0 h-full w-0 bg-[#C59D3F] transition-all" />
                    </div>
                  </div>
                  <span className="text-xs md:text-[12px] font-serif font-bold text-[#1e3a8a]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
