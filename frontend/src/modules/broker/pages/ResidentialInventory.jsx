import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPostings, deletePosting } from '../services/postingService';

import PostListingModal from '../components/inventory/PostListingModal';
import Modal from '../components/ui/Modal';

const ResidentialInventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const intent = searchParams.get('intent') || 'SALE';
  const urlSearch = searchParams.get('search') || '';

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubTypes, setShowSubTypes] = useState(false);
  const [selectedSubType, setSelectedSubType] = useState('All Sub-types');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Edit State
  const [selectedPosting, setSelectedPosting] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete State
  const [postingToDelete, setPostingToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);

  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  const isRequirement = ['PURCHASE', 'WANTED_RENT', 'WANTED_LEASE'].includes(intent);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  
  const isRentIntent = ['RENT', 'WANTED_RENT', 'RENTALS', 'LEASE', 'WANTED_LEASE'].includes(intent);
  const subTypes = isRequirement
    ? (isRentIntent 
        ? ['All Sub-types', 'Apartments', 'Low Rise Floors', 'Kothi/Villas'] 
        : ['All Sub-types', 'Apartments', 'Low Rise Floors', 'Kothi/Villas', 'Plots'])
    : ['All Sub-types', 'Apartments', 'Low Rise Floors', 'Kothi/Villas'];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        vertical: 'RESIDENTIAL',
        intent: intent,
      };
      if (selectedSubType !== 'All Sub-types') {
        params.subType = selectedSubType.toUpperCase().replace(' ', '_').replace('/', '_');
      }
      if (debouncedSearch.trim() !== '') {
        params.location = debouncedSearch.trim();
      }
      
      const result = await getPostings(params);
      if (result.success) {
        setListings(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [intent, selectedSubType, debouncedSearch]);

  const handleConfirmDelete = async () => {
    if (!postingToDelete) return;
    setDeleting(true);
    try {
      const result = await deletePosting(postingToDelete._id);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setPostingToDelete(null);
        fetchListings();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Helper formatting functions for tabular data
  const renderSubTypeBadge = (subType) => {
    const s = subType ? subType.toUpperCase() : '';
    let bg = 'bg-slate-50 text-slate-600';
    let label = subType || '';
    if (s.includes('PLOT')) {
      bg = 'bg-[#ecfdf5] text-[#047857] border border-[#d1fae5]';
      label = 'Plots';
    } else if (s.includes('APARTMENT')) {
      bg = 'bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe]';
      label = 'Apartments';
    } else if (s.includes('FLOOR')) {
      bg = 'bg-[#faf5ff] text-[#7e22ce] border border-[#f3e8ff]';
      label = 'Low Rise Floors';
    } else if (s.includes('VILLA') || s.includes('KOTHI')) {
      bg = 'bg-[#e0e7ff] text-[#4338ca] border border-[#e0e7ff]';
      label = 'Kothi/Villas';
    }
    return (
      <span className={`px-3 py-1 rounded-full text-[10.5px] font-bold tracking-tight ${bg}`}>
        {label}
      </span>
    );
  };

  const formatArea = (listing) => {
    if (!listing.size) return 'N/A';
    const unit = listing.sizeUnit === 'SQ_FT' ? 'Sq.Ft' : (listing.sizeUnit === 'SQ_YD' ? 'Sq.Yd' : (listing.sizeUnit === 'SQ_MT' ? 'Sq.Mt' : listing.sizeUnit));
    return `${listing.size} ${unit}`;
  };

  const formatPrice = (listing) => {
    if (listing.priceRate) {
      return `₹${Number(listing.priceRate).toLocaleString('en-IN')}`;
    }
    return 'On Request';
  };

  const formatTotalPrice = (listing) => {
    if (listing.totalAmount) {
      return `₹${Number(listing.totalAmount).toLocaleString('en-IN')}`;
    }
    if (listing.budgetMin || listing.budgetMax) {
      if (listing.budgetMin && listing.budgetMax) {
        return `₹${listing.budgetMin}-${listing.budgetMax} L`;
      }
      return `₹${listing.budgetMin || listing.budgetMax} L`;
    }
    return 'On Request';
  };

  const renderStatusBadge = (listing) => {
    const isReady = listing.constructionStatus === 'READY' || listing.constructionStatus === 'Ready to Move';
    const label = isReady ? 'Ready to Move' : 'Under Construction';
    const bg = isReady ? 'bg-[#ecfdf5] text-[#047857] border border-[#d1fae5]' : 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]';
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-tight border ${bg}`}>
        {label}
      </span>
    );
  };

  const renderMediaBadge = (listing) => {
    const count = (listing.images?.length || 0) + (listing.videos?.length || 0);
    if (count === 0) {
      return (
        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100">
          None
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold text-blue-700 bg-blue-50 border border-[#dbeafe]">
        {count} {count === 1 ? 'file' : 'files'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getPageConfig = () => {
    switch (intent) {
      case 'RENT':
        return {
          title: 'Available for Rental · Residential',
          heading: 'Available for Rental — Residential',
          subheading: 'Residential properties for rent',
          bg: 'bg-[#faf7f2]'
        };
      case 'PURCHASE':
        return {
          title: 'Wanted on Purchase · Residential',
          heading: 'Wanted on Purchase — Residential',
          subheading: 'Buyer requirements for residential',
          bg: 'bg-[#faf7f2]'
        };
      case 'WANTED_RENT':
        return {
          title: 'Wanted on Rent · Residential',
          heading: 'Wanted on Rent — Residential',
          subheading: 'Tenant requirements for residential',
          bg: 'bg-[#faf7f2]'
        };
      default:
        return {
          title: 'Available for Sale · Residential',
          heading: 'Available for Sale — Residential',
          subheading: 'Residential properties listed for sale',
          bg: 'bg-[#faf7f2]'
        };
    }
  };

  const config = getPageConfig();

  return (
    <div className={`-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 ${config.bg} min-h-screen transition-colors duration-300`}>
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-normal font-serif text-[#0d1b2a]">{config.heading}</h1>
          <p className="text-sm text-[#718199] mt-1">{config.subheading}</p>
        </div>
        {/* Unified Card Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Card Header (Filter Bar) */}
          <div className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 border-b border-slate-200 bg-white">
            <div className="flex flex-wrap items-center gap-2 md:gap-4 flex-1">
              <div className="relative flex-1 min-w-[180px] sm:max-w-56">
                <input 
                  type="text" 
                  placeholder="Search location/project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/30 transition-all text-slate-600 placeholder-[#9c7f84] tracking-tighter"
                />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowSubTypes(!showSubTypes)}
                  className="px-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-[11px] font-medium text-[#26296c] flex items-center justify-between gap-4 hover:bg-[#faf7f2]/80 transition-all min-w-[120px] tracking-tighter"
                >
                  {selectedSubType} <ChevronDown size={14} className="text-slate-400" />
                </button>

                {showSubTypes && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 shadow-xl rounded-lg z-50 py-1 overflow-hidden">
                    {subTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedSubType(type);
                          setShowSubTypes(false);
                        }}
                        className={`w-full text-left px-4 py-1.5 text-[12px] transition-colors ${selectedSubType === type ? 'bg-[#c8962a] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[11px] text-slate-500 font-bold">{listings.length} listings</span>
            </div>
            
            <button 
              onClick={() => setIsPostModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2.5 bg-[#c8962a] hover:bg-[#B48C35] text-white rounded-lg text-[11px] font-black flex items-center justify-center gap-2 shadow-lg shadow-[#c8962a]/20 transition-all"
            >
              <Plus size={14} /> Add Listing
            </button>
          </div>

          {/* Tabular Listing View */}
          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 size={40} className="animate-spin text-[#c8962a]" />
                <p className="text-sm font-bold uppercase tracking-widest">Loading inventory...</p>
              </div>
            ) : listings.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-slate-150 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-4 px-6 text-center w-12">#</th>
                    <th className="py-4 px-4 w-36">Sub-Type</th>
                    <th className="py-4 px-4">Location / Project</th>
                    <th className="py-4 px-4">Area</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Total Price</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-center">Media</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-6 text-center w-40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listings.map((listing, idx) => (
                    <tr key={listing._id} className="hover:bg-slate-50/40 transition-colors text-[12px] text-slate-700">
                      {/* Index */}
                      <td className="py-4 px-6 text-center font-bold text-slate-400">{idx + 1}</td>
                      
                      {/* Sub-type Bubble */}
                      <td className="py-4 px-4">{renderSubTypeBadge(listing.subType)}</td>
                      
                      {/* Location & Project */}
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{listing.location || 'N/A'}</span>
                            <span className="text-slate-400 font-normal text-[10.5px]">· {listing.city || 'Gurugram'}</span>
                          </div>
                          {listing.project && (
                            <div className="text-[10.5px] text-slate-400 mt-0.5 font-medium">{listing.project}</div>
                          )}
                        </div>
                      </td>
                      
                      {/* Area */}
                      <td className="py-4 px-4 font-semibold text-slate-800">{formatArea(listing)}</td>
                      
                      {/* Price */}
                      <td className="py-4 px-4 font-bold text-slate-800">{formatPrice(listing)}</td>
                      
                      {/* Total Price / Budget */}
                      <td className="py-4 px-4 font-bold text-slate-900">{formatTotalPrice(listing)}</td>
                      
                      {/* Status */}
                      <td className="py-4 px-4">{renderStatusBadge(listing)}</td>
                      
                      {/* Media */}
                      <td className="py-4 px-4 text-center">{renderMediaBadge(listing)}</td>
                      
                      {/* Date */}
                      <td className="py-4 px-4 font-medium text-slate-500">{formatDate(listing.createdAt)}</td>
                      
                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => {
                              setSelectedPosting(listing);
                              setIsEditModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-[#FAF9F6] transition-all bg-white"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => {
                              setPostingToDelete(listing);
                              setIsDeleteModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#8b1a1a] hover:bg-[#a02020] text-white text-xs font-bold transition-all"
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[#fefce8] rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl opacity-60">📋</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-black">No listings in this section</h3>
                <p className="text-slate-400 text-xs mt-2">Try changing filters or add your first listing.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Add/Edit Listing Modal */}
        <PostListingModal 
          isOpen={isPostModalOpen || isEditModalOpen} 
          onClose={() => {
            setIsPostModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedPosting(null);
          }} 
          intent={intent} 
          vertical="RESIDENTIAL"
          posting={selectedPosting}
          onSuccess={fetchListings}
        />

        {/* Premium Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setPostingToDelete(null);
          }}
          title="Confirm Delete"
          footer={
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPostingToDelete(null);
                }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all bg-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-[#8b1a1a] hover:bg-[#a02020] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center min-w-[70px]"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          }
        >
          <p className="text-[13px] text-slate-600 font-normal leading-relaxed">
            Are you sure you want to delete this listing? This cannot be undone.
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default ResidentialInventory;
