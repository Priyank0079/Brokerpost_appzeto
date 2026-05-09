import React, { useState } from 'react';
import { Search, ChevronDown, MapPin, Building2, Home as HomeIcon, LayoutGrid } from 'lucide-react';

const LandingSearch = ({ filters, onFilterChange, config }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearch = () => {
    onFilterChange(localFilters);
    const grid = document.getElementById('inventory-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    const cleared = {
      vertical: '',
      location: '',
      intent: '',
      subType: '',
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const residentialSubTypes = [
    { value: 'APARTMENTS', label: 'Apartments' },
    { value: 'LOW_RISE_FLOORS', label: 'Low Rise Floors' },
    { value: 'KOTHI_VILLAS', label: 'Kothi/Villas' },
    { value: 'PLOTS', label: 'Plots' }
  ];

  const commercialSubTypes = [
    { value: 'OFFICE', label: 'Office Space' },
    { value: 'SHOP_SHOWROOM', label: 'Retail/Shops' },
    { value: 'SCO_PLOTS', label: 'SCO Plots' },
    { value: 'WAREHOUSE', label: 'Warehouse' }
  ];

  const residentialIntents = [
    { value: 'SALE', label: 'Available for Sale' },
    { value: 'RENT', label: 'Available for Rental' },
    { value: 'PURCHASE', label: 'Wanted on Purchase' },
    { value: 'WANTED_RENT', label: 'Wanted on Rent' }
  ];

  const commercialIntents = [
    { value: 'SALE', label: 'Available for Sale' },
    { value: 'LEASE', label: 'Available for Lease' },
    { value: 'PURCHASE', label: 'Wanted on Purchase' },
    { value: 'WANTED_LEASE', label: 'Wanted on Lease' }
  ];

  const allIntents = [
    { value: 'SALE', label: 'Available for Sale' },
    { value: 'RENT', label: 'Available for Rental/Lease' },
    { value: 'PURCHASE', label: 'Wanted on Purchase' },
    { value: 'WANTED_RENT', label: 'Wanted on Rent/Lease' }
  ];

  return (
    <section id="inventory" className="relative pt-12 pb-20 px-6 lg:px-20 bg-[#0a1628] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c8962a]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-[1300px] mx-auto relative z-10">
        <div className="mb-8">
          <p className="text-[#c8962a] text-[8px] font-black uppercase tracking-[0.4em] mb-2">
            {config?.badge || 'Verified Brokers Only Network'}
          </p>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-3 leading-tight tracking-tight">
            {config?.title || 'Find Properties Listed by Verified Brokers'}
          </h2>
          <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
            {config?.subtitle || 'Browse residential and commercial inventory shared by our verified broker network. No login required to view listings.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-7 lg:p-10 shadow-2xl max-w-5xl border border-white/5">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setLocalFilters({ ...localFilters, vertical: '', subType: '', intent: '' })}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all ${
                localFilters.vertical === '' 
                ? 'bg-[#1a365d] text-white shadow-lg shadow-[#1a365d]/20' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <LayoutGrid size={14} />
              All
            </button>
            <button 
              onClick={() => setLocalFilters({ ...localFilters, vertical: 'RESIDENTIAL', subType: '', intent: '' })}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all ${
                localFilters.vertical === 'RESIDENTIAL' 
                ? 'bg-[#1a365d] text-white shadow-lg shadow-[#1a365d]/20' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <HomeIcon size={14} />
              Residential
            </button>
            <button 
              onClick={() => setLocalFilters({ ...localFilters, vertical: 'COMMERCIAL', subType: '', intent: '' })}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all ${
                localFilters.vertical === 'COMMERCIAL' 
                ? 'bg-[#1a365d] text-white shadow-lg shadow-[#1a365d]/20' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Building2 size={14} />
              Commercial
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
            <div className="lg:col-span-8 relative">
              <input 
                type="text" 
                value={localFilters.location}
                onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
                placeholder="Search by location, sector, or project name..."
                className="w-full h-12 pl-6 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a] transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="lg:col-span-4 relative">
              <select className="w-full h-12 pl-6 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a] appearance-none transition-all cursor-pointer">
                <option>Noida</option>
                <option>Gurgaon</option>
                <option>Delhi</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
            <div className="lg:col-span-4 relative">
              <select 
                value={localFilters.intent}
                onChange={(e) => setLocalFilters({ ...localFilters, intent: e.target.value })}
                className="w-full h-12 pl-6 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a] appearance-none transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {(localFilters.vertical === 'RESIDENTIAL' ? residentialIntents : 
                  localFilters.vertical === 'COMMERCIAL' ? commercialIntents : allIntents).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
            <div className="lg:col-span-4 relative">
              <select 
                value={localFilters.subType}
                onChange={(e) => setLocalFilters({ ...localFilters, subType: e.target.value })}
                className="w-full h-12 pl-6 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a] appearance-none transition-all cursor-pointer"
              >
                <option value="">All Property Types</option>
                {localFilters.vertical === 'RESIDENTIAL' && residentialSubTypes.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                {localFilters.vertical === 'COMMERCIAL' && commercialSubTypes.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                {localFilters.vertical === '' && [...residentialSubTypes, ...commercialSubTypes].map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
            <div className="lg:col-span-4 flex gap-3">
              <button 
                onClick={handleSearch}
                className="flex-1 h-12 flex items-center justify-center gap-3 rounded-xl bg-[#c8962a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#b08425] transition-all shadow-xl shadow-[#c8962a]/20 active:scale-95"
              >
                <Search size={20} />
                Search Inventory
              </button>
              <button 
                onClick={handleClear}
                className="px-6 h-12 rounded-xl border-2 border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all active:scale-95"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Quick Shortcuts:</p>
            <button 
              onClick={() => {
                const updated = { ...localFilters, intent: '' };
                setLocalFilters(updated);
                onFilterChange(updated);
              }}
              className={`px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all ${
                localFilters.intent === '' 
                ? 'bg-[#1a365d] text-white shadow-md' 
                : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-slate-300'
              }`}
            >
              All {localFilters.vertical === 'RESIDENTIAL' ? 'Residential' : localFilters.vertical === 'COMMERCIAL' ? 'Commercial' : 'Inventory'}
            </button>
            {(localFilters.vertical === 'RESIDENTIAL' ? residentialIntents : 
              localFilters.vertical === 'COMMERCIAL' ? commercialIntents : allIntents).map((opt) => (
              <button 
                key={opt.value} 
                onClick={() => {
                  const updated = { ...localFilters, intent: opt.value };
                  setLocalFilters(updated);
                  onFilterChange(updated);
                }}
                className={`px-4 py-2 rounded-full border font-bold text-[10px] uppercase tracking-wider transition-all ${
                  localFilters.intent === opt.value
                  ? 'bg-[#c8962a] border-[#c8962a] text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSearch;
