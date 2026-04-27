import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Timer, ShieldCheck } from 'lucide-react';

const benefits = [
  "Free Lifetime Membership",
  "25 Free Listings",
  "Founding Member Badge",
  "Priority Support",
  "3 Months Featured Listings",
  "Early Access to Features",
  "Direct Intro to 20+ Brokers",
  "Lifetime 10% Discount"
];

const FoundingMember = () => {
  return (
    <section className="py-12 px-4 bg-slate-900 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[140px] -z-10" />

      <div className="max-w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 md:p-12 lg:px-20 lg:py-10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          {/* Header & CTA Left */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              <Timer size={14} />
              Limited Time Offer
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Be a <span className="text-primary-400">Founding Member</span>
              </h2>
              <p className="text-base md:text-lg text-slate-400 font-medium">
                The first <span className="text-white font-bold underline decoration-primary-500 decoration-2 underline-offset-4">100 brokers</span> get exclusive lifetime benefits.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button className="group relative px-8 py-4 bg-primary-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-primary-600/20 hover:bg-primary-500 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3">
                Join Now — Completely Free
                <ShieldCheck size={16} />
              </button>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Sparkles size={14} />
                Only 53 slots remaining!
              </div>
            </div>
            
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              No credit card required • No commitment • Cancel anytime
            </p>
          </div>

          {/* Benefits Grid Right */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 bg-white/5 p-6 md:p-8 rounded-2xl border border-white/5">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 group"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <CheckCircle2 size={12} />
                </div>
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FoundingMember;
