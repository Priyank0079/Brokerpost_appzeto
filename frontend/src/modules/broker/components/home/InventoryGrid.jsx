import React, { useState, useEffect } from 'react';
import { MapPin, Grid, Table, ChevronLeft, ChevronRight, Loader2, Home, Play } from 'lucide-react';
import { getPostings } from '../../services/postingService';
import { useAuth } from '../../context/AuthContext';
import ListingDetailModal from './ListingDetailModal';

const formatNum = (num) => new Intl.NumberFormat('en-IN').format(num);

const renderListingType = (item) => {
  const postType = item.postType;
  const intent = item.intent?.toUpperCase() || '';
  if (postType === 'REQUIREMENT') {
    if (intent === 'SALE' || intent === 'PURCHASE') return 'Wanted on Purchase';
    if (intent === 'RENT' || intent === 'WANTED_RENT') return 'Wanted on Rent';
    if (intent === 'LEASE' || intent === 'WANTED_LEASE') return 'Wanted on Lease';
    return `Wanted on ${item.intent || 'Purchase'}`;
  } else {
    if (intent === 'SALE') return 'Available for Sale';
    if (intent === 'RENT') return 'Available for Rental';
    if (intent === 'LEASE') return 'Available for Lease';
    return `Available for ${item.intent || 'Sale'}`;
  }
};

const renderCategoryBadge = (vertical) => {
  const v = vertical?.toUpperCase() || 'RESIDENTIAL';
  const bg = v === 'RESIDENTIAL' ? 'bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe]' : 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]';
  const label = v === 'RESIDENTIAL' ? 'Residential' : 'Commercial';
  return (
    <span className={`whitespace-nowrap px-3 py-1 rounded-md text-[10.5px] font-bold tracking-tight border ${bg}`}>
      {label}
    </span>
  );
};

const renderSubTypeBadge = (subType) => {
  const s = subType ? subType.toUpperCase() : '';
  let bg = 'bg-slate-50 text-slate-600 border border-slate-200';
  let label = subType || '';
  if (s.includes('PLOT')) {
    bg = 'bg-[#ecfdf5] text-[#047857] border border-[#d1fae5]';
    label = s === 'PLOT' ? 'Plot' : 'Plots';
  } else if (s.includes('APARTMENT')) {
    bg = 'bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe]';
    label = 'Apartments';
  } else if (s.includes('FLOOR')) {
    bg = 'bg-[#faf5ff] text-[#7e22ce] border border-[#f3e8ff]';
    label = 'Low Rise Floors';
  } else if (s.includes('VILLA') || s.includes('KOTHI')) {
    bg = 'bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5]';
    label = 'Kothi/Villas';
  } else if (s.includes('SHOP') || s.includes('SHOWROOM')) {
    bg = 'bg-[#faf5ff] text-[#7e22ce] border border-[#f3e8ff]';
    label = 'Shops/Showroom';
  } else if (s.includes('OFFICE')) {
    bg = 'bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe]';
    label = 'Office';
  } else if (s.includes('WAREHOUSE')) {
    bg = 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]';
    label = 'Warehouse';
  } else if (s.includes('BUILDING')) {
    bg = 'bg-[#fdf2f8] text-[#be185d] border border-[#fce7f3]';
    label = 'Standalone Building';
  }
  return (
    <span className={`whitespace-nowrap px-3 py-1 rounded-md text-[10.5px] font-bold tracking-tight border ${bg}`}>
      {label}
    </span>
  );
};

const formatArea = (listing) => {
  if (!listing.size) return 'N/A';
  const unit = listing.sizeUnit === 'SQ_FT' ? 'Sq.Ft' : (listing.sizeUnit === 'SQ_YD' ? 'Sq.Yd' : (listing.sizeUnit === 'SQ_MT' ? 'Sq.Mt' : listing.sizeUnit));
  return `${listing.size} ${unit}`;
};

