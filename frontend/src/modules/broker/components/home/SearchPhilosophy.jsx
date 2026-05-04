import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Zap, 
  Target, 
  Users, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const COLOR_MAP = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600', dot: 'bg-primary-500' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-500' }
};

const SearchPhilosophy = ({ data }) => {
  if (!data) return null;

  const { title, subtitle, features } = data;

  return (
    <section className="pt-2 pb-10 px-0 bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary-50/50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] -z-10" />

      <div className="w-full px-4 md:px-6">
        <div className="text-center space-y-3 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100"
          >
            <Sparkles className="text-primary-500" size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{data.badgeText || "The Network Philosophy"}</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight"
          >
            {title || "Search-Based. No Algorithm. Pure Matching."}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-slate-500 font-medium text-xs md:text-sm leading-relaxed"
          >
            {subtitle || "Unlike social media where posts get buried, Brokerspost is search-first. Connect directly with high-intent buyers without algorithmic interference."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
          {(features || []).map((feature, i) => {
            const icons = [<Zap size={20} />, <Target size={20} />, <Users size={20} />];
            const styles = COLOR_MAP[feature.color] || COLOR_MAP.primary;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 ${styles.bg} rounded-xl flex items-center justify-center ${styles.text} mb-5 group-hover:scale-105 transition-transform`}>
                  {icons[i % icons.length]}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">{feature.title}</h3>
                <ul className="space-y-2">
                  {(feature.desc || []).map((line, j) => (
                    <li key={j} className="flex items-start gap-2 text-slate-500 text-[12px] font-medium leading-tight">
                      <div className={`mt-1.5 w-1 h-1 rounded-full ${styles.dot} shrink-0`} />
                      {line}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* How it Works Section - High Density & Compact */}
        <div className="mt-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden border border-white/5 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-[80px]" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <h4 className="text-lg md:text-xl font-bold tracking-tight">{data.matchingTitle || "How Pure Matching Works"}</h4>
                <p className="text-slate-400 font-medium text-[13px] leading-relaxed max-w-md">
                  {data.matchingSubtitle || "Our system operates on high-intent search queries that connect inventory directly to demand without interference."}
                </p>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm w-fit">
                  <ShieldCheck className="text-primary-400 shrink-0" size={16} />
                  <p className="text-[10px] font-bold text-slate-300">{data.matchingBadge || "Guaranteed visibility for matching criteria."}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 text-primary-400 mb-3 font-bold text-[8px] uppercase tracking-widest">
                  <Search size={10} />
                  {data.liveNetworkQueryLabel || "Live Network Query"}
                </div>
                <div className="text-sm md:text-base font-bold text-white italic mb-1 leading-tight">
                   {data.liveNetworkQueryExample || "\"3 BHK + Sector 45 + Below ₹1.5 Cr\""}
                </div>
                <div className="w-6 h-[1px] bg-slate-700 my-2.5" />
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-[8px] uppercase tracking-widest mb-2">
                  <Zap size={10} />
                  {data.instantMatchLabel || "Instant Match"}
                </div>
                <div className="text-[11px] font-medium text-slate-400">
                  {data.instantMatchStats || "Found 12 properties from 8 verified brokers"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SearchPhilosophy;
