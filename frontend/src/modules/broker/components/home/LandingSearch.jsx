import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, MapPin, Building2, Home as HomeIcon, LayoutGrid } from 'lucide-react';
import { normalizeSubType } from '../../utils/formatters';

const LandingSearch = ({ filters, onFilterChange, config }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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
      city: '',
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const [residentialSubTypes, setResidentialSubTypes] = useState([
    { value: 'APARTMENTS', label: 'Apartments' },
    { value: 'LOW_RISE_FLOORS', label: 'Low Rise Floors' },
    { value: 'KOTHI_VILLAS', label: 'Kothi/Villas' },
    { value: 'PLOTS', label: 'Plots' }
  ]);

  const [commercialSubTypes, setCommercialSubTypes] = useState([
    { value: 'OFFICE', label: 'Office Space' },
    { value: 'SHOP_SHOWROOM', label: 'Retail/Shops' },
    { value: 'SCO_PLOTS', label: 'SCO Plots' },
    { value: 'WAREHOUSE', label: 'Warehouse' }
  ]);

  useEffect(() => {
    import('../../services/categoryService').then(({ getCategories }) => {
      getCategories().then(res => {
        if (res.success) {
          const resSubTypes = new Set();
          const comSubTypes = new Set();
          res.data.forEach(cat => {
            if (cat.vertical === 'RESIDENTIAL') {
              (cat.subCategories || []).forEach(sub => resSubTypes.add(normalizeSubType(sub)));
            } else if (cat.vertical === 'COMMERCIAL') {
              (cat.subCategories || []).forEach(sub => comSubTypes.add(normalizeSubType(sub)));
            }
          });
          
          if (resSubTypes.size > 0) {
            setResidentialSubTypes(Array.from(resSubTypes).map(sub => ({ value: sub, label: sub })));
          }
          if (comSubTypes.size > 0) {
            setCommercialSubTypes(Array.from(comSubTypes).map(sub => ({ value: sub, label: sub })));
          }
        }
      });
    });
  }, []);

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

  const allSubTypes = Array.from(
    new Map(
      [...residentialSubTypes, ...commercialSubTypes].map(item => [item.value, item])
    ).values()
  );

  return (
    <>
      {/* ── MOBILE SEARCH ── */}
      <section className="md:hidden" id="inventory-mob" style={{ background: '#0d1520', padding: '0 12px 24px' }}>
        <div style={{ background: '#f5f0e8', borderRadius: 12, padding: 12 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #e0d8cc', marginBottom: 12 }}>
            <button onClick={() => {
                const updated = { ...localFilters, vertical: '', subType: '', intent: '' };
                setLocalFilters(updated);
                onFilterChange(updated);
              }}
              style={{ flex: 1, padding: '10px 0', fontSize: 11, fontWeight: 700, border: 'none', background: localFilters.vertical === '' ? '#1e3a5f' : '#fff', color: localFilters.vertical === '' ? '#fff' : '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              📁 All
            </button>
            <div style={{ width: 1, background: '#e0d8cc' }} />
            <button onClick={() => {
                const updated = { ...localFilters, vertical: 'RESIDENTIAL', subType: '', intent: '' };
                setLocalFilters(updated);
                onFilterChange(updated);
              }}
              style={{ flex: 1, padding: '10px 0', fontSize: 11, fontWeight: 700, border: 'none', background: localFilters.vertical === 'RESIDENTIAL' ? '#1e3a5f' : '#fff', color: localFilters.vertical === 'RESIDENTIAL' ? '#fff' : '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              🏡 Residential
            </button>
            <div style={{ width: 1, background: '#e0d8cc' }} />
            <button onClick={() => {
                const updated = { ...localFilters, vertical: 'COMMERCIAL', subType: '', intent: '' };
                setLocalFilters(updated);
                onFilterChange(updated);
              }}
              style={{ flex: 1, padding: '10px 0', fontSize: 11, fontWeight: 700, border: 'none', background: localFilters.vertical === 'COMMERCIAL' ? '#1e3a5f' : '#fff', color: localFilters.vertical === 'COMMERCIAL' ? '#fff' : '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              🏢 Commercial
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="text" placeholder="Search ID, location..." value={localFilters.location} onChange={(e) => setLocalFilters({...localFilters, location: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0d8cc', fontSize: 13, background: '#fff' }} />
            
            <div style={{ position: 'relative', width: '100%' }}>
              <select value={localFilters.city} onChange={(e) => setLocalFilters({...localFilters, city: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0d8cc', fontSize: 13, background: '#fff', appearance: 'none' }}>
                <option value="">All Cities</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Noida">Noida</option>
                <option value="Delhi">Delhi</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            <div style={{ position: 'relative', width: '100%' }}>
              <select value={localFilters.intent} onChange={(e) => setLocalFilters({...localFilters, intent: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0d8cc', fontSize: 13, background: '#fff', appearance: 'none' }}>
                <option value="">All Categories</option>
                {(localFilters.vertical === 'RESIDENTIAL' ? residentialIntents : localFilters.vertical === 'COMMERCIAL' ? commercialIntents : allIntents).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            <div style={{ position: 'relative', width: '100%' }}>
              <select value={localFilters.subType} onChange={(e) => setLocalFilters({...localFilters, subType: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0d8cc', fontSize: 13, background: '#fff', appearance: 'none' }}>
                <option value="">All Property Types</option>
                {(localFilters.vertical === 'RESIDENTIAL' ? residentialSubTypes : localFilters.vertical === 'COMMERCIAL' ? commercialSubTypes : allSubTypes).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={handleSearch} style={{ flex: 2, background: '#c8962a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 12, fontWeight: 700 }}>
                🔍 SEARCH
              </button>
              <button onClick={handleClear} style={{ flex: 1, background: 'transparent', border: '1px solid #c0b8a0', color: '#1e3a5f', borderRadius: 8, padding: '10px 0', fontSize: 12, fontWeight: 700 }}>
                CLEAR
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '12px 0 4px' }} className="mob-hscroll">
            <button onClick={() => { const updated = { ...localFilters, intent: '' }; setLocalFilters(updated); onFilterChange(updated); }}
              style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 20, fontSize: 10, fontWeight: 600, border: '1px solid #e0d8cc', background: localFilters.intent === '' ? '#1e3a5f' : '#fff', color: localFilters.intent === '' ? '#fff' : '#1e3a5f' }}>
              All Inventory
            </button>
            {(localFilters.vertical === 'RESIDENTIAL' ? residentialIntents : localFilters.vertical === 'COMMERCIAL' ? commercialIntents : allIntents).map((opt) => (
              <button key={opt.value} onClick={() => { const updated = { ...localFilters, intent: opt.value }; setLocalFilters(updated); onFilterChange(updated); }}
                style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 20, fontSize: 10, fontWeight: 600, border: '1px solid #e0d8cc', background: localFilters.intent === opt.value ? '#c8962a' : '#fff', color: localFilters.intent === opt.value ? '#fff' : '#1e3a5f' }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESKTOP SEARCH ── */}
      <div className="hidden md:block">
      <section id="inventory" className="relative pt-6 pb-5 px-6 lg:px-20 bg-[#0a1628] overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c8962a]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-[1300px] mx-auto relative z-10">
          <div className="mb-4">
            <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
              {config?.badge || 'Verified Brokers Only Network'}
            </p>
            <h2 className="text-2xl lg:text-3xl font-serif font-medium text-white mb-1 leading-tight tracking-tighter">
              {config?.title || 'Find Properties Listed by Verified Brokers'}
            </h2>
            <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
              {config?.subtitle || 'Browse residential and commercial inventory shared by our verified broker network. No login required to view listings.'}
            </p>
          </div>

          <div className="search-box mx-auto lg:mx-0">
            {/* Tabs */}
            <div className="flex w-full lg:w-auto lg:inline-flex border border-slate-200 rounded-lg overflow-hidden mb-4">
              <button
                onClick={() => {
                  const updated = { ...localFilters, vertical: '', subType: '', intent: '' };
                  setLocalFilters(updated);
                  onFilterChange(updated);
                }}
                className={`flex flex-1 lg:flex-none items-center justify-center gap-1 sm:gap-2 px-2 sm:px-5 py-3 font-bold text-[10px] sm:text-xs transition-all ${localFilters.vertical === ''
                  ? 'bg-[#1a365d] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <span>📁</span>
                All
              </button>
              <button
                onClick={() => {
                  const updated = { ...localFilters, vertical: 'RESIDENTIAL', subType: '', intent: '' };
                  setLocalFilters(updated);
                  onFilterChange(updated);
                }}
                className={`flex flex-1 lg:flex-none items-center justify-center gap-1 sm:gap-2 px-2 sm:px-5 py-3 font-bold text-[10px] sm:text-xs transition-all border-l border-slate-200 lg:border-none ${localFilters.vertical === 'RESIDENTIAL'
                  ? 'bg-[#1a365d] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <span>🏡</span>
                Residential
              </button>
              <button
                onClick={() => {
                  const updated = { ...localFilters, vertical: 'COMMERCIAL', subType: '', intent: '' };
                  setLocalFilters(updated);
                  onFilterChange(updated);
                }}
                className={`flex flex-1 lg:flex-none items-center justify-center gap-1 sm:gap-2 px-2 sm:px-5 py-3 font-bold text-[10px] sm:text-xs transition-all border-l border-slate-200 lg:border-none ${localFilters.vertical === 'COMMERCIAL'
                  ? 'bg-[#1a365d] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <span>🏢</span>
                Commercial
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-2 search-row">
              <div className="lg:col-span-8 relative">
                <input
                  type="text"
                  value={localFilters.location}
                  onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
                  placeholder="Search ID, location, or project..."
                  className="w-full placeholder:text-slate-400"
                />
              </div>
              <div className="lg:col-span-4 relative">
                <select
                  value={localFilters.city || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
                  className="w-full pl-3 pr-10 appearance-none cursor-pointer"
                >
                  <option value="">All Cities</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Noida">Noida</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Faridabad">Faridabad</option>
                  <option value="Greater Noida">Greater Noida</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mb-4 search-row">
              <div className="flex-1 relative">
                <select
                  value={localFilters.intent}
                  onChange={(e) => setLocalFilters({ ...localFilters, intent: e.target.value })}
                  className="w-full pl-3 pr-10 appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {(localFilters.vertical === 'RESIDENTIAL' ? residentialIntents :
                    localFilters.vertical === 'COMMERCIAL' ? commercialIntents : allIntents).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
              <div className="flex-1 relative">
                <select
                  value={localFilters.subType}
                  onChange={(e) => setLocalFilters({ ...localFilters, subType: e.target.value })}
                  className="w-full pl-3 pr-10 appearance-none cursor-pointer"
                >
                  <option value="">All Property Types</option>
                  {localFilters.vertical === 'RESIDENTIAL' && residentialSubTypes.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                  {localFilters.vertical === 'COMMERCIAL' && commercialSubTypes.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                  {localFilters.vertical === '' && allSubTypes.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleSearch}
                  className="px-4 h-[38px] flex items-center justify-center gap-2 rounded-lg bg-[#c8962a] text-white font-bold text-[11px] uppercase tracking-wider hover:bg-[#b08425] transition-all shadow-xl shadow-[#c8962a]/20 active:scale-95"
                >
                  <span>🔍</span>
                  Search
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 h-[38px] rounded-lg border border-slate-200 text-slate-400 font-bold text-[11px] uppercase tracking-wider hover:bg-slate-50 transition-all active:scale-95"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const updated = { ...localFilters, intent: '' };
                  setLocalFilters(updated);
                  onFilterChange(updated);
                }}
                className={`chip   ${localFilters.intent === ''
                  ? '!bg-[#1a365d] !text-white shadow-md'
                  : ''
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
                    className={`chip   ${localFilters.intent === opt.value
                      ? '!bg-[#c8962a] !border-[#c8962a] !text-white shadow-md'
                      : ''
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default LandingSearch;
