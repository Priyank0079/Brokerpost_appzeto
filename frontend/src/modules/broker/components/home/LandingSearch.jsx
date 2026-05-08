import React, { useState } from 'react';
import { Search, ChevronDown, MapPin, Building2, Home as HomeIcon, LayoutGrid } from 'lucide-react';

const LandingSearch = ({ filters, onFilterChange }) => {
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
    <section id="inventory" className="bg-[#0f172a] py-6 px-6 lg:px-20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8962a]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1300px] mx-auto">
        <div className="mb-4">
          <p className="text-[#c8962a] text-[8px] font-bold uppercase tracking-[0.2em] mb-2">
            Verified Brokers Only Network
          </p>
          <h2 className="text-xl lg:text-2xl font-serif text-white mb-1">
            Find Properties Listed by Verified Brokers
          </h2>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            Browse residential and commercial inventory shared by our verified broker network. No login required to view listings.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 lg:p-6 shadow-2xl max-w-4xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            <button 
              onClick={() => setLocalFilters({ ...localFilters, vertical: '', subType: '', intent: '' })}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all ${
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
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all ${
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
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all ${
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
                className="w-full h-9 pl-5 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#c8962a]/20 focus:border-[#c8962a] transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="lg:col-span-4 relative">
              <select className="w-full h-9 pl-5 pr-10 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#c8962a]/20 focus:border-[#c8962a] appearance-none transition-all cursor-pointer">
                <option>Noida</option>
                <option>Gurgaon</option>
                <option>Delhi</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-3">
            <div className="lg:col-span-4 relative">
              <select 
                value={localFilters.intent}
                onChange={(e) => setLocalFilters({ ...localFilters, intent: e.target.value })}
                className="w-full h-9 pl-5 pr-10 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#c8962a]/20 focus:border-[#c8962a] appearance-none transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {(localFilters.vertical === 'RESIDENTIAL' ? residentialIntents : 
                  localFilters.vertical === 'COMMERCIAL' ? commercialIntents : allIntents).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="lg:col-span-4 relative">
              <select 
                value={localFilters.subType}
                onChange={(e) => setLocalFilters({ ...localFilters, subType: e.target.value })}
                className="w-full h-9 pl-5 pr-10 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#c8962a]/20 focus:border-[#c8962a] appearance-none transition-all cursor-pointer"
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
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="lg:col-span-4 flex gap-3">
              <button 
                onClick={handleSearch}
                className="flex-1 h-9 flex items-center justify-center gap-2 rounded-lg bg-[#c8962a] text-white font-bold text-[10px] uppercase tracking-wider hover:bg-[#b08425] transition-all shadow-lg shadow-[#c8962a]/20"
              >
                <Search size={16} />
                Search Inventory
              </button>
              <button 
                onClick={handleClear}
                className="px-4 h-9 rounded-lg border-2 border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50 transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <p className="w-full text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Quick Shortcuts:</p>
            <button 
              onClick={() => {
                const updated = { ...localFilters, intent: '' };
                setLocalFilters(updated);
                onFilterChange(updated);
              }}
              className={`px-3 py-1.5 rounded-full font-bold text-[9px] uppercase tracking-wider transition-all ${
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
                className={`px-3 py-1.5 rounded-full border font-bold text-[9px] uppercase tracking-wider transition-all ${
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
