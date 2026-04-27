import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Search 
} from 'lucide-react';

const ComparisonSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center py-12 overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        {/* Dark Overlay for contrast */}
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 w-full">
        <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-white/20 p-8 md:p-16 lg:p-20">
          
          <div className="text-center space-y-4 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100"
            >
              <Zap className="text-primary-600" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">The Ultimate Upgrade</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Why Professionals Choose <span className="text-primary-600">RealtyPost</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              We've redesigned real estate networking from the ground up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 rounded-3xl overflow-hidden border border-slate-100">
            {/* Traditional Column */}
            <div className="bg-white p-8 md:p-12 space-y-10">
              <div className="flex items-center gap-4 text-slate-400 mb-8">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <h4 className="text-lg font-black uppercase tracking-widest">Old Platforms</h4>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <XCircle className="text-rose-400 shrink-0 mt-1" size={20} />
                  <div>
                    <h5 className="font-bold text-slate-900">Algorithm Bias</h5>
                    <p className="text-sm text-slate-400 mt-1">Posts get buried under meaningless "viral" content.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <XCircle className="text-rose-400 shrink-0 mt-1" size={20} />
                  <div>
                    <h5 className="font-bold text-slate-900">Endless Scrolling</h5>
                    <p className="text-sm text-slate-400 mt-1">Brokers waste hours looking for relevant requirements.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <XCircle className="text-rose-400 shrink-0 mt-1" size={20} />
                  <div>
                    <h5 className="font-bold text-slate-900">Unverified Traffic</h5>
                    <p className="text-sm text-slate-400 mt-1">Difficult to distinguish real brokers from spam.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RealtyPost Column */}
            <div className="bg-primary-50/30 p-8 md:p-12 space-y-10 relative overflow-hidden">
              {/* Highlight Background */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl" />
              
              <div className="flex items-center gap-4 text-primary-600 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-600/20">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-lg font-black uppercase tracking-widest">RealtyPost</h4>
              </div>

              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group"
                >
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                  <div>
                    <h5 className="font-bold text-slate-900">Pure Matching</h5>
                    <p className="text-sm text-slate-600 mt-1 font-medium">Search results are based 100% on inventory match. Always.</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                  <div>
                    <h5 className="font-bold text-slate-900">Search-First Logic</h5>
                    <p className="text-sm text-slate-600 mt-1 font-medium">Instantly find exactly what matches your requirement.</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-4 group"
                >
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                  <div>
                    <h5 className="font-bold text-slate-900">Verified Professional Only</h5>
                    <p className="text-sm text-slate-600 mt-1 font-medium">Connect exclusively with verified brokers via RERA.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md">
                      <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="" />
                    </div>
                  ))}
               </div>
               <p className="text-sm font-bold text-slate-600">
                 Join <span className="text-slate-900 font-black">2,500+</span> verified brokers shifting to match-based networking.
               </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
