import React, { useState, useEffect } from 'react';
import { MapPin, Grid, Table, ChevronLeft, ChevronRight, Loader2, Home, Play } from 'lucide-react';
import { getPostings } from '../../services/postingService';
import { useAuth } from '../../context/AuthContext';
import ListingDetailModal from './ListingDetailModal';

const InventoryGrid = ({ filters, onLoginRequired, config }) => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState('grid');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const limit = 8;

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Merge base filters with pagination
      const response = await getPostings({ ...filters, page, limit });
      if (response.success) {
        setListings(response.data);
        setTotal(response.total);
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [page, filters]);

  const totalPages = Math.ceil(total / limit);

  return (
    <section id="inventory-grid" className="bg-pink-50/30 pt-12 pb-24 px-6 lg:px-20 scroll-mt-10">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-1">
             <p className="text-[#c8962a] text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                {config?.badge || 'Live Inventory'}
             </p>
            <h2 className="text-3xl font-serif font-black text-[#0f172a] tracking-tight">
                {config?.title || 'Active Listings'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c8962a] animate-pulse"></span>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {total} Real-time {filters.vertical ? filters.vertical.toLowerCase() : 'inventory'} opportunities
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 ml-3 uppercase tracking-widest">Layout:</span>
            <button 
              onClick={() => setView('grid')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                view === 'grid' ? 'bg-[#1a365d] text-white shadow-xl shadow-[#1a365d]/20 scale-105' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Grid size={14} />
              Grid
            </button>
            <button 
              onClick={() => setView('table')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                view === 'table' ? 'bg-[#1a365d] text-white shadow-xl shadow-[#1a365d]/20 scale-105' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Table size={14} />
              Table
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-[#c8962a] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing Database...</p>
          </div>
        ) : listings.length > 0 ? (
          <>
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {listings.map((item) => (
                  <div 
                    key={item._id} 
                    onClick={() => setSelectedItem(item)}
                    className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group relative flex flex-col cursor-pointer"
                  >
                    {/* Image Area */}
                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.project} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#fdfaf3]">
                          <div className="text-[#c8962a]/10">
                            <Home size={64} strokeWidth={1} />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-5 left-5 flex flex-col gap-2">
                        <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[#c8962a] text-[9px] font-black uppercase tracking-widest shadow-xl border border-[#c8962a]/10">
                          {item.vertical}
                        </span>
                        {item.postType === 'REQUIREMENT' && (
                          <span className="bg-[#1a365d] px-4 py-1.5 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-xl">
                            Wanted
                          </span>
                        )}
                        {item.videos && item.videos.length > 0 && (
                          <div className="bg-white/95 backdrop-blur w-8 h-8 rounded-full flex items-center justify-center text-primary-600 shadow-xl border border-primary-100">
                            <Play size={12} className="fill-current ml-0.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${item.intent?.includes('SALE') ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {item.intent?.replace('_', ' ')} · {item.subType?.replace('_', ' ')}
                        </p>
                      </div>
                      
                      <h3 className="text-lg font-serif font-black text-[#0f172a] mb-1 line-clamp-1 group-hover:text-[#c8962a] transition-colors">{item.project || 'Unspecified Project'}</h3>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold mb-6">
                        <MapPin size={12} className="text-[#c8962a]" />
                        <span className="truncate">{item.location}</span>
                      </div>

                      {/* Chips */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        <div className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-tighter border border-slate-100">
                          {item.size} {item.sizeUnit}
                        </div>
                        {item.bedrooms && (
                          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-tighter border border-emerald-100">
                            {item.bedrooms} BHK
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            {item.postType === 'REQUIREMENT' ? 'Budget range' : 'Valuation'}
                          </span>
                          <p className="text-lg font-black text-[#0f172a] tracking-tight">
                            {item.postType === 'REQUIREMENT' 
                              ? `₹${item.budgetMin}-${item.budgetMax} ${item.budgetUnit}`
                              : item.totalAmount ? `₹${item.totalAmount} ${item.totalAmountUnit}` : 'On Request'
                            }
                          </p>
                        </div>
                        <button className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-[#c8962a] transition-all shadow-xl shadow-slate-900/10 group-hover:scale-110 active:scale-95">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="py-6 px-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] w-24">Order</th>
                        <th className="py-6 px-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Type</th>
                        <th className="py-6 px-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Sub-Type</th>
                        <th className="py-6 px-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Asset Context</th>
                        <th className="py-6 px-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Commercials</th>
                        <th className="py-6 px-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {listings.map((item, idx) => (
                        <tr 
                          key={item._id} 
                          onClick={() => setSelectedItem(item)}
                          className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                        >
                          <td className="py-6 px-10 text-[12px] font-black text-slate-300 tracking-widest">#{(page - 1) * limit + idx + 1}</td>
                          <td className="py-6 px-10">
                            <span className="px-4 py-1.5 rounded-full bg-[#c8962a]/10 text-[#c8962a] text-[10px] font-black uppercase tracking-widest">
                              {item.vertical}
                            </span>
                          </td>
                          <td className="py-6 px-10">
                            <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                              {item.subType?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-6 px-10">
                            <div className="flex flex-col">
                              <span className="text-[14px] font-black text-[#0f172a] tracking-tight group-hover:text-[#c8962a] transition-colors">{item.project || 'Premium Listing'}</span>
                              <div className="flex items-center gap-1.5 mt-1.5 opacity-50">
                                <MapPin size={12} className="text-[#c8962a]" />
                                <span className="text-[11px] font-bold">{item.location}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-10">
                            <div className="flex flex-col">
                              <span className="text-[14px] font-black text-emerald-600 tracking-tight">
                                {item.postType === 'REQUIREMENT' 
                                  ? `₹${item.budgetMin}-${item.budgetMax} ${item.budgetUnit}`
                                  : item.totalAmount ? `₹${item.totalAmount} ${item.totalAmountUnit}` : 'N/A'
                                }
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {item.postType === 'REQUIREMENT' ? 'Budget Target' : 'Liquidity Ask'}
                              </span>
                            </div>
                          </td>
                          <td className="py-6 px-10 text-center">
                            <button className="px-8 py-3 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#c8962a] transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                              Connect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-20 flex items-center justify-center gap-6">
                <button 
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="w-14 h-14 rounded-[1.25rem] border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#c8962a] hover:text-[#c8962a] disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm bg-white active:scale-90"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="flex items-center gap-3">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-14 h-14 rounded-[1.25rem] text-[13px] font-black transition-all ${
                        page === i + 1 
                          ? 'bg-[#c8962a] text-white shadow-[0_15px_30px_rgba(200,150,42,0.3)] scale-110 z-10' 
                          : 'bg-white border-2 border-slate-50 text-slate-400 hover:border-slate-200 active:scale-90'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="w-14 h-14 rounded-[1.25rem] border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#c8962a] hover:text-[#c8962a] disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm bg-white active:scale-90"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center bg-white rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8962a]/20 to-transparent"></div>
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
              <Loader2 size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-serif font-black text-[#0f172a] mb-2 tracking-tight">No results match your criteria</h3>
            <p className="text-[11px] font-black text-slate-400 mt-2 uppercase tracking-[0.25em] max-w-sm leading-relaxed">
              Try broadening your search or clearing filters to explore other verified opportunities.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#c8962a] transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      <ListingDetailModal 
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        isAuthenticated={isAuthenticated}
        onLogin={() => {
          setSelectedItem(null);
          onLoginRequired();
        }}
      />
    </section>
  );
};

export default InventoryGrid;
