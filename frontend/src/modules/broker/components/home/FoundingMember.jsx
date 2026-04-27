import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Timer, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';

const benefits = [
  "Free Lifetime Membership",
  "25 Free Listings",
  "Founding Member Badge",
  "Priority Support",
  "3 Months Free Featured Listings",
  "Early Access to New Features",
  "Direct Intro to 20+ Brokers",
  "Lifetime 10% Discount"
];

const FoundingMember = () => {
  return (
    <section className="py-12 px-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-12 lg:p-16 relative overflow-hidden text-center"
        >
          {/* Animated Border/Ring */}
          <div className="absolute inset-0 border-[16px] border-slate-50 pointer-events-none rounded-[4rem]" />
          
          <div className="relative z-10 space-y-12">
            {/* Tag */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 animate-pulse">
                <Timer size={14} />
                Limited Time Offer
              </div>
            </div>

            {/* Header */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                Be a <span className="text-primary-600">Founding Member</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-medium">
                The first <span className="text-slate-900 font-bold underline decoration-primary-500 decoration-4 underline-offset-4">100 brokers</span> get exclusive LIFETIME benefits.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left bg-slate-50/50 p-8 md:p-12 rounded-[3rem] border border-slate-100">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Urgency and CTA */}
            <div className="space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={14} />
                  Only 53 slots remaining!
                </div>
                
                <button className="group relative px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:bg-primary-600 transition-all transform hover:scale-105 active:scale-95">
                  <span className="relative z-10 flex items-center gap-3">
                    Join Now — Completely Free
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40">
                       <ShieldCheck size={14} />
                    </div>
                  </span>
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                No credit card required • No commitment • Cancel anytime
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FoundingMember;