const formatTotalPrice = (listing) => {
  if (listing.totalAmount) {
    return `₹${formatNum(listing.totalAmount)}`;
  }
  if (listing.budgetMin || listing.budgetMax) {
    if (listing.budgetMin && listing.budgetMax) {
      return `₹${Number(listing.budgetMin).toLocaleString('en-IN')} - ₹${Number(listing.budgetMax).toLocaleString('en-IN')}`;
    }
    return `₹${Number(listing.budgetMin || listing.budgetMax).toLocaleString('en-IN')}`;
  }
  return 'On Request';
};

const renderStatusBadge = (listing) => {
  if (!listing.constructionStatus) return null;
  const isReady = listing.constructionStatus === 'READY' || listing.constructionStatus === 'Ready to Move';
  const label = isReady ? 'Ready to Move' : 'Under Construction';
  const bg = isReady ? 'bg-[#ecfdf5] text-[#047857] border border-[#d1fae5]' : 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]';
  return (
    <span className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-bold tracking-tight border ${bg}`}>
      {label}
    </span>
  );
};

const InventoryGrid = ({ filters, onLoginRequired, config }) => {
  const { isAuthenticated, user } = useAuth();
  const [view, setView] = useState('grid');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const limit = 20;

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
    <section id="inventory-grid" className="bg-pink-50/30 pt-6 pb-10 px-6 lg:px-20 scroll-mt-10">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-0.5">
            <h2
              className="section-title text-left font-serif text-[#0d1b2a]"
              style={{
                fontSize: '24px',
                fontWeight: 'normal'
              }}
            >
              All Listed Inventory
            </h2>

          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">View:</span>
            <button
              onClick={() => setView('grid')}
              className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all min-w-[120px] ${view === 'grid'
                  ? 'bg-[#1a365d] text-white border border-[#1a365d] shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              <Grid size={14} className="stroke-[3]" />
              Grid
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all min-w-[120px] ${view === 'table'
                  ? 'bg-[#1a365d] text-white border border-[#1a365d] shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              <Table size={14} className="stroke-[3]" />
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
                    className="bg-white rounded-[0.5rem] overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    {/* Top Area (Beige or Image) */}
                    <div className="h-36 bg-[#f5ede3] relative overflow-hidden flex items-center justify-center cursor-default" onClick={(e) => e.stopPropagation()}>
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.project} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-transparent">
                          <Home size={40} className="text-[#8c7a6b] stroke-1" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-[#dbeafe]/90 backdrop-blur text-[#1e40af] px-1 py-0 rounded-md text-[8px] font-medium">
                        {item.vertical || 'Residential'}
                      </span>
                    </div>

                    {/* Middle Area (White) */}
                    <div className="p-1 pl-3 flex-1 flex flex-col bg-white">
                      <p className="text-[9px] font-normal text-slate-400 uppercase tracking-wide mt-2 mb-2">
                        {renderListingType(item)} · {item.subType?.replace('_', ' ') || 'Apartments'}
                      </p>

                      <h3 className="text-xs font-bold text-[#0f172a] mt-0.5 mb-2">
                        {item.bedrooms && item.vertical?.toUpperCase() !== 'COMMERCIAL' ? `${item.bedrooms} BHK · ` : ''}{item.project || 'Unspecified Project'}
                      </h3>

                      <div className="flex items-center gap-1 text-slate-500 text-[10px] mb-1">
                        <MapPin size={12} className="text-pink-500" />
                        <span className="truncate">{item.location}</span>
                      </div>

                      {/* Chips */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="px-1 py-1 bg-slate-50 text-slate-600 rounded-md text-[9px] font-medium flex items-center gap-1 border border-slate-100 tracking-tighter">
                          {item.size} {item.sizeUnit}
                        </div>
                        <div className="px-1 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-medium">
                          Ready to Move
                        </div>
                        <div className="px-1 py-1 bg-blue-50 text-blue-600 rounded-md text-[9px] font-medium">
                          FOR {item.intent?.toUpperCase() || 'RENT'}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Area (Beige) */}
                    <div className="p-4 bg-[#f5ede3] flex items-center justify-between">
                      <div className="text-xs font-bold text-[#1e3a5f]">
                        {item.postType === 'REQUIREMENT'
                          ? (item.budgetMin && item.budgetMax ? `₹${formatNum(item.budgetMin)} - ₹${formatNum(item.budgetMax)}` : '₹ 0')
                          : (item.totalAmount ? `₹${formatNum(item.totalAmount)}` : '₹ 0')
                        }
                      </div>
                      <button className="px-2 py-2 bg-[#1a365d] text-white rounded-lg text-[10px] font-bold hover:bg-[#c8962a] transition-colors tracking-wide">
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F6] border-b border-[#ddd6c8] text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                        <th className="py-3 px-6">Category</th>
                        <th className="py-3 px-6">Sub-Type</th>
                        <th className="py-3 px-6">Section</th>
                        <th className="py-3 px-6">Location</th>
                        <th className="py-3 px-6">Area</th>
                        <th className="py-3 px-6">Total Price</th>
                        <th className="py-3 px-6">Broker</th>
                        <th className="py-3 px-6 text-center w-36">Connect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ddd6c8] bg-white">
                      {listings.map((item, idx) => (
                        <tr
                          key={item._id}
                          onClick={() => setSelectedItem(item)}
                          className="hover:bg-slate-50/50 transition-all group cursor-pointer text-[12.5px] text-slate-700"
                        >
                          {/* Category Badge */}
                          <td className="py-2.5 px-6">
                            {renderCategoryBadge(item.vertical)}
                          </td>

                          {/* Sub-Type Badge */}
                          <td className="py-2.5 px-6">
                            {renderSubTypeBadge(item.subType)}
                          </td>

                          {/* Section */}
                          <td className="py-2.5 px-6 text-slate-500 font-medium">
                            {renderListingType(item)}
                          </td>

                          {/* Location */}
                          <td className="py-2.5 px-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{item.location || 'N/A'}</span>
                              {item.project && (
                                <span className="text-[10.5px] text-slate-400 mt-0.5 font-medium">{item.project}</span>
                              )}
                            </div>
                          </td>

                          {/* Area */}
                          <td className="py-2.5 px-6 text-slate-800 font-semibold">
                            {formatArea(item)}
                          </td>

                          {/* Total Price */}
                          <td className="py-2.5 px-6 font-bold text-slate-900">
                            {formatTotalPrice(item)}
                          </td>

                          {/* Broker */}
                          <td className="py-2.5 px-6 whitespace-nowrap">
                            <div className="font-semibold text-slate-800">
                              {item.postedBy?.name || `${item.postedBy?.firstName || ''} ${item.postedBy?.lastName || ''}`.trim() || 'Broker Name'}
                            </div>
                            {item.postedBy?.companyName && (
                              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                                {item.postedBy.companyName}
                              </div>
                            )}
                          </td>

                          {/* Connect Button */}
                          <td className="py-2.5 px-6 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className="px-2.5 py-1 rounded-[4px] bg-slate-900 hover:bg-[#c8962a] text-white text-[8.5px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                            >
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
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-[0.75rem] border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#c8962a] hover:text-[#c8962a] disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm bg-white active:scale-90"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-[0.75rem] text-[11px] font-black transition-all ${page === i + 1
                        ? 'bg-[#c8962a] text-white shadow-[0_10px_20px_rgba(200,150,42,0.2)] scale-105 z-10'
                        : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-slate-300 active:scale-90'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-[0.75rem] border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#c8962a] hover:text-[#c8962a] disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm bg-white active:scale-90"
                >
                  <ChevronRight size={16} />
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
        user={user}
        onLogin={() => {
          setSelectedItem(null);
          onLoginRequired();
        }}
      />
    </section>
  );
};

export default InventoryGrid;
