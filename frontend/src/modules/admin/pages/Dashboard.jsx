import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../broker/services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await api.get('/postings/stats');
        
        if (statsRes && statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        } else {
          setStats(null);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-[#c0922e]" size={40} />
        <p className="text-sm font-bold text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-500">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Connection Error</h2>
          <p className="text-sm text-slate-500 mt-2">Failed to load statistics.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-[#c0922e] text-white rounded-lg font-bold text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // --- Calculations for "Listings by category" ---
  const breakdown = stats.breakdown || { residential: {}, commercial: {} };
  const resiSale = breakdown.residential.sale || 0;
  const resiRent = breakdown.residential.rent || 0;
  const resiWant = (breakdown.residential.purchase || 0) + (breakdown.residential.wantedRent || 0);
  const comSale = breakdown.commercial.sale || 0;
  const comLease = breakdown.commercial.lease || 0;
  const comWant = (breakdown.commercial.purchase || 0) + (breakdown.commercial.wantedLease || 0);

  const totalListed = resiSale + resiRent + resiWant + comSale + comLease + comWant;

  const categories = [
    { name: 'Resi Sale', count: resiSale, color: '#1e3a8a', dot: '#1e3a8a' },
    { name: 'Resi Rent', count: resiRent, color: '#3b82f6', dot: '#3b82f6' },
    { name: 'Resi Want', count: resiWant, color: '#93c5fd', dot: '#93c5fd' },
    { name: 'Com Sale', count: comSale, color: '#d97706', dot: '#eab308' },
    { name: 'Com Lease', count: comLease, color: '#b45309', dot: '#d97706' },
    { name: 'Com Want', count: comWant, color: '#78350f', dot: '#92400e' },
  ];

  // --- Colors for Cities ---
  const cityColors = {
    'Gurugram': '#eab308',
    'Noida': '#1e3a8a',
    'Delhi': '#15803d',
    'Faridabad': '#7e22ce'
  };

  const getCityColor = (city, index) => {
    if (cityColors[city]) return cityColors[city];
    const fallbackColors = ['#eab308', '#1e3a8a', '#15803d', '#7e22ce', '#db2777', '#0ea5e9'];
    return fallbackColors[index % fallbackColors.length];
  };

  // Safe fetch for dynamic admin data
  const brokersByCity = stats.brokersByCity || [];
  const maxBrokers = Math.max(...brokersByCity.map(b => b.count), 1);

  const listingsByCity = stats.listingsByCity || [];
  const maxListings = Math.max(...listingsByCity.map(l => l.count), 1);

  const monthWiseData = stats.monthWiseListings || [];
  
  // Build month-wise chart data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    last6Months.push({ month: d.getMonth() + 1, year: d.getFullYear(), label: monthNames[d.getMonth()] });
  }

  const getMonthCount = (month, year, vertical, intentType) => {
    let count = 0;
    monthWiseData.forEach(item => {
      if (item.month === month && item.year === year && item.vertical === vertical) {
        if (intentType === 'SALE' && item.intent === 'SALE') count += item.count;
        if (intentType === 'RENT' && (item.intent === 'RENT' || item.intent === 'LEASE')) count += item.count;
        if (intentType === 'WANT' && ['PURCHASE', 'WANTED_RENT', 'WANTED_LEASE'].includes(item.intent)) count += item.count;
      }
    });
    return count;
  };

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-6 md:py-8 lg:py-10 bg-[#faf9f6] min-h-screen font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Welcome back, Admin
        </h1>
        <p className="text-[13px] text-slate-500 mt-1 tracking-tight">Platform-wide activity & system health overview</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-[#ede8df] shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">NETWORK LISTINGS</p>
          <p className="text-3xl font-serif text-[#1e3a8a]">{stats.totalListings || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">All brokers combined</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-[#ede8df] shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">ACTIVE BROKERS</p>
          <p className="text-3xl font-serif text-[#1e3a8a]">{stats.totalBrokers || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Verified professionals</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-[#ede8df] shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">AVAILABILITY</p>
          <p className="text-3xl font-serif text-[#1e3a8a]">{stats.availabilityCount || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">For sale / rent / lease</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-[#ede8df] shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">REQUIREMENTS</p>
          <p className="text-3xl font-serif text-[#1e3a8a]">{stats.requirementCount || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Wanted buy / rent / lease</p>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Listings by Category (Left 7 cols) */}
        <div className="bg-white rounded-xl border border-[#ede8df] shadow-sm lg:col-span-7 overflow-hidden flex flex-col">
          <div className="p-5 pb-3 border-b border-[#ede8df] flex items-center justify-between">
            <h3 className="text-[14px] font-medium text-slate-700">Listings by category</h3>
            <span className="text-[10px] text-slate-400">Count • % share</span>
          </div>
          
          <div className="p-5 pt-3">
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#1e3a8a]"></div>
                <span>Residential</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#eab308]"></div>
                <span>Commercial</span>
              </div>
            </div>

            {/* Table */}
            <div className="w-full">
              <div className="flex text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-3 px-2">
                <div className="w-1/3">CATEGORY</div>
                <div className="w-1/6 text-center">COUNT</div>
                <div className="w-1/6 text-center">SHARE</div>
                <div className="w-1/3 text-right">BAR</div>
              </div>
              
              <div className="space-y-3">
                {categories.map((cat, idx) => {
                  const share = totalListed > 0 ? Math.round((cat.count / totalListed) * 100) : 0;
                  return (
                    <div key={idx} className="flex items-center text-[13px] px-2">
                      <div className="w-1/3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.dot }}></div>
                        <span className="font-medium text-slate-700">{cat.name}</span>
                      </div>
                      <div className="w-1/6 text-center text-slate-800">{cat.count}</div>
                      <div className="w-1/6 text-center text-slate-500">{share}%</div>
                      <div className="w-1/3 flex items-center h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${share}%`, backgroundColor: cat.color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Brokers by City (Right 5 cols) */}
        <div className="bg-white rounded-xl border border-[#ede8df] shadow-sm lg:col-span-5 overflow-hidden flex flex-col">
          <div className="p-5 pb-3 border-b border-[#ede8df] flex items-center justify-between">
            <h3 className="text-[14px] font-medium text-slate-700">Brokers by city</h3>
            <span className="text-[10px] text-slate-400">Active only</span>
          </div>
          
          <div className="p-5 pt-6 space-y-6">
            {brokersByCity.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No active brokers found</p>
            ) : (
              brokersByCity.map((item, idx) => {
                const width = Math.max(5, (item.count / maxBrokers) * 100);
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-20 text-[13px] font-medium text-slate-700 truncate">{item.city}</div>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex items-center">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${width}%`, backgroundColor: getCityColor(item.city, idx) }}
                      ></div>
                    </div>
                    <div className="w-4 text-right text-[12px] text-slate-400">{item.count}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* Month-wise Listings (Left 7 cols) */}
        <div className="bg-white rounded-xl border border-[#ede8df] shadow-sm lg:col-span-7 overflow-hidden flex flex-col">
          <div className="p-5 pb-3 border-b border-[#ede8df] flex items-center justify-between">
            <h3 className="text-[14px] font-medium text-slate-700">Month-wise listings</h3>
            <span className="text-[10px] text-slate-400">Last 6 months - by category</span>
          </div>
          
          <div className="p-5 pt-3">
            {/* Legend */}
            <div className="flex items-center gap-4 mb-8 text-[11px] text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
              {categories.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.dot }}></div>
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>

            {/* Bar Chart (Custom CSS) */}
            <div className="relative h-[140px] flex items-end justify-between px-4">
              {last6Months.map((m, idx) => {
                const rS = getMonthCount(m.month, m.year, 'RESIDENTIAL', 'SALE');
                const rR = getMonthCount(m.month, m.year, 'RESIDENTIAL', 'RENT');
                const rW = getMonthCount(m.month, m.year, 'RESIDENTIAL', 'WANT');
                const cS = getMonthCount(m.month, m.year, 'COMMERCIAL', 'SALE');
                const cL = getMonthCount(m.month, m.year, 'COMMERCIAL', 'RENT'); // map to RENT internally
                const cW = getMonthCount(m.month, m.year, 'COMMERCIAL', 'WANT');

                // Determine max total across months to scale height
                const allTotals = last6Months.map(mx => 
                  getMonthCount(mx.month, mx.year, 'RESIDENTIAL', 'SALE') +
                  getMonthCount(mx.month, mx.year, 'RESIDENTIAL', 'RENT') +
                  getMonthCount(mx.month, mx.year, 'RESIDENTIAL', 'WANT') +
                  getMonthCount(mx.month, mx.year, 'COMMERCIAL', 'SALE') +
                  getMonthCount(mx.month, mx.year, 'COMMERCIAL', 'RENT') +
                  getMonthCount(mx.month, mx.year, 'COMMERCIAL', 'WANT')
                );
                const maxMonthTotal = Math.max(...allTotals, 1);

                return (
                  <div key={idx} className="flex flex-col items-center w-full">
                    {/* Bars Container */}
                    <div className="flex gap-1 items-end h-[100px] w-full justify-center relative">
                      {/* Grey placeholder bar for empty data if you want, but reference shows empty is blank */}
                      <div className="w-2 bg-[#1e3a8a] rounded-t-sm transition-all" style={{ height: `${(rS / maxMonthTotal) * 100}%` }}></div>
                      <div className="w-2 bg-[#3b82f6] rounded-t-sm transition-all" style={{ height: `${(rR / maxMonthTotal) * 100}%` }}></div>
                      <div className="w-2 bg-[#93c5fd] rounded-t-sm transition-all" style={{ height: `${(rW / maxMonthTotal) * 100}%` }}></div>
                      <div className="w-2 bg-[#eab308] rounded-t-sm transition-all" style={{ height: `${(cS / maxMonthTotal) * 100}%` }}></div>
                      <div className="w-2 bg-[#d97706] rounded-t-sm transition-all" style={{ height: `${(cL / maxMonthTotal) * 100}%` }}></div>
                      <div className="w-2 bg-[#92400e] rounded-t-sm transition-all" style={{ height: `${(cW / maxMonthTotal) * 100}%` }}></div>
                    </div>
                    {/* Label */}
                    <span className="text-[10px] text-slate-400 mt-3">{m.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Listings by City (Right 5 cols) */}
        <div className="bg-white rounded-xl border border-[#ede8df] shadow-sm lg:col-span-5 overflow-hidden flex flex-col">
          <div className="p-5 pb-3 border-b border-[#ede8df] flex items-center justify-between">
            <h3 className="text-[14px] font-medium text-slate-700">Listings by city</h3>
            <span className="text-[10px] text-slate-400">All categories combined</span>
          </div>
          
          <div className="p-5 pt-6 space-y-6">
            {listingsByCity.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No active listings found</p>
            ) : (
              listingsByCity.map((item, idx) => {
                const width = Math.max(5, (item.count / maxListings) * 100);
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-20 text-[13px] font-medium text-slate-700 truncate">{item.city}</div>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex items-center">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${width}%`, backgroundColor: getCityColor(item.city, idx) }}
                      ></div>
                    </div>
                    <div className="w-4 text-right text-[12px] text-slate-400">{item.count}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
