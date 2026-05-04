import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Search,
  Zap,
  Target,
  Verified
} from 'lucide-react';

const ComparisonSection = ({ data }) => {
  if (!data) return null;

  const { badge, title, subtitle, benefits } = data;

  return (
    <section className="py-16 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left: Text Content */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-lg text-primary-600">
              <Zap size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{badge || "The Ultimate Upgrade"}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {title || "Why Professionals Choose Brokerspost"}
            </h2>
            <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">
              {subtitle || "We've redesigned real estate networking from the ground up, moving away from noisy feeds to high-intent matching."}
            </p>
            
            <div className="flex items-center gap-6 pt-4">
               <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="" />
                    </div>
                  ))}
               </div>
               <p className="text-xs font-bold text-slate-400">
                 Join <span className="text-slate-900 font-black">{data.activeBrokers || "2.5k+"}</span> active brokers
               </p>
            </div>
          </div>

          {/* Right: Benefits List (Simple & Professional) */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(benefits || []).map((benefit, i) => {
              const icons = [
                <Target className="text-emerald-500" />,
                <Search className="text-blue-500" />,
                <ShieldCheck className="text-primary-600" />,
                <CheckCircle2 className="text-emerald-500" />
              ];
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    {icons[i % icons.length]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{benefit.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
