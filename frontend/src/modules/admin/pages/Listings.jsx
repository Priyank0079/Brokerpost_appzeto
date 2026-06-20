import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Edit2, Trash2, Plus, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../broker/services/api';
import Modal from '../../broker/components/ui/Modal';
import PostListingModal from '../../broker/components/inventory/PostListingModal';

const formatEnum = (str) => {
  if (!str) return '';
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const getStatusText = (listing) => {
  const intent = formatEnum(listing.intent);
  const postType = formatEnum(listing.postType);
  if (listing.postType === 'AVAILABILITY') {
    return `Available for ${intent}`;
  }
  return `Wanted for ${intent}`;
};

const Listings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [editingListing, setEditingListing] = useState(null);

  useEffect(() => {
    if (isEditModalOpen || listingToDelete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEditModalOpen, listingToDelete]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const postTypeFilter = queryParams.get('postType');
  const urlSearch = queryParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(urlSearch);

  useEffect(() => {
    setSearchTerm(urlSearch);
    setCurrentPage(1);
  }, [urlSearch]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      let endpoint = `/postings?page=${currentPage}&limit=15`;
      if (postTypeFilter) endpoint += `&postType=${postTypeFilter}`;
      if (urlSearch) endpoint += `&location=${encodeURIComponent(urlSearch)}`;

      const response = await api.get(endpoint);
      if (response.success) {
        setListings(response.data);
        setTotalPages(response.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [postTypeFilter, urlSearch, currentPage]);

  // We are now relying on backend pagination and search
  const filteredListings = listings;

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return;
    try {
      const response = await api.delete(`/postings/${listingToDelete}`);
      if (response.success) {
        setListings(prev => prev.filter(l => l._id !== listingToDelete));
        setListingToDelete(null);
      }
    } catch (err) {
      alert('Failed to delete listing');
    }
  };



  const handleEditClick = (listing) => {
    setEditingListing(listing);
    setIsEditModalOpen(true);
  };

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-4 md:space-y-5 pb-10">
        {/* Custom Header */}
        <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <h1 className="text-base md:text-lg font-serif text-black">All Listings</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
              <input 
                type="text" 
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/admin/listings?search=${encodeURIComponent(searchTerm)}`);
                  }
                }}
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

        <div className="space-y-4 md:space-y-5">
          {/* Page Header */}
          <div className="px-2 md:px-0">
            <h1 className="text-2xl font-normal font-serif text-[#0d1b2a]">Property Inventory</h1>
            <p className="text-[13px] text-[#718199] mt-0 tracking-tight font-normal">Manage and audit all platform listings</p>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">SECTION</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">SUB-TYPE</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">LOCATION</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">AREA</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL PRICE</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">BROKER</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">DATE</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-[#c0922e]" size={32} />
                        <p className="text-[11px] font-bold text-slate-400">Loading listings...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-[11px] font-bold text-slate-400">
                      No listings found.
                    </td>
                  </tr>
                ) : filteredListings.map((listing) => (
                  <tr 
                    key={listing._id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                          listing.vertical === 'RESIDENTIAL' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-primary-50 text-primary-600 border-primary-100'
                        }`}>
                          {formatEnum(listing.vertical)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-900 whitespace-nowrap">{getStatusText(listing)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-bold border border-blue-100 whitespace-nowrap">
                        {formatEnum(listing.subType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-[120px]">
                        <p className="text-[11px] font-bold text-slate-900 leading-none mb-1 group-hover:text-[#c0922e] transition-colors">{listing.location}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{listing.project}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-900 whitespace-nowrap">{listing.size} {formatEnum(listing.sizeUnit)}</td>
                    <td className="px-6 py-4 text-[11px] font-bold text-emerald-600 whitespace-nowrap">
                      {listing.postType === 'AVAILABILITY' ? (
                        `₹${(listing.totalAmount || 0).toLocaleString('en-IN')}`
                      ) : (
                        `Budget: ₹${(listing.budgetMax || 0).toLocaleString('en-IN')}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-[100px]">
                        <p className="text-[10px] font-bold text-slate-900 whitespace-nowrap">
                          {listing.postedBy?.firstName} {listing.postedBy?.lastName}
                        </p>
                        <p className="text-[8px] text-slate-400 font-medium truncate max-w-[120px]">{listing.postedBy?.companyName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[9px] font-bold text-slate-400">{new Date(listing.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => handleEditClick(listing)}
                          className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-[9px] font-bold hover:bg-slate-50 transition-all"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setListingToDelete(listing._id)}
                          className="px-3 py-1 bg-[#7f1d1d] text-white rounded text-[9px] font-bold hover:bg-[#991b1b] transition-all"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="py-3.5 border-t border-slate-100 flex items-center justify-center gap-4 bg-slate-50/50">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#c8962a] hover:text-[#c8962a] disabled:opacity-20 disabled:cursor-not-allowed transition-all bg-white active:scale-95 shadow-sm"
              >
                <ChevronLeft size={14} />
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(totalPages)].map((_, i) => {
                  // Logic to show a reasonable number of page buttons instead of 100 buttons
                  // Show first, last, current, and +/- 2 pages around current
                  if (
                    i + 1 === 1 || 
                    i + 1 === totalPages || 
                    (i + 1 >= currentPage - 2 && i + 1 <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${currentPage === i + 1
                            ? 'bg-[#c8962a] text-white shadow-md shadow-[#c8962a]/20 scale-105 z-10'
                            : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300 active:scale-95'
                          }`}
                      >
                        {i + 1}
                      </button>
                    );
                  } else if (
                    i + 1 === currentPage - 3 || 
                    i + 1 === currentPage + 3
                  ) {
                    return <span key={i} className="text-slate-400 font-bold px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#c8962a] hover:text-[#c8962a] disabled:opacity-20 disabled:cursor-not-allowed transition-all bg-white active:scale-95 shadow-sm"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Dynamic Edit Listing Modal */}
      <PostListingModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingListing(null);
        }} 
        intent={editingListing?.intent || 'SALE'} 
        vertical={editingListing?.vertical || 'RESIDENTIAL'}
        posting={editingListing}
        onSuccess={fetchListings}
      />

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!listingToDelete} 
        onClose={() => setListingToDelete(null)}
        title="Confirm Delete"
        footer={(
          <div className="flex gap-3">
            <button 
              onClick={() => setListingToDelete(null)}
              className="px-5 py-2 rounded-lg border border-[#e4ded2] text-[#254063] text-[13px] font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteConfirm}
              className="px-5 py-2 rounded-lg bg-[#991b1b] text-white text-[13px] font-bold hover:bg-[#7f1d1d] transition-all"
            >
              Delete
            </button>
          </div>
        )}
      >
        <div className="pt-2 pb-4">
          <p className="text-[14px] text-[#718199] font-medium leading-relaxed">
            Are you sure you want to delete this listing? This cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Listings;
