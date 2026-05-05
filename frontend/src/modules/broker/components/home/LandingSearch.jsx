import React from 'react';
import { Search, ChevronDown, MapPin, Building2, LayoutGrid, Home } from 'lucide-react';

const LandingSearch = () => {
  const [activeTab, setActiveTab] = React.useState('residential');

  return (
    <section className="bg-[#0f172a] py-6 px-6 lg:px-20 overflow-hidden relative">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C59D3F]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1300px] mx-auto">
        {/* Header Text */}
        <div className="mb-4">
          <p className="text-[#C59D3F] text-[8px] font-bold uppercase tracking-[0.2em] mb-2">
            Verified Brokers Only Network
          </p>
          <h2 className="text-xl lg:text-2xl font-serif text-white mb-1">
            Find Properties Listed by Verified Brokers
          </h2>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            Browse residential and commercial inventory shared by our verified broker network. No login required to view listings.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-2xl max-w-4xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            <button 
              onClick={() => setActiveTab('residential')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-[10px] transition-all ${
                activeTab === 'residential' 
                ? 'bg-[#1a365d] text-white shadow-lg shadow-[#1a365d]/20' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Home size={14} />
              Residential
            </button>
            <button 
              onClick={() => setActiveTab('commercial')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-[10px] transition-all ${
                activeTab === 'commercial' 
                ? 'bg-[#1a365d] text-white shadow-lg shadow-[#1a365d]/20' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Building2 size={14} />
              Commercial
            </button>
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
            <div className="lg:col-span-8 relative">
              <input 
                type="text" 
                placeholder="Enter location or project name..."
                className="w-full h-9 pl-5 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F] transition-all"
              />
            </div>
            <div className="lg:col-span-4 relative">
              <select className="w-full h-9 pl-5 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F] appearance-none transition-all cursor-pointer">
                <option>All Cities</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-3">
            <div className="lg:col-span-4 relative">
              <select className="w-full h-9 pl-5 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F] appearance-none transition-all cursor-pointer">
                {activeTab === 'residential' ? (
                  <>
                    <option>All Residential Sections</option>
                    <option>Available for Sale</option>
                    <option>Available for Rental</option>
                    <option>Wanted on Purchase</option>
                    <option>Wanted on Rent</option>
                  </>
                ) : (
                  <>
                    <option>All Commercial Sections</option>
                    <option>Available for Sale</option>
                    <option>Available for Lease</option>
                    <option>Wanted on Purchase</option>
                    <option>Wanted on Lease</option>
                  </>
                )}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="lg:col-span-4 relative">
              <select className="w-full h-9 pl-5 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F] appearance-none transition-all cursor-pointer">
                <option>All Sub-types</option>
                <option>Apartments</option>
                <option>Low Rise Floors</option>
                <option>Kothi/Villas</option>
                <option>Plots</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="lg:col-span-4 flex gap-3">
              <button className="flex-1 h-9 flex items-center justify-center gap-2 rounded-2xl bg-[#C59D3F] text-white font-bold text-[10px] hover:bg-[#B08A35] transition-all shadow-lg shadow-[#C59D3F]/20">
                <Search size={16} />
                Search
              </button>
              <button className="px-4 h-9 rounded-2xl border-2 border-slate-200 text-slate-400 font-bold text-[10px] hover:bg-slate-50 transition-all">
                Clear
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 rounded-full bg-[#1a365d] text-white font-bold text-[9px] uppercase tracking-wider transition-all">
              {activeTab === 'residential' ? 'All Residential' : 'All Commercial'}
            </button>
            {(activeTab === 'residential' 
              ? ['Available for Sale', 'Available for Rental', 'Wanted on Purchase', 'Wanted on Rent']
              : ['Available for Sale', 'Available for Lease', 'Wanted on Purchase', 'Wanted on Lease']
            ).map((label) => (
              <button key={label} className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-400 font-bold text-[9px] uppercase tracking-wider hover:bg-slate-50 transition-all">
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSearch;
