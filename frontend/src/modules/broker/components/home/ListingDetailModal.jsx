import React from 'react';
import { X, MapPin, Bed, Square, ShieldCheck, ChevronRight, Lock, Ruler, Tag, Home, ArrowRight } from 'lucide-react';

const ListingDetailModal = ({ isOpen, onClose, item, isAuthenticated, onLogin }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card - Cinematic Banner Style */}
      <div className="relative w-full max-w-[800px] max-h-[90vh] bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 overflow-hidden flex flex-col border border-slate-100">
        
        {/* Cinematic Image Banner */}
        <div className="h-[220px] md:h-[260px] relative w-full flex-shrink-0 group">
          <img 
            src={item.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200"} 
            alt={item.project} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Top Header Controls */}
          <div className="absolute top-6 left-6 flex gap-2">
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${
              item.postType === 'AVAILABILITY' ? 'bg-emerald-500 text-white' : 'bg-[#1e3a8a] text-white'
            }`}>
              {item.postType === 'AVAILABILITY' ? 'Selling' : 'Wanted'}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#1e3a8a] shadow-lg text-[9px] font-black uppercase tracking-widest">
              {item.vertical}
            </span>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 transition-all border border-white/20 shadow-xl"
          >
            <X size={20} />
          </button>

          {/* Overlapping Info Section */}
          <div className="absolute -bottom-1 left-0 w-full px-10 pb-6 flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.intent?.includes('SALE') ? 'bg-orange-500' : 'bg-blue-400'} animate-pulse`} />
                <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">
                  {item.intent?.replace('_', ' ')} · {item.subType?.replace('_', ' ')}
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-white leading-tight tracking-tight drop-shadow-md">
                {item.project || 'Premium Listing'}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-10 pt-8 space-y-8 overflow-y-auto scrollbar-hide bg-[#FAF9F6]/30">
          
          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-[#c8962a] transition-all">
              <Ruler size={20} className="text-[#c8962a] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Size</p>
              <p className="font-black text-[#0f172a] text-sm">{item.size} {item.sizeUnit}</p>
            </div>
            {item.bedrooms && (
              <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-[#c8962a] transition-all">
                <Bed size={20} className="text-[#c8962a] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Accommodation</p>
                <p className="font-black text-[#0f172a] text-sm">{item.bedrooms} BHK</p>
              </div>
            )}
            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-[#c8962a] transition-all">
              <Home size={20} className="text-[#c8962a] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Vertical</p>
              <p className="font-black text-[#0f172a] text-sm uppercase">{item.vertical.toLowerCase()}</p>
            </div>
            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-[#c8962a] transition-all">
              <MapPin size={20} className="text-[#c8962a] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
              <p className="font-black text-[#0f172a] text-[10px] line-clamp-1">{item.location}</p>
            </div>
          </div>

          {/* Pricing & Verification */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm gap-6">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-[#1e3a8a] uppercase tracking-[0.2em]">
                {item.postType === 'REQUIREMENT' ? 'Investment Target' : 'Current Valuation'}
              </p>
              <p className="text-4xl font-serif font-black text-[#0f172a] tracking-tighter">
                {item.postType === 'REQUIREMENT' 
                  ? `₹${item.budgetMin}-${item.budgetMax} ${item.budgetUnit}`
                  : item.totalAmount ? `₹${item.totalAmount} ${item.totalAmountUnit}` : 'On Request'
                }
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                <ShieldCheck size={14} />
                Verified Asset
              </div>
              <p className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">REF: #{item._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>

          {/* Call to Actions / Protected Area */}
          <div className="pt-2 pb-2">
            {isAuthenticated ? (
              <a 
                href={`/property/${item._id}`}
                className="w-full py-5 bg-[#0f172a] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-[#c8962a] transition-all shadow-xl shadow-[#0f172a]/20 group"
              >
                Access Detailed Inventory View
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50 border-2 border-dashed border-slate-200 text-center space-y-6 relative group overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:20px_20px]" />
                
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-[#c8962a] shadow-xl border border-slate-100 group-hover:rotate-6 transition-transform">
                  <Lock size={28} />
                </div>
                <div className="space-y-2 relative z-10">
                  <h4 className="text-sm font-black text-[#1e3a8a] uppercase tracking-[0.3em]">Broker Connectivity Protected</h4>
                  <p className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-[340px] mx-auto uppercase tracking-tight">
                    This is a secure networking platform. Please login or register to access verified broker contact details and property specifics.
                  </p>
                </div>
                <button 
                  onClick={onLogin}
                  className="w-full max-w-[300px] py-4 bg-[#c8962a] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#b08425] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#c8962a]/20"
                >
                  Join the Network to Connect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailModal;

