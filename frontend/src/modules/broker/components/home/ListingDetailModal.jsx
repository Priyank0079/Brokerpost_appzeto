import React from 'react';
import { X, Ruler, Phone, MessageCircle, Lock } from 'lucide-react';

const formatNum = (num) => new Intl.NumberFormat('en-IN').format(num);

const renderListingType = (item) => {
  const postType = item.postType;
  const intent = item.intent?.toUpperCase() || '';
  if (postType === 'REQUIREMENT') {
    if (intent === 'SALE' || intent === 'PURCHASE') return 'Wanted on Purchase';
    if (intent === 'RENT') return 'Wanted on Rent';
    if (intent === 'LEASE' || intent === 'WANTED_LEASE') return 'Wanted on Lease';
    return `Wanted on ${item.intent || 'Purchase'}`;
  } else {
    if (intent === 'SALE') return 'Available for Sale';
    if (intent === 'RENT') return 'Available for Rental';
    if (intent === 'LEASE') return 'Available for Lease';
    return `Available for ${item.intent || 'Sale'}`;
  }
};

const ListingDetailModal = ({ isOpen, onClose, item, isAuthenticated, onLogin }) => {
  if (!isOpen || !item) return null;

  const brokerName = item.postedBy?.name || `${item.postedBy?.firstName || ''} ${item.postedBy?.lastName || ''}`.trim() || 'Broker Name';
  const companyName = item.postedBy?.companyName || 'Company';
  const operatingCity = item.postedBy?.operatingCity || 'City';
  const phoneNumber = item.postedBy?.phoneNumber || '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[460px] sm:max-w-[540px] rounded-[16px] max-h-[92vh] lg:max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="pt-[22px] px-[26px] pb-[16px] border-b border-slate-200 sticky top-0 bg-white z-[5] flex justify-between items-start">
          <div>
            <h2 className="text-[26px] font-serif text-[#1a365d] mb-1.5 leading-tight tracking-tight">Connect with Broker</h2>
            <p className="text-[13px] text-slate-500 font-medium tracking-wide">
              {renderListingType(item)} · {item.subType?.replace('_', ' ') || 'Apartments'} · {item.location}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f4ebe1] text-slate-500 hover:bg-[#ebdccc] transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-[20px] px-[26px] space-y-[20px]">
          
          {/* LISTING SUMMARY */}
          <div className="bg-[#f2eee3] rounded-[10px] p-[12px] border border-[#e5ddcf]">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-4">LISTING SUMMARY</p>
            
            <h3 className="text-[17px] font-bold text-[#0f172a] mb-0.5">
              {item.subType?.replace('_', ' ') || 'Apartments'} · {item.location}
            </h3>
            <p className="text-[14px] text-slate-500 mb-5 font-medium">{item.project}</p>
            
            <div className="flex flex-wrap gap-2.5 mb-5">
              {item.size && (
                <span className="px-3 py-1.5 bg-[#f8fafc] text-[#334155] text-[13px] font-semibold rounded-md flex items-center gap-1.5">
                  <Ruler size={14} className="text-slate-400" />
                  {item.size} {item.sizeUnit?.replace('_', ' ')}
                </span>
              )}
              {item.bedrooms && (
                <span className="px-3 py-1.5 bg-[#eff6ff] text-[#2563eb] text-[13px] font-semibold rounded-md">
                  {item.bedrooms} BHK
                </span>
              )}
              <span className="px-3 py-1.5 bg-[#dcfce7] text-[#059669] text-[13px] font-semibold rounded-md">
                {item.postType === 'REQUIREMENT'
                  ? (item.budgetMin && item.budgetMax ? `₹ ${formatNum(item.budgetMin)} - ${formatNum(item.budgetMax)}` : '₹ 0')
                  : (item.totalAmount ? `₹ ${formatNum(item.totalAmount)}` : '₹ 0')
                }
              </span>
            </div>

            {item.shortDescription && (
              <div className="bg-white p-4 rounded-[8px] text-[13px] font-medium text-[#334155] border border-[#e5ddcf] border-l-[3px] border-l-[#c8962a] shadow-sm">
                {item.shortDescription}
              </div>
            )}
          </div>

          {/* LISTING BROKER */}
          <div className="bg-white rounded-[10px] p-[12px] border border-slate-200">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">LISTING BROKER</p>
            
            <h3 className="text-[17px] font-bold text-[#0f172a] mb-0.5">
              {brokerName}
            </h3>
            <p className="text-[14px] text-slate-500 mb-5 font-medium">
              {companyName} · {operatingCity}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href={`https://wa.me/91${phoneNumber?.replace(/\D/g, '')}?text=Hi, I am interested in your listing for ${item.project}`}
                target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#25D366] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#20bd5a] transition-all"
              >
                <MessageCircle size={18} fill="currentColor" stroke="none" /> WhatsApp
              </a>
              <a 
                href={`tel:${phoneNumber}`}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#eff6ff] text-[#2563eb] rounded-[8px] text-[14px] font-bold border border-[#bfdbfe] hover:bg-[#dbeafe] transition-all"
              >
                <Phone size={18} fill="currentColor" stroke="none" /> Call {phoneNumber}
              </a>
            </div>
          </div>

          {/* IMAGES SECTION */}
          {item.images && item.images.length > 0 && (
            <div className="bg-white rounded-[10px] p-[12px] border border-slate-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">PROPERTY IMAGES</p>
              <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide pb-2">
                {item.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Listing image ${idx + 1}`} 
                    className="w-32 h-24 object-cover rounded-lg snap-start border border-slate-200"
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-[26px] pb-[20px] flex justify-end">
          <button 
            onClick={onClose} 
            className="px-8 py-2.5 border border-[#1a365d] text-[#1a365d] text-sm font-bold rounded-[10px] hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ListingDetailModal;

