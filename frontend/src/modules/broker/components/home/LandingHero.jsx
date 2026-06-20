import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Lock, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RegisterModal from './RegisterModal';
import { getPostings } from '../../services/postingService';

const formatNum = (num) => new Intl.NumberFormat('en-IN').format(num);

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
      {/* ── MOBILE LANDING HERO ── */}
      <section className="md:hidden" style={{ background: '#0d1520', padding: '30px 20px 40px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blur */}
        <div style={{ position: 'absolute', top: '10%', right: '-20%', width: 200, height: 200, background: 'rgba(200,150,42,0.15)', borderRadius: '50%', filter: 'blur(50px)' }} />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 10px', fontSize: 10, fontWeight: 600, color: '#e8b84b', marginBottom: 16 }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8962a] animate-pulse" />
            <span>{config?.badge || 'Live Inventory Search'}</span>
          </div>
          
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, lineHeight: 1.2, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            {config?.titlePart1 || "India's Most Trusted"}<br/>
            <span style={{ color: '#e8b84b', fontStyle: 'italic' }}>{config?.titleHighlight || "Broker-to-Broker"}</span><br/>
            {config?.titlePart2 || "Inventory Platform"}
          </h1>
          
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 20 }}>
            A private, verified community where professional real estate brokers share live inventory and requirements — deal directly with each other. <br />
            No commission. No middlemen. No charges.
          </p>
          
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onRegisterClick || (() => setIsRegisterModalOpen(true))} style={{ flex: 1, background: '#e8b84b', color: '#0d1520', border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>
              Register as Broker
            </button>
          </div>
        </div>
      </section>

      {/* ── DESKTOP LANDING HERO ── */}
      <div className="hidden md:block">
      <section className="relative px-6 lg:px-20 pt-12 pb-0 lg:pt-16 lg:pb-24 bg-[#FAF9F6] overflow-hidden">
        {/* Decorative Blur Background */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#c8962a]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Text Content */}
          <div className="space-y-4 relative z-10">
            <div className="space-y-2">
              <div
                className="inline-flex items-center"
                style={{
                  gap: '8px',
                  background: '#fff',
                  border: '1px solid #e4ded2',
                  borderRadius: '40px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#c8962a',
                  marginBottom: '20px'
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#c8962a] animate-pulse" />
                <span className="">{config?.badge || 'Live Inventory Search'}</span>
              </div>

              <h1 className="text-[#1A1A1A]" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(30px, 3.5vw, 48px)",
                lineHeight: "1.15",
                fontWeight: "700",
                marginBottom: "18px"
              }}>
                {config?.titlePart1 || "India's Most Trusted"} <br />
                <span className="italic text-[#c8962a]">{config?.titleHighlight || "Broker-to-Broker"}</span> <br />
                {config?.titlePart2 || "Inventory Platform"}
              </h1>

              <p
                style={{
                  fontSize: '15px',
                  color: '#6e7d90',
                  maxWidth: '480px',
                  lineHeight: '1.75',
                  marginBottom: '24px'
                }}
                className="font-poppins w-full"
              >
                A private, verified community where professional real estate brokers share live inventory and requirements — deal directly with each other. <br className="hidden md:inline" />
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


          </div>

          {/* Right Side: Inventory Preview Card */}
          <div className="relative z-10 hidden lg:block">
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
                          ? (item.budgetMax ? `₹${formatNum(item.budgetMax)}` : '₹ 0')
                          : (item.totalAmount ? `₹${formatNum(item.totalAmount)}` : '₹ 0')
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
        <div className="relative -mx-6 mt-12 lg:mx-0 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:mt-0 bg-[#1a365d] py-3 lg:py-4">
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              gap: '32px',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
            className="px-6"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '13px',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '400'
              }}
              className="shrink-0 tracking-wider"
            >
              <Check size={14} className="text-[#c8962a]" strokeWidth={3} />
              <span>Verified Brokers Only</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '13px',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '400'
              }}
              className="shrink-0 tracking-wider"
            >
              <Lock size={12} className="text-[#c8962a]" fill="#c8962a" />
              <span>No Brokerage Charged</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '13px',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '400'
              }}
              className="shrink-0 tracking-wider"
            >
              <Zap size={12} className="text-[#c8962a]" fill="#c8962a" />
              <span>Direct Broker Deals</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '13px',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '400'
              }}
              className="shrink-0 tracking-wider"
            >
              <span className="text-[14px]">🏙️</span>
              <span>NCR • Delhi • Noida</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '13px',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '400'
              }}
              className="shrink-0 tracking-wider"
            >
              <span className="text-[14px]">📋</span>
              <span>Genuine Inventory Only</span>
            </div>
          </div>
        </div>
      </section>
      </div>
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
