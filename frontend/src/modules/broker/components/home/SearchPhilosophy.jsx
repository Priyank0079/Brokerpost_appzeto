import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Zap, 
  Target, 
  Users, 
  ArrowRight, 
  ShieldCheck,
  LayoutGrid,
  Sparkles
} from 'lucide-react';

const SearchPhilosophy = () => {
  return (
    <section className="py-12 px-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100"
          >
            <Sparkles className="text-primary-500" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">The Network Philosophy</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter"
          >
            Search-Based. <span className="text-primary-600">No Algorithm.</span><br />
            Pure Matching.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-500 font-medium text-lg"
          >
            Unlike social media where posts get buried, RealtyPost is a search-first platform. 
            Brokers search for exactly what they need. If your property matches, it appears. Every time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-primary-600/5 transition-all group"
          >
            <div className="w-16 h-16 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600 mb-8 group-hover:scale-110 transition-transform">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Equal Visibility</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-500 font-medium">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                No scrolling. No algorithm bias.
              </li>
              <li className="flex items-start gap-3 text-slate-500 font-medium">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                Every listing gets equal exposure.
              </li>
            </ul>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-primary-600/5 transition-all group"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Match Probability</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-500 font-medium">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                More listings = Higher probability.
              </li>
              <li className="flex items-start gap-3 text-slate-500 font-medium">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Your inventory matches more requirements.
              </li>
            </ul>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-primary-600/5 transition-all group"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Network Effect</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-500 font-medium">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                Everyone wins when more brokers join.
              </li>
              <li className="flex items-start gap-3 text-slate-500 font-medium">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                Power of a collective verified network.
              </li>
            </ul>
          </motion.div>
        </div>

        {/* How it Works Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-24 bg-slate-900 rounded-[4rem] p-8 md:p-20 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h4 className="text-3xl md:text-5xl font-black tracking-tighter">How Pure Matching Works</h4>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                We've eliminated the "feed" clutter. Our system operates on high-intent search queries that connect inventory directly to demand.
              </p>
              <div className="flex items-center gap-6 p-6 bg-slate-800/50 rounded-3xl border border-slate-700">
                <ShieldCheck className="text-primary-400 shrink-0" size={32} />
                <p className="text-sm font-bold text-slate-300">Your property appears if it matches the search. Always.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
                <div className="flex items-center gap-4 text-primary-400 mb-6 font-black text-xs uppercase tracking-widest">
                  <Search size={16} />
                  Active Broker Query
                </div>
                <div className="text-xl md:text-2xl font-black text-white italic mb-2 leading-tight">
                   "3 BHK + Golf Course Road + Under ₹2 Cr"
                </div>
                <div className="w-12 h-1 bg-slate-700 my-6" />
                <div className="flex items-center gap-4 text-emerald-400 font-black text-xs uppercase tracking-widest mb-4">
                  <Zap size={16} />
                  Instant Results
                </div>
                <div className="text-lg font-bold text-slate-300">
                  Showing <span className="text-white text-2xl font-black mx-1">12</span> matching properties from <span className="text-white text-2xl font-black mx-1">8</span> verified brokers
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchPhilosophy;
