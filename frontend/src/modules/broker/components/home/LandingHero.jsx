import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Lock, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RegisterModal from './RegisterModal';
import { getPostings } from '../../services/postingService';

const InventoryItem = ({ label, type, title, subtitle, details, price, color }) => (
  <div className="p-3 border border-slate-300 rounded-lg bg-white transition-all cursor-default">
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <div className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide h-fit transition-colors ${color}`}>
          {label}
        </div>
        <div className="space-y-0.5">
          <p className="text-[8px] text-slate-400 font-medium uppercase tracking-tight">{type}</p>
          <h4 className="text-xs font-bold text-slate-900 transition-colors">{title}</h4>
          <p className="text-[9px] text-slate-500">{subtitle} • {details}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-[#c8962a]">{price}</p>
      </div>
    </div>
  </div>
);

const LandingHero = ({ onRegisterClick, config }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestListings = async () => {
      try {
        const response = await getPostings({ limit: 4, page: 1 });
        if (response.success) {
          setListings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch hero listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestListings();
  }, []);

  const getLabelInfo = (item) => {
    if (item.postType === 'REQUIREMENT') {
      return { label: 'Wanted', color: 'bg-indigo-50 text-indigo-600' };
    }

    switch (item.intent) {
      case 'SALE':
        return { label: 'For Sale', color: 'bg-emerald-50 text-emerald-600' };
      case 'RENT':
        return { label: 'For Rent', color: 'bg-blue-50 text-blue-600' };
      case 'LEASE':
        return { label: 'For Lease', color: 'bg-purple-50 text-purple-600' };
      default:
        return { label: 'Listing', color: 'bg-slate-50 text-slate-600' };
    }
  };

  return (
    <>
      <section className="relative px-6 lg:px-20 pt-12 pb-16 lg:pt-16 lg:pb-24 bg-[#FAF9F6] overflow-hidden">
        {/* Decorative Blur Background */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#c8962a]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Text Content */}
          <div className="space-y-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c8962a] animate-pulse" />
                <span className="text-[10px] font-bold text-[#c8962a] uppercase tracking-widest">{config?.badge || 'Live Inventory Search'}</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-serif font-semibold text-[#1A1A1A] leading-[1.3] tracking-tight">
                {config?.titlePart1 || "India's Most Trusted"} <br />
                <span className="italic text-[#c8962a]">{config?.titleHighlight || "Broker-to-Broker"}</span> <br />
                {config?.titlePart2 || "Inventory Platform"}
              </h1>

              <p className="text-sm font-poppins text-slate-600 leading-loose max-w-xl">
                A private, verified community where professional real estate brokers <br /> share live inventory and requirements — deal directly with each other. <br />
                No commission. No middlemen. No charges.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 mb-8">
              <button
                onClick={onRegisterClick || (() => setIsRegisterModalOpen(true))}
                className="px-5 py-3 rounded-lg bg-[#c8962a] text-white font-bold text-xs hover:bg-[#b08425] transition-all shadow-2xl shadow-[#c8962a]/40 flex items-center gap-3 group active:scale-95"
              >
                Register as Broker
              </button>
              <button
                onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-5 py-3 rounded-lg bg-slate-50/50 border border-[#1e3a5f] text-[#1e3a5f] font-bold text-xs hover:bg-[#1e3a5f] hover:text-white transition-all active:scale-95"
              >
                Browse Inventory
              </button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-8 border-t border-slate-200">
              {[
                { label: 'Live Listings', value: '45' },
                { label: 'Verified Brokers', value: '17' },
                { label: 'Brokerage Charged', value: '₹0' },
                { label: 'Direct Deals', value: '100%' }
              ].map((stat, idx) => (
                <div key={idx}>
                  <p className="text-2xl font-serif font-semibold text-[#1a365d]">{stat.value}</p>
                  <p className="text-[10px] font-normal text-slate-500 mt-0">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Inventory Preview Card */}
          <div className="relative z-10">
            <div className="bg-white rounded-xl p-4 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-slate-300 min-h-[400px]">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[11px] font-normal text-[#abb4be] uppercase tracking-[0.1em]">Live Inventory Preview</h3>
                <div className="flex items-center gap-0.5 px-1.5 py-0 bg-[#E8F5E9] rounded-full border border-emerald-200">
                  <Check size={6} className="text-emerald-800" />
                  <span className="text-[7px] font-bold text-emerald-900 uppercase tracking-wider">Verified Network</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-20">
                    <Loader2 className="animate-spin text-[#c8962a]" size={32} />
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Updating Feed...</p>
                  </div>
                ) : listings.length > 0 ? (
                  listings.map((item, index) => {
                    let { label, color } = getLabelInfo(item);
                    if (index === 1) {
                      color = 'bg-red-50 text-[#c44552] shadow-sm shadow-[#c44552]/40';
                    }
                    return (
                      <InventoryItem
                        key={item._id}
                        label={label}
                        type={`${item.vertical} • ${item.subType?.replace('_', ' ')}`}
                        title={item.project || 'Premium Property'}
                        subtitle={item.location}
                        details={item.size ? `${item.size} ${item.sizeUnit}` : 'Ref: #' + item._id.slice(-6).toUpperCase()}
                        price={item.postType === 'REQUIREMENT'
                          ? `₹${item.budgetMax} ${item.budgetUnit}`
                          : item.totalAmount ? `₹${item.totalAmount} ${item.totalAmountUnit}` : 'On Request'
                        }
                        color={color}
                      />
                    );
                  })
                ) : (
                  <div className="text-center py-20">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No live data</p>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Element 1 */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#c8962a]/10 rounded-full blur-2xl animate-pulse" />
            {/* Floating Element 2 */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-slate-200 rounded-full blur-3xl opacity-50" />
          </div>
        </div>
        {/* Bottom Features Bar */}
        <div className="absolute lg:absolute bottom-0 left-0 right-0 bg-[#1a365d] py-3 lg:py-4">
          <div className="max-w-[1300px] mx-auto px-6 flex items-center lg:justify-center gap-x-8 lg:gap-x-10 gap-y-3 overflow-x-auto no-scrollbar whitespace-nowrap">
            <div className="flex items-center gap-2 shrink-0">
              <Check size={14} className="text-[#c8962a]" strokeWidth={3} />
              <span className="text-[#abb4be] text-[11px] lg:text-[12px] font-semibold uppercase tracking-wider">Verified Brokers Only</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Lock size={12} className="text-[#c8962a]" fill="#c8962a" />
              <span className="text-[#abb4be] text-[11px] lg:text-[12px] font-semibold uppercase tracking-wider">No Brokerage Charged</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Zap size={12} className="text-[#c8962a]" fill="#c8962a" />
              <span className="text-[#abb4be] text-[11px] lg:text-[12px] font-semibold uppercase tracking-wider">Direct Broker Deals</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[12px] lg:text-[14px]">🏙️</span>
              <span className="text-[#abb4be] text-[11px] lg:text-[12px] font-semibold uppercase tracking-wider">NCR • Delhi • Noida</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[12px] lg:text-[14px]">📋</span>
              <span className="text-[#abb4be] text-[11px] lg:text-[12px] font-semibold uppercase tracking-wider">Genuine Inventory Only</span>
            </div>
          </div>
        </div>
      </section>
      {isRegisterModalOpen && (
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      )}
    </>
  );
};

export default LandingHero;
