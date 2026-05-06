import React from 'react';
import { X, Camera, Video, ChevronDown, Lock } from 'lucide-react';

const PostListingModal = ({ isOpen, onClose, intent = 'SALE', vertical = 'Residential' }) => {
  if (!isOpen) return null;

  const isRental = intent === 'RENT' || intent === 'LEASE' || intent === 'WANTED_LEASE';
  const isPurchase = intent === 'PURCHASE';
  const isWantedRent = intent === 'WANTED_RENT' || intent === 'WANTED_LEASE';
  const isRequirement = isPurchase || isWantedRent;
  const isWantedLease = intent === 'WANTED_LEASE';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif text-black">Add Listing</h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {intent === 'PURCHASE' ? 'Wanted on Purchase' : intent === 'WANTED_RENT' ? 'Wanted on Rent' : intent === 'WANTED_LEASE' ? 'Wanted on Lease' : intent === 'LEASE' ? 'Available for Lease' : isRental ? 'Available for Rental' : 'Available for Sale'} · {vertical}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {/* Category Section */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-black uppercase tracking-widest border-b border-slate-100 pb-1.5">Category</h3>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sub-type *</label>
              <div className="relative">
                <select className="w-full px-4 py-2 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700 outline-none appearance-none rounded-xl text-[12px] font-bold">
                  {vertical === 'Commercial' ? (
                    isRental || (intent === 'WANTED_LEASE') ? (
                      <>
                        <option>Shops/Showroom</option>
                        <option>Office</option>
                        <option>Standalone Building</option>
                      </>
                    ) : (
                      <>
                        <option>Retail Shops/Showroom</option>
                        <option>Office</option>
                        <option>Warehouse</option>
                        <option>Standalone Building</option>
                        <option>Plot</option>
                      </>
                    )
                  ) : (
                    <>
                      <option>Apartments</option>
                      <option>Low Rise Floors</option>
                      <option>Kothi/Villas</option>
                      <option>Plots</option>
                    </>
                  )}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-black uppercase tracking-widest border-b border-slate-100 pb-1.5">Property Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Location / Area *</label>
                <input type="text" placeholder="Sector, locality, area..." className="w-full px-4 py-2 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700 placeholder:text-slate-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">City</label>
                <div className="space-y-1">
                  <input type="text" value="Delhi" disabled className="w-full px-4 py-2 bg-slate-100/50 border border-slate-100 rounded-xl text-[12px] font-medium text-slate-400 outline-none" />
                  <div className="flex items-center gap-1 text-[9px] text-primary-600 font-bold">
                    <Lock size={10} /> Auto-filled from profile
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project / Society</label>
                <input type="text" placeholder="Project or Society name" className="w-full px-4 py-2 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700 placeholder:text-slate-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bedrooms</label>
                <div className="relative">
                  <select className="w-full px-4 py-2 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700">
                    <option>1 BHK</option>
                    <option>2 BHK</option>
                    <option>3 BHK</option>
                    <option>4 BHK</option>
                    <option>5 BHK</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Area Section */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-black uppercase tracking-widest border-b border-slate-100 pb-1.5">Area</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Area / Size</label>
                <input type="text" placeholder="e.g. 1200" className="w-full px-4 py-2 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700 placeholder:text-slate-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unit</label>
                <div className="relative">
                  <select className="w-full px-4 py-2 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700">
                    <option>Sq.Ft</option>
                    <option>Sq.Yd</option>
                    <option>Sq.Mt</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing/Budget Section */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-black uppercase tracking-widest border-b border-slate-100 pb-1.5">
              {isRequirement ? 'Budget' : 'Pricing'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{isRequirement ? 'Budget Type' : 'Price Type'}</label>
                <div className="relative">
                  <select className="w-full px-4 py-2 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700 outline-none appearance-none rounded-xl text-[12px] font-bold">
                    <option>Per Sq.Ft / Sq.Yd / Sq.Mt</option>
                    <option>Lumpsum Amount</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{isRequirement ? 'Budget Rate (₹)' : 'Rate / Price (₹)'}</label>
                <input 
                  type="text" 
                  placeholder="e.g. 5500" 
                  className="w-full px-4 py-2 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700 rounded-xl text-[12px] font-medium outline-none placeholder:text-slate-600" 
                />
              </div>
            </div>
            
            {/* Total Display */}
            <div className="p-3 bg-[#fdf8f3] rounded-xl border border-[#c8962a]/10 space-y-1.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {isRequirement ? 'Calculated Total Budget' : 'Calculated Total Price'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-serif text-black">—</span>
              </div>
              <p className="text-[8px] text-slate-400 italic">Enter area and rate above</p>
            </div>
          </div>

          {/* Status Section - Hide for Purchase */}
          {!isRequirement && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-black text-black uppercase tracking-widest border-b border-slate-100 pb-1.5">Status</h3>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Property Status</label>
                <div className="relative">
                  <select className="w-full px-4 py-2 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700 outline-none appearance-none rounded-xl text-[12px] font-bold">
                    <option>Ready to Move</option>
                    <option>Under Construction</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Rent Section */}
          {isRental && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <h3 className="text-[11px] font-black text-black uppercase tracking-widest border-b border-slate-100 pb-1.5">Rent / Lease Amount</h3>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Monthly Rent / Lease (₹)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 45000" 
                  className="w-full px-4 py-2 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700 rounded-xl text-[12px] font-medium outline-none placeholder:text-slate-600" 
                />
              </div>
            </div>
          )}

          {/* Media Section - Hide for Purchase */}
          {!isRequirement && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-black text-black uppercase tracking-widest border-b border-slate-100 pb-1.5">Media</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Photos (JPG/PNG)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg py-8 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#3b82f6] transition-all">
                      <Camera size={20} />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-900 uppercase">Click to upload photos</p>
                      <p className="text-[8px] text-slate-400 mt-0.5 uppercase tracking-widest">JPG, PNG — multiple allowed</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Videos (MP4/MOV)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg py-8 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#3b82f6] transition-all">
                      <Video size={20} />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-900 uppercase">Click to upload videos</p>
                      <p className="text-[8px] text-slate-400 mt-0.5 uppercase tracking-widest">MP4, MOV — multiple allowed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Remarks Section */}
          <div className="space-y-4 pb-4">
            <h3 className="text-[10px] font-black text-black uppercase tracking-widest border-b border-slate-100 pb-2">Remarks</h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes / Additional Info</label>
              <textarea 
                placeholder="Any extra details..." 
                className="w-full px-4 py-3 bg-[#fefce8] border border-slate-200 focus:border-[#eab308]/40 transition-all text-slate-700 h-24 resize-none rounded-xl text-[12px] font-medium outline-none placeholder:text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-end gap-3 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button 
            className="px-6 py-2.5 bg-[#c8962a] hover:bg-[#B48C35] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#c8962a]/20 transition-all"
          >
            Save Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostListingModal;
