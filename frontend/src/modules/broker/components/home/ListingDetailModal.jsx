import React from 'react';
import { X, Ruler, Phone, MessageCircle, Lock } from 'lucide-react';

const formatNum = (num) => new Intl.NumberFormat('en-IN').format(num);

const renderStatusBadge = (listing) => {
  if (!listing.constructionStatus) return null;
  const isReady = listing.constructionStatus === 'READY' || listing.constructionStatus === 'Ready to Move';
  const label = isReady ? 'Ready to Move' : 'Under Construction';
  const bg = isReady ? 'bg-[#ecfdf5] text-[#047857]' : 'bg-[#fffbeb] text-[#b45309]';
  return (
    <span className={`px-3 py-1.5 text-[13px] font-semibold rounded-md ${bg}`}>
      {label}
    </span>
  );
};

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

const ListingDetailModal = ({ isOpen, onClose, item, isAuthenticated, user, onLogin }) => {
  if (!isOpen || !item) return null;

  const brokerName = item.postedBy?.name || `${item.postedBy?.firstName || ''} ${item.postedBy?.lastName || ''}`.trim() || 'Broker Name';
  const companyName = item.postedBy?.companyName || 'Company';
  const operatingCity = item.postedBy?.operatingCity || 'City';
  const phoneNumber = item.postedBy?.phoneNumber || '';

  const refCode = item._id ? item._id.toString().slice(-6).toUpperCase() : '';
  const subTypeDisplay = item.subType?.replace(/_/g, ' ') || 'Property';
  const intentDisplay = renderListingType(item);
  
  const currentUserName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || '';
  const currentUserCompany = user?.companyName || '';
  const currentUserPhone = user?.phoneNumber || '';
  
  const whatsappMsg = `Hi ${brokerName}, saw your listing (ID: ${refCode}) on BrokersLink- ${subTypeDisplay} ${intentDisplay} at ${item.location}. Would like to discuss. ${currentUserName} ${currentUserCompany} ${currentUserPhone}`.replace(/\s+/g, ' ').trim();

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
        <div className="pt-[14px] px-[18px] pb-[10px] border-b border-slate-200 sticky top-0 bg-white z-[5] flex justify-between items-start">
          <div>
            <h2 className="text-[17px] font-serif text-[#1a365d] mb-1 leading-tight tracking-tight">Connect with Broker</h2>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              {renderListingType(item)} · {item.subType?.replace(/_/g, ' ') || 'Apartments'} · {item.location}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f4ebe1] text-slate-500 hover:bg-[#ebdccc] transition-colors mt-0.5"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-[12px] px-[18px] space-y-[12px]">
          
          {/* LISTING SUMMARY */}
          <div className="bg-[#f2eee3] rounded-[8px] p-[10px] border border-[#e5ddcf]">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">LISTING SUMMARY</p>
            
            <h3 className="text-[14px] font-bold text-[#0f172a] mb-0.5">
              {item.subType?.replace(/_/g, ' ') || 'Apartments'} · {item.location}
            </h3>
            <p className="text-[11px] text-slate-500 mb-3 font-medium">{item.project}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {item.size && (
                <span className="px-2 py-1 bg-[#f8fafc] text-[#334155] text-[10px] font-semibold rounded-md flex items-center gap-1">
                  <Ruler size={10} className="text-slate-400" />
                  {item.size} {item.sizeUnit?.replace(/_/g, ' ')}
                </span>
              )}
              {item.bedrooms && (
                <span className="px-2 py-1 bg-[#eff6ff] text-[#2563eb] text-[10px] font-semibold rounded-md">
                  {item.bedrooms} BHK
                </span>
              )}
              <span className="px-2 py-1 bg-[#dcfce7] text-[#059669] text-[10px] font-semibold rounded-md">
                {item.postType === 'REQUIREMENT'
                  ? (item.budgetMin && item.budgetMax ? `₹ ${formatNum(item.budgetMin)} – ${formatNum(item.budgetMax)}` : '₹ On Request')
                  : (item.totalAmount ? `₹ ${formatNum(item.totalAmount)}` : '₹ On Request')
                }
              </span>
              {renderStatusBadge(item)}
            </div>

            {/* Description */}
            <div className="bg-white p-2.5 rounded-[6px] text-[11px] font-medium text-[#334155] border border-[#e5ddcf] border-l-[3px] border-l-[#c8962a] shadow-sm leading-relaxed">
              {item.shortDescription
                ? item.shortDescription
                : `${item.subType?.replace(/_/g, ' ') || 'Property'} ${renderListingType(item).toLowerCase()} in ${item.location}${item.project ? `, ${item.project}` : ''}. ${item.size ? `Area: ${item.size} ${item.sizeUnit?.replace(/_/g, ' ')}.` : ''} Contact the broker for more details.`
              }
            </div>
          </div>

          {/* LISTING BROKER */}
          <div className="bg-white rounded-[8px] p-[10px] border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">LISTING BROKER</p>
            
            <h3 className="text-[14px] font-bold text-[#0f172a] mb-0.5">
              {brokerName}
            </h3>
            <p className="text-[11px] text-slate-500 mb-3 font-medium">
              {companyName} · {operatingCity}
            </p>

            <div className="flex flex-row gap-2">
              <a 
                href={`https://wa.me/91${phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-[#25D366] text-white rounded-[6px] text-[11px] font-bold hover:bg-[#20bd5a] transition-all"
              >
                <MessageCircle size={13} fill="currentColor" stroke="none" /> WhatsApp
              </a>
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-[#eff6ff] text-[#2563eb] rounded-[6px] text-[11px] font-bold border border-[#bfdbfe] hover:bg-[#dbeafe] transition-all"
              >
                <Phone size={13} fill="currentColor" stroke="none" /> Call {phoneNumber}
              </a>
            </div>
          </div>

          {/* IMAGES SECTION */}
          {item.images && item.images.length > 0 && (
            <div className="bg-white rounded-[8px] p-[10px] border border-slate-200">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">PROPERTY IMAGES</p>
              <div className="flex gap-2 overflow-x-auto snap-x scrollbar-hide pb-1">
                {item.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Listing image ${idx + 1}`} 
                    className="w-24 h-16 object-cover rounded-lg snap-start border border-slate-200 flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-[18px] pb-[14px] flex justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-1.5 border border-[#1a365d] text-[#1a365d] text-[11px] font-bold rounded-[6px] hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ListingDetailModal;
