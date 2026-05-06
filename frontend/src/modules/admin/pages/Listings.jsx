import React, { useState } from 'react';
import { Search, ArrowLeft, Edit2, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Listings = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
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

  const platformListings = [
    { id: 1, section: 'Residential', status: 'Available for Rental', subType: 'Apartments', location: 'DLF-4', building: 'Ridgewood Estate', area: '1425', areaUnit: 'Sq.Ft', price: '85000', broker: 'Neeraj Jain', date: '5/5/2026' },
    { id: 2, section: 'Commercial', status: 'Available for Lease', subType: 'Standalone Building', location: 'Sector-8', building: 'IMT Manesar', area: '10000', areaUnit: 'Sq.Mt', price: '200000', broker: 'Neeraj Jain', date: '5/5/2026' },
    { id: 3, section: 'Commercial', status: 'Available for Lease', subType: 'Shops/Showroom', location: 'Sector-37', building: 'Pace City 2', area: '250', areaUnit: 'Sq.Mt', price: '200000', broker: 'Neeraj Jain', date: '5/5/2026' },
    { id: 4, section: 'Residential', status: 'Available for Sale', subType: 'Apartments', location: 'Sector-77', building: 'Emaar Palm Hills', area: '1450', areaUnit: 'Sq.Ft', price: '19000000', broker: 'Anirudh Panda', date: '4/5/2026' },
    { id: 5, section: 'Residential', status: 'Wanted on Rent', subType: 'Low Rise Floors', location: 'DLF-2', building: 'Builder Floor', area: '300', areaUnit: 'Sq.Yd', price: '130000', broker: 'Abhishek Jha', date: '4/5/2026' },
  ];

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

        {/* Title Section */}
        <div className="space-y-1 px-2 md:px-0">
          <h2 className="text-xl md:text-2xl font-serif text-black">All Platform Listings</h2>
          <p className="text-[10px] md:text-[11px] text-slate-400 font-medium tracking-tight">Admin view of all listings across all brokers</p>
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
                {platformListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                          listing.section === 'Residential' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-primary-50 text-primary-600 border-primary-100'
                        }`}>
                          {listing.section}
                        </span>
                        <span className="text-[10px] font-bold text-slate-900 italic whitespace-nowrap">{listing.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-bold border border-blue-100 whitespace-nowrap">
                        {listing.subType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-[120px]">
                        <p className="text-[11px] font-bold text-slate-900 leading-none mb-1">{listing.location}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{listing.building}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-900 whitespace-nowrap">{listing.area} {listing.areaUnit}</td>
                    <td className="px-6 py-4 text-[11px] font-bold text-emerald-600 whitespace-nowrap">₹{parseInt(listing.price).toLocaleString()}</td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-900 whitespace-nowrap">{listing.broker}</td>
                    <td className="px-6 py-4 text-[9px] font-bold text-slate-400">{listing.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => handleEditClick(listing)}
                          className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-[9px] font-bold hover:bg-slate-50 transition-all"
                        >
                          Edit
                        </button>
                        <button className="px-3 py-1 bg-[#7f1d1d] text-white rounded text-[9px] font-bold hover:bg-[#991b1b] transition-all">
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
                      <span className="absolute -bottom-4 left-0 text-[8px] text-slate-400 italic">🔒 Auto-filled from profile</span>
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
                  <p className="text-[10px] text-slate-400 font-medium italic">Lump sum price</p>
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
    </div>
  );
};

export default Listings;
