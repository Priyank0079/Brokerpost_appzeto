import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Edit2, Trash2, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../broker/services/api';
import Modal from '../../broker/components/ui/Modal';

const Listings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [editingListing, setEditingListing] = useState(null);

  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const postTypeFilter = queryParams.get('postType');
  const [formData, setFormData] = useState({
    subType: '',
    location: '',
    city: 'Gurugram',
    project: '',
    bedrooms: '',
    areaSize: '',
    unit: 'Sq.Ft',
    priceType: 'Sumpsum (Lump Sum)',
    ratePrice: '',
    propertyStatus: 'Ready to Move',
    monthlyRent: '',
    remarks: ''
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const endpoint = postTypeFilter ? `/postings?postType=${postTypeFilter}` : '/postings';
      const response = await api.get(endpoint);
      if (response.success) {
        setListings(response.data);
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
  }, [postTypeFilter]);

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

  const handleEditClick = (listing) => {
    setEditingListing(listing);
    setFormData({
      subType: listing.subType,
      location: listing.location,
      city: 'Gurugram',
      project: listing.building,
      bedrooms: '3 BHK',
      areaSize: listing.area,
      unit: listing.areaUnit,
      priceType: 'Sumpsum (Lump Sum)',
      ratePrice: listing.price,
      propertyStatus: 'Ready to Move',
      monthlyRent: listing.status.includes('Rental') ? listing.price : '',
      remarks: 'Fully Furnished Apartment Open for all kind of Tenents'
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-6 md:space-y-8 pb-10">
        {/* Custom Header */}
        <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 mb-4 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <h1 className="text-base md:text-lg font-serif text-black">All Listings</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
              <input 
                type="text" 
                placeholder="Search listings..."
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
                ) : listings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-[11px] font-bold text-slate-400">
                      No listings found.
                    </td>
                  </tr>
                ) : listings.map((listing) => (
                  <tr 
                    key={listing._id} 
                    onClick={() => navigate(`/admin/listings/${listing._id}`)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                          listing.vertical === 'RESIDENTIAL' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-primary-50 text-primary-600 border-primary-100'
                        }`}>
                          {formatEnum(listing.vertical)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-900 italic whitespace-nowrap">{getStatusText(listing)}</span>
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
                        `₹${(listing.totalAmount || 0).toLocaleString()} ${formatEnum(listing.totalAmountUnit)}`
                      ) : (
                        `Budget: ₹${(listing.budgetMax || 0).toLocaleString()} ${formatEnum(listing.budgetUnit)}`
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
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Listing Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-[700px] bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-serif text-black">Edit Listing</h3>
                <p className="text-[10px] text-slate-400 font-medium">{editingListing?.status} - {editingListing?.section}</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
              {/* Category */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest">CATEGORY</label>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">SUB-TYPE *</label>
                  <select 
                    name="subType" value={formData.subType} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none appearance-none"
                  >
                    <option value="Apartments">Apartments</option>
                    <option value="Standalone Building">Standalone Building</option>
                  </select>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest">PROPERTY DETAILS</label>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">LOCATION / AREA *</label>
                    <input 
                      type="text" name="location" value={formData.location} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">CITY</label>
                    <div className="relative">
                      <input 
                        type="text" value={formData.city} readOnly
                        className="w-full px-4 py-2.5 bg-[#f1f5f9] border border-slate-200 rounded-xl text-[12px] font-medium outline-none text-slate-500 cursor-not-allowed"
                      />
                      <span className="absolute -bottom-4 left-0 text-[8px] text-slate-400">🔒 Auto-filled from profile</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">PROJECT / SOCIETY</label>
                    <input 
                      type="text" name="project" value={formData.project} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">BEDROOMS</label>
                    <select 
                      name="bedrooms" value={formData.bedrooms} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none appearance-none"
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Area */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest">AREA</label>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">AREA / SIZE</label>
                    <input 
                      type="text" name="areaSize" value={formData.areaSize} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">UNIT</label>
                    <select 
                      name="unit" value={formData.unit} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none appearance-none"
                    >
                      <option value="Sq.Ft">Sq.Ft</option>
                      <option value="Sq.Yd">Sq.Yd</option>
                      <option value="Sq.Mt">Sq.Mt</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest">PRICING</label>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">PRICE TYPE</label>
                    <select 
                      name="priceType" value={formData.priceType} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none appearance-none"
                    >
                      <option value="Sumpsum (Lump Sum)">Sumpsum (Lump Sum)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">RATE / PRICE (₹)</label>
                    <input 
                      type="text" name="ratePrice" value={formData.ratePrice} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Calculated Total Price Box */}
                <div className="p-4 bg-[#f5f1e8] rounded-xl border border-[#e5e0d4] space-y-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">CALCULATED TOTAL PRICE</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-serif font-bold text-black">₹ {parseInt(formData.ratePrice || 0).toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Lump sum price</p>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest">STATUS</label>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">PROPERTY STATUS</label>
                  <select 
                    name="propertyStatus" value={formData.propertyStatus} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none appearance-none"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>
              </div>

              {/* Rent amount */}
              {editingListing?.status.includes('Rental') && (
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest">RENT / LEASE AMOUNT</label>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">MONTHLY RENT / LEASE (₹)</label>
                    <input 
                      type="text" name="monthlyRent" value={formData.monthlyRent} onChange={handleInputChange}
                      placeholder="e.g. 45000"
                      className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Media */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest">MEDIA</label>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">PHOTOS (JPG/PNG)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl py-8 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      </div>
                      <p className="text-[11px] font-bold text-slate-900">Click to upload photos</p>
                      <p className="text-[9px] text-slate-400 font-medium">JPG, PNG — multiple allowed</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">VIDEOS (MP4/MOV)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl py-8 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
                      </div>
                      <p className="text-[11px] font-bold text-slate-900">Click to upload videos</p>
                      <p className="text-[9px] text-slate-400 font-medium">MP4, MOV — multiple allowed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest">REMARKS</label>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">NOTES / ADDITIONAL INFO</label>
                  <textarea 
                    name="remarks" value={formData.remarks} onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none resize-none"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 sticky bottom-0 bg-white pb-2 z-10 border-t border-slate-50 mt-4">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-8 py-2.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  className="px-8 py-2.5 rounded-lg bg-[#c0922e] text-white text-[11px] font-bold hover:bg-[#a67d26] transition-all shadow-lg shadow-[#c0922e]/20"
                >
                  Save Listing
                </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!listingToDelete} 
        onClose={() => setListingToDelete(null)}
        title="Confirm Deletion"
        footer={(
          <div className="flex gap-3">
            <button 
              onClick={() => setListingToDelete(null)}
              className="px-6 py-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteConfirm}
              className="px-6 py-2 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
            >
              Delete Posting
            </button>
          </div>
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Delete this listing?</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Are you sure you want to remove this posting from the platform? This action cannot be undone and the posting will no longer be visible to any brokers.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Listings;
