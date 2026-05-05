import React from 'react';
import { Check, ArrowRight, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const InventoryItem = ({ label, type, title, subtitle, details, price, color }) => (
  <div className="p-3 border border-slate-200 rounded-2xl bg-white">
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider h-fit ${color}`}>
          {label}
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">{type}</p>
          <h4 className="text-xs font-bold text-slate-900">{title}</h4>
          <p className="text-[9px] text-slate-500">{subtitle} • {details}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-[#C59D3F]">{price}</p>
      </div>
    </div>
  </div>
);

const LandingHero = () => {
  return (
    <section className="relative px-6 lg:px-20 pt-12 pb-16 lg:pt-16 lg:pb-24 bg-[#FAF9F6] overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#C59D3F]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Text Content */}
        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#C59D3F] animate-pulse" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Live Inventory Search</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-serif font-bold text-[#1A1A1A] leading-[1.2] tracking-tight">
            India's Most Trusted <br />
            <span className="italic text-[#C59D3F]">Broker-to-Broker</span> <br />
            Inventory Platform
          </h1>

          <p className="text-sm font-poppins text-slate-600 leading-relaxed max-w-xl">
            A private, verified community where professional real estate brokers share live inventory and requirements — deal directly with each other. <br />
            <span className="text-slate-600">No commission. No middlemen. No charges.</span>
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/register">
              <button className="px-4 py-3 rounded-xl bg-[#C59D3F] text-white font-bold text-xs hover:bg-[#B08A35] transition-all shadow-xl shadow-[#C59D3F]/20 flex items-center gap-3 group">
                Register as Broker
              </button>
            </Link>
            <a href="/#inventory">
              <button className="px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-900 font-bold text-xs hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                Browse Inventory
              </button>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 pt-14 border-t border-slate-200">
            <div>
              <p className="text-2xl font-serif font-bold text-[#1a365d]">42</p>
              <p className="text-[10px] font-medium text-slate-500 mt-0">Live Listings</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-[#1a365d]">15</p>
              <p className="text-[10px] font-medium text-slate-500 mt-0">Verified Brokers</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-[#1a365d]">₹0</p>
              <p className="text-[10px] font-medium text-slate-500 mt-0">Brokerage Charged</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-[#1a365d]">100%</p>
              <p className="text-[10px] font-medium text-slate-500 mt-0">Direct Deals</p>
            </div>
          </div>
        </div>

        {/* Right Side: Inventory Preview Card */}
        <div className="relative z-10">
          <div className="bg-white rounded-3xl p-4 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-slate-100">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Inventory Preview</h3>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#E8F5E9] rounded-full border border-emerald-100">
                <Check size={10} className="text-emerald-600" />
                <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Verified Network</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <InventoryItem 
                label="For Sale"
                type="Residential • Apartment"
                title="3 BHK — Sector 62, Noida"
                subtitle="Supertech Eco Village"
                details="1,200 sqft"
                price="₹66 L"
                color="bg-emerald-50 text-emerald-600"
              />
              <InventoryItem 
                label="Wanted"
                type="Commercial • Office"
                title="Office Space — Cyber City, Gurugram"
                subtitle="2,200 sqft"
                details="Budget ₹2.6 Cr"
                price="₹2.6 Cr"
                color="bg-orange-50 text-orange-600"
              />
              <InventoryItem 
                label="For Rent"
                type="Residential • Kothi/Villa"
                title="5 BHK Villa — Golf Course Rd"
                subtitle="Emaar Palm Hills"
                details="3,500 sqft"
                price="₹1.2L/mo"
                color="bg-blue-50 text-blue-600"
              />
              <InventoryItem 
                label="For Lease"
                type="Commercial • Showroom"
                title="Ground Floor — Connaught Place"
                subtitle="600 sqft"
                details="Prime Location"
                price="₹65K/mo"
                color="bg-purple-50 text-purple-600"
              />
            </div>
          </div>

          {/* Floating Element 1 */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#C59D3F]/10 rounded-full blur-2xl animate-pulse" />
          {/* Floating Element 2 */}
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-slate-200 rounded-full blur-3xl opacity-50" />
        </div>
      </div>
      {/* Bottom Features Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a365d] py-4">
        <div className="max-w-[1300px] mx-auto px-6 flex flex-wrap justify-center gap-x-10 gap-y-3">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-[#C59D3F]" strokeWidth={3} />
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">Verified Brokers Only</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-[#C59D3F]" fill="#C59D3F" />
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">No Brokerage Charged</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-[#C59D3F]" fill="#C59D3F" />
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">Direct Broker-to-Broker Deals</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[14px]">🏙️</span>
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">NCR • Delhi • Noida • Gurugram</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[14px]">📋</span>
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">Genuine Inventory Only</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
