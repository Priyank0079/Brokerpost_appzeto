import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowLeft, Loader2, Users, List, Building, MapPin, Globe } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyPostings, getPostingStats, deletePosting, refreshPosting } from '../services/postingService';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import PostListingModal from '../components/inventory/PostListingModal';

const StatCard = ({ label, value, subtitle, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-xl border border-[#ede8df] shadow-sm relative overflow-hidden transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-[#c8962a]/30' : ''}`}
  >
    <div className="flex justify-between items-start">
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-[#9ba6ae] uppercase tracking-widest mb-1">{label}</p>
        <h3 
          className="text-3xl font-bold text-[#1a365d] leading-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {value}
        </h3>
        <p className="text-[11px] text-slate-500 font-normal leading-tight mt-1">{subtitle}</p>
      </div>
    </div>
  </div>
);

const BreakdownRow = ({ label, value, colorClass, onClick }) => {
  // Calculate percentage dynamically for visual indicator
  const percent = Math.min(100, Math.max(8, (value / 10) * 100));
  return (
    <div 
      className="-mx-2 px-2 py-1.5 rounded-lg hover:bg-slate-50/50 cursor-pointer transition-all"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-[130px]">
          <span className="text-[11px] text-slate-700 font-bold leading-tight">{label}</span>
          <span className="text-[9px] text-slate-400 leading-none">...</span>
        </div>
        {/* Modern colored progress bar indicator */}
        <div className="flex-grow h-1.5 bg-[#FAF9F6] border border-[#ede8df] rounded-full overflow-hidden self-center">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs font-black text-slate-800 w-4 text-right">{value}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = navigateFn => navigateFn && navigate(navigateFn);
  const routerNavigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosting, setSelectedPosting] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAllListings, setShowAllListings] = useState(false);
  const [allListings, setAllListings] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsRes = await getPostingStats();
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      const res = await deletePosting(deleteConfirmId);
      if (res.success) {
        fetchData();
        window.dispatchEvent(new Event('listing-updated'));
        setDeleteConfirmId(null);
      } else {
        alert(res.message || 'Failed to delete listing');
      }
    } catch (err) {
      console.error('Error deleting listing', err);
      alert('An error occurred while deleting the listing');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewAll = async () => {
    if (showAllListings) {
      setShowAllListings(false);
      return;
    }
    
    setLoadingAll(true);
    try {
      const res = await getMyPostings({ limit: 1000 });
      if (res.success) {
        setAllListings(res.data);
        setShowAllListings(true);
      } else {
        alert('Failed to load all listings');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching all listings');
    } finally {
      setLoadingAll(false);
    }
  };

  const handleRefreshClick = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await refreshPosting(id);
      if (res.success) {
        setRefreshMessage({ type: 'success', text: res.message });
        fetchData();
        window.dispatchEvent(new Event('listing-updated'));
      } else {
        setRefreshMessage({ type: 'error', text: res.message || 'Failed to refresh listing' });
      }
    } catch (err) {
      console.error(err);
      setRefreshMessage({ type: 'error', text: 'Error refreshing listing' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#c8962a]" size={40} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const s = stats || {
    myListings: 0,
    totalListings: 0,
    totalBrokers: 0,
    availabilityCount: 0,
    requirementCount: 0,
    groupCount: 0,
    breakdown: { 
      residential: { sale: 0, rent: 0, purchase: 0, wantedRent: 0 },
      commercial: { sale: 0, lease: 0, purchase: 0, wantedLease: 0 }
    },
    recentListings: []
  };

  // Helper to format subtype beautifully
  const getSubtypeDisplay = (subType) => {
    if (!subType) return 'Property';
    return subType.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  // Sum availability & requirement dynamically based on breakdown
  const availabilityCountVal = s.breakdown.residential.sale + s.breakdown.residential.rent + s.breakdown.commercial.sale + s.breakdown.commercial.lease;
  const requirementCountVal = s.breakdown.residential.purchase + s.breakdown.residential.wantedRent + s.breakdown.commercial.purchase + s.breakdown.commercial.wantedLease;
  
  // Connect dynamically to DB counts, fall back to default template baseline for visual richness
  const activeMyListings = s.myListings ?? 0;
  const activeAvailability = availabilityCountVal ?? 0;
  const activeRequirements = requirementCountVal ?? 0;
  const activeNetworkListings = (activeAvailability + activeRequirements) ?? 0;
  const slotsRemaining = Math.max(0, 25 - activeMyListings);

  const displayListings = showAllListings ? allListings : (s.recentListings || []);

  const getSubPill = (subType) => {
    if (!subType) return { label: 'Property', cls: 'mob-p-gray' };
    const s = subType.toLowerCase();
    if (s.includes('apart')) return { label: subType, cls: 'mob-p-blue' };
    if (s.includes('office')) return { label: subType, cls: 'mob-p-orange' };
    if (s.includes('plot')) return { label: subType, cls: 'mob-p-green' };
    if (s.includes('villa') || s.includes('kothi')) return { label: subType, cls: 'mob-p-gold' };
    return { label: subType, cls: 'mob-p-gray' };
  };
  const getIntentPill = (intent) => {
    const i = (intent || '').toLowerCase();
    if (i.includes('sale')) return { label: 'Sale', cls: 'mob-p-green' };
    if (i.includes('rent') || i.includes('rental')) return { label: 'Rent', cls: 'mob-p-blue' };
    if (i.includes('lease')) return { label: 'Lease', cls: 'mob-p-purple' };
    if (i.includes('purchase')) return { label: 'Wanted', cls: 'mob-p-orange' };
    return { label: intent, cls: 'mob-p-gray' };
  };

  return (
    <>
      {/* ── MOBILE DASHBOARD ── */}
      <div className="md:hidden" style={{ background: '#f5f0e8', minHeight: '100vh', paddingBottom: 72 }}>
        {/* Stat Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '10px 12px 6px' }}>
          <div className="mob-sc-mini">
            <div className="mob-sm-lbl">My Listings</div>
            <div className="mob-sm-val">{activeMyListings}</div>
          </div>
          <div className="mob-sc-mini">
            <div className="mob-sm-lbl">Network</div>
            <div className="mob-sm-val">{activeNetworkListings}</div>
          </div>
          <div className="mob-sc-mini">
            <div className="mob-sm-lbl">Availability</div>
            <div className="mob-sm-val" style={{ color: '#166534' }}>{activeAvailability}</div>
          </div>
          <div className="mob-sc-mini">
            <div className="mob-sm-lbl">Requirements</div>
            <div className="mob-sm-val">{activeRequirements}</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.2, color: '#6b7060', padding: '8px 12px 4px', fontWeight: 600 }}>Recent Activity</div>

        {(s.recentListings || []).slice(0, 6).map((post) => {
          const sub = getSubPill(post.subType);
          const priceDisplay = post.totalAmount
            ? `₹${Number(post.totalAmount).toLocaleString('en-IN')}`
            : post.budgetMax ? `₹${Number(post.budgetMax).toLocaleString('en-IN')}` : 'On Req.';
          
          let bgClass = 'bg-slate-50 text-slate-600 border border-slate-100';
          if (sub.cls === 'mob-p-blue') bgClass = 'bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe]';
          else if (sub.cls === 'mob-p-green') bgClass = 'bg-[#ecfdf5] text-[#047857] border border-[#d1fae5]';
          else if (sub.cls === 'mob-p-gold') bgClass = 'bg-[#e0e7ff] text-[#4338ca] border border-[#e0e7ff]';
          else if (sub.cls === 'mob-p-orange') bgClass = 'bg-[#faf5ff] text-[#7e22ce] border border-[#f3e8ff]';
          else if (sub.cls === 'mob-p-purple') bgClass = 'bg-[#faf5ff] text-[#7e22ce] border border-[#f3e8ff]';

          const isReady = post.constructionStatus === 'READY' || post.constructionStatus === 'Ready to Move';
          const statusLabel = isReady ? 'Ready to Move' : 'Under Construction';
          const statusBg = isReady ? 'bg-[#ecfdf5] text-[#047857] border border-[#d1fae5]' : 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]';
          
          const areaDisplay = post.size ? `${post.size} ${post.sizeUnit === 'SQ_FT' ? 'Sq.Ft' : (post.sizeUnit === 'SQ_YD' ? 'Sq.Yd' : post.sizeUnit)}` : 'N/A';
          const dateString = post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-GB') : 'N/A';

          return (
            <div key={post._id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col gap-3 mb-3 mx-3 cursor-pointer"
              onClick={() => { setSelectedPosting(post); setIsEditModalOpen(true); }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10.5px] font-bold tracking-tight whitespace-nowrap inline-block ${bgClass}`}>
                    {sub.label}
                  </span>
                  <div className="font-bold text-[#0f172a] text-sm mt-2">{post.project || post.location || 'N/A'}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{post.location || 'N/A'} · {post.city || 'Gurugram'}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#c8962a] text-sm">{priceDisplay}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase">#{post._id?.toString().slice(-6)}</div>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-slate-50 rounded text-[10px] font-medium border border-slate-100">{areaDisplay}</span>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-tight border ${statusBg}`}>
                  {statusLabel}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div className="text-[10px] text-slate-400 font-medium">{dateString}</div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleRefreshClick(e, post._id)}
                    className={`px-2.5 py-1 rounded border font-bold text-[10px] transition-all flex items-center justify-center ${
                      post.boostedAt 
                        ? 'border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white'
                        : 'border-[#c8962a] text-[#c8962a] bg-white hover:bg-[#c8962a] hover:text-white'
                    }`}
                  >
                    ↑ Boost
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedPosting(post); setIsEditModalOpen(true); }}
                    className="px-2.5 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-600 bg-white"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPostingToDelete(post); setIsDeleteModalOpen(true); }}
                    className="px-2.5 py-1 rounded bg-[#8b1a1a] text-white text-[10px] font-bold"
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {(s.recentListings || []).length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: '#6b7060', fontSize: 12 }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>◈</div>
            No listings yet. Use the sidebar to add your first listing.
          </div>
        )}
      </div>

      {/* ── DESKTOP DASHBOARD ── */}
      <div className="hidden md:block">
      {/* Welcome Header */}
      <div className="px-2 md:px-0 page-hd">
        <h1 
          className="text-[#1a1a1a]" 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '22px', 
            fontWeight: '700',
            color: 'var(--ink)'
          }}
        >
          Welcome back, {user?.firstName || 'Sheetal'}
        </h1>
        <p className="text-xs text-slate-500 mt-1 tracking-normal font-normal">Your personal inventory & network overview</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 px-2 md:px-0">
        <StatCard 
          label="MY LISTINGS" 
          value={activeMyListings} 
          subtitle={`${slotsRemaining} of 25 slots remaining`} 
        />
        <StatCard 
          label="NETWORK LISTINGS" 
          value={activeNetworkListings} 
          subtitle="All brokers" 
        />
        <StatCard 
          label="AVAILABILITY" 
          value={activeAvailability} 
          subtitle="For sale / rent / lease" 
        />
        <StatCard 
          label="REQUIREMENTS" 
          value={activeRequirements} 
          subtitle="Wanted buy / rent / lease" 
        />
      </div>

      <div className="space-y-6">
        {/* Modern Recent Listings Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#ede8df] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#ede8df] flex items-center justify-between bg-white">
              <h3 className="text-sm font-bold text-[#1e3a5f]">{showAllListings ? 'My All Listings' : 'My Recent Listings'}</h3>
              <button 
                onClick={handleViewAll} 
                disabled={loadingAll}
                className="text-xs font-bold px-4 py-2 rounded-lg border border-[#ede8df] text-slate-600 hover:bg-[#FAF9F6] transition-all flex items-center gap-2"
              >
                {loadingAll ? <Loader2 size={14} className="animate-spin" /> : null}
                {showAllListings ? 'View Recent' : 'View All'}
              </button>
            </div>
            
            {displayListings.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white flex items-center justify-center mb-4 text-slate-300">
                  <span className="text-5xl">📋</span>
                </div>
                <h4 className="text-sm font-bold text-[#1e3a5f]">No listings yet</h4>
                <p className="text-xs text-slate-400 mt-1">Use "+ Add Listing" in each section</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F6] border-b border-slate-200">
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-12 text-center">#</th>
                      <th className="px-2 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">SUB-TYPE</th>
                      <th className="px-2 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">LOCATION / PROJECT</th>
                      <th className="px-2 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">AREA</th>
                      <th className="px-2 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL PRICE</th>
                      <th className="px-2 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">STATUS</th>
                      <th className="px-2 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">MEDIA</th>
                      <th className="px-2 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">DATE</th>
                      <th className="px-2 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {displayListings.map((post, idx) => {
                      const subTypeDisplay = getSubtypeDisplay(post.subType);
                      
                      let priceDisplay = 'On Request';
                      if (post.totalAmount) {
                        priceDisplay = `₹${Number(post.totalAmount).toLocaleString('en-IN')}`;
                      } else if (post.budgetMin || post.budgetMax) {
                        if (post.budgetMin && post.budgetMax) {
                          priceDisplay = `₹${Number(post.budgetMin).toLocaleString('en-IN')} - ₹${Number(post.budgetMax).toLocaleString('en-IN')}`;
                        } else {
                          priceDisplay = `₹${Number(post.budgetMin || post.budgetMax).toLocaleString('en-IN')}`;
                        }
                      }
                      
                      const isReady = post.constructionStatus === 'READY' || post.constructionStatus === 'Ready to Move';
                      const statusLabel = isReady ? 'Ready to Move' : 'Under Construction';
                      const statusBg = isReady ? 'bg-[#ecfdf5] text-[#047857]' : 'bg-[#fffbeb] text-[#b45309]';
                      
                      const mediaCount = (post.images?.length || 0) + (post.videos?.length || 0);

                      return (
                        <tr 
                          key={post._id} 
                          onClick={() => {
                            setSelectedPosting(post);
                            setIsEditModalOpen(true);
                          }}
                          className="hover:bg-slate-50/50 transition-all cursor-pointer group text-[12.5px] text-slate-700"
                        >
                          <td className="px-3 py-2 text-center">
                            <div className="font-bold text-slate-400 text-[13px]">{idx + 1}</div>
                            <div className="text-[9px] font-mono font-bold text-slate-300 mt-1 uppercase tracking-wider">
                              ID: {post._id?.toString().slice(-6)}
                            </div>
                          </td>
                          
                          <td className="px-2 py-2">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100 whitespace-nowrap">
                              {subTypeDisplay}
                            </span>
                          </td>
                          
                          <td className="px-2 py-2">
                            <div className="flex flex-col">
                              <p className="text-[12px] font-bold text-slate-900 leading-none mb-1 group-hover:text-[#c8962a] transition-colors">
                                {post.project || post.location} <span className="text-slate-400 font-normal">· {post.city}</span>
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {post.location}
                              </p>
                            </div>
                          </td>
                          
                          <td className="px-2 py-2 text-[11px] font-bold text-slate-900 whitespace-nowrap">
                            {post.size ? `${Number(post.size).toLocaleString('en-IN')} ${post.sizeUnit === 'SQ_FT' ? 'Sq.Ft' : (post.sizeUnit === 'SQ_YD' ? 'Sq.Yd' : 'Sq.Mt')}` : 'N/A'}
                          </td>
                          
                          <td className="px-2 py-2 text-[12px] font-bold text-slate-900 whitespace-nowrap">
                            {priceDisplay}
                          </td>
                          
                          <td className="px-2 py-2">
                            {post.postType === 'AVAILABILITY' ? (
                              <span className={`px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap ${statusBg}`}>
                                {statusLabel}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">-</span>
                            )}
                          </td>
                          
                          <td className="px-2 py-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-500 rounded text-[10px] font-bold whitespace-nowrap">
                              {mediaCount} files
                            </span>
                          </td>
                          
                          <td className="px-2 py-2 text-[10px] font-bold text-slate-400 whitespace-nowrap">
                            {new Date(post.createdAt || Date.now()).toLocaleDateString('en-GB')}
                          </td>
                          
                          <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={(e) => handleRefreshClick(e, post._id)}
                                title={post.boostedAt ? "Boosted listing" : "Refresh to top"}
                                className={`px-3.5 py-1.5 border rounded-lg text-[12px] font-bold transition-all flex items-center justify-center ${
                                  post.boostedAt 
                                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white'
                                    : 'border-[#c8962a] text-[#c8962a] bg-white hover:bg-[#c8962a] hover:text-white'
                                }`}
                              >
                                ↑
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedPosting(post);
                                  setIsEditModalOpen(true);
                                }}
                                className="px-3.5 py-1.5 border border-slate-200 text-[#1e3a5f] bg-white rounded-lg text-[12px] font-bold hover:bg-slate-50 transition-all"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={(e) => handleDeleteClick(e, post._id)}
                                className="px-3.5 py-1.5 bg-[#991b1b] text-white rounded-lg text-[12px] font-bold hover:bg-[#7f1d1d] transition-all border border-[#991b1b]"
                              >
                                Del
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>


      </div>
      <PostListingModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPosting(null);
        }}
        posting={selectedPosting}
        onSuccess={fetchData}
      />

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-100 mb-4 mx-auto">
                <span className="text-red-500 text-xl font-bold">!</span>
              </div>
              <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Delete Listing?</h3>
              <p className="text-sm text-center text-slate-500 mb-6">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-[#991b1b] hover:bg-[#7f1d1d] text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Refresh Alert Modal */}
      {refreshMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto border ${refreshMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-red-50 border-red-100 text-red-500'}`}>
                {refreshMessage.type === 'success' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <span className="text-xl font-bold">!</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-center text-slate-900 mb-2">
                {refreshMessage.type === 'success' ? 'Success' : 'Error'}
              </h3>
              <p className="text-sm text-center text-slate-500 mb-6">
                {refreshMessage.text}
              </p>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setRefreshMessage(null)}
                  className="w-full px-4 py-2.5 bg-[#1a365d] hover:bg-[#12284b] text-white text-sm font-bold rounded-lg transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>{/* end desktop wrapper */}
    </>
  );
};

export default Dashboard;
