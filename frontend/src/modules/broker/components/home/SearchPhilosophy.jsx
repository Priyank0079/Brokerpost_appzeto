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

const SearchPhilosophy = () => {
  return (
    <section className="py-12 px-6 bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary-50/50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100"
          >
            <Sparkles className="text-primary-500" size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">The Network Philosophy</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight"
          >
            Search-Based. <span className="text-primary-600">No Algorithm.</span><br />
            Pure Matching.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-slate-500 font-medium text-xs md:text-sm leading-relaxed"
          >
            Unlike social media where posts get buried, Brokerspost is search-first. 
            Connect directly with high-intent buyers without algorithmic interference.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Zap size={20} />, title: 'Equal Visibility', color: 'primary', desc: ['No algorithm bias.', 'Every listing gets equal exposure.'] },
            { icon: <Target size={20} />, title: 'Match Probability', color: 'emerald', desc: ['More listings = Higher match rate.', 'Direct inventory-demand connection.'] },
            { icon: <Users size={20} />, title: 'Network Effect', color: 'blue', desc: ['Everyone wins as the network grows.', 'Power of a collective verified network.'] }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 bg-${feature.color}-50 rounded-xl flex items-center justify-center text-${feature.color}-600 mb-5 group-hover:scale-105 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">{feature.title}</h3>
              <ul className="space-y-2">
                {feature.desc.map((line, j) => (
                  <li key={j} className="flex items-start gap-2 text-slate-500 text-[12px] font-medium leading-tight">
                    <div className={`mt-1.5 w-1 h-1 rounded-full bg-${feature.color}-500 shrink-0`} />
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* How it Works Section - High Density & Compact */}
        <div className="mt-8">
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
                <h4 className="text-lg md:text-xl font-bold tracking-tight">How Pure Matching Works</h4>
                <p className="text-slate-400 font-medium text-[13px] leading-relaxed max-w-md">
                  Our system operates on high-intent search queries that connect inventory directly to demand without interference.
                </p>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm w-fit">
                  <ShieldCheck className="text-primary-400 shrink-0" size={16} />
                  <p className="text-[10px] font-bold text-slate-300">Guaranteed visibility for matching criteria.</p>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 text-primary-400 mb-3 font-bold text-[8px] uppercase tracking-widest">
                  <Search size={10} />
                  Live Network Query
                </div>
                <div className="text-sm md:text-base font-bold text-white italic mb-1 leading-tight">
                   "3 BHK + Sector 45 + Below ₹1.5 Cr"
                </div>
                <div className="w-6 h-[1px] bg-slate-700 my-2.5" />
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-[8px] uppercase tracking-widest mb-2">
                  <Zap size={10} />
                  Instant Match
                </div>
                <div className="text-[11px] font-medium text-slate-400">
                  Found <span className="text-white font-bold mx-0.5">12</span> properties from <span className="text-white font-bold mx-0.5">8</span> verified brokers
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
