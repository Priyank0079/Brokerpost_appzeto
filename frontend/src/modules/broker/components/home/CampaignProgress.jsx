import React from 'react';
import { Target, Users, Building2, Flame } from 'lucide-react';

const CampaignProgress = ({ data }) => {
  if (!data) return null;

  const { title, subtitle, brokersCurrent, brokersTotal, listingsCurrent, listingsTotal } = data;
  
  const brokerPercent = (brokersCurrent / brokersTotal) * 100;
  const listingPercent = (listingsCurrent / listingsTotal) * 100;

  return (
    <section className="py-24 px-6 bg-slate-50/50">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden bg-white rounded-[3rem] border border-slate-200/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] p-8 md:p-16 text-center">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />

          <div className="relative space-y-12">
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 mb-2">
                <Target size={16} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{data.badgeText || "Growth Milestone"}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                {title || "Platform Velocity"}
              </h2>
              <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                {subtitle || "Tracking our journey towards the network effect. Be part of the ecosystem that's redefining broker collaboration."}
              </p>
            </div>

            {/* Progress Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Brokers Progress */}
              <div className="space-y-4 text-left">
                <div className="flex items-end justify-between px-1">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                      <Users size={14} className="text-primary-500" /> Professional Network
                    </p>
                    <h4 className="text-2xl font-black text-slate-900">{brokersCurrent} <span className="text-slate-300 font-medium">/ {brokersTotal}</span></h4>
                  </div>
                  <span className="text-sm font-black text-primary-600">{Math.round(brokerPercent)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${brokerPercent}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 italic">Verified Brokers Joined</p>
              </div>

              {/* Listings Progress */}
              <div className="space-y-4 text-left">
                <div className="flex items-end justify-between px-1">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                      <Building2 size={14} className="text-emerald-500" /> Inventory Depth
                    </p>
                    <h4 className="text-2xl font-black text-slate-900">{listingsCurrent} <span className="text-slate-300 font-medium">/ {listingsTotal}</span></h4>
                  </div>
                  <span className="text-sm font-black text-emerald-600">{Math.round(listingPercent)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${listingPercent}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 italic">Exclusive Properties Listed</p>
              </div>
            </div>

            {/* CTA / Callout */}
            <div className="pt-6 border-t border-slate-100 max-w-2xl mx-auto">
               <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-3 bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100">
                     <Flame size={20} className="text-amber-500 fill-amber-500" />
                     <p className="text-sm md:text-base font-black text-amber-900 uppercase tracking-tight">
                        Only <span className="text-amber-600">{brokersTotal - brokersCurrent}</span> more brokers needed for <span className="underline decoration-2 underline-offset-4">CRITICAL MASS</span>
                     </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-slate-900 tracking-tight">{data.footerTitle || "Join now and secure your status as a Founding Member."}</p>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">{data.footerSubtitle || "Early access ends once milestones are achieved."}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignProgress;
