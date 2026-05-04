import React from 'react';
import { motion } from 'framer-motion';
import { 
  Warehouse, 
  Users, 
  Star, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';

const benefits = [
  {
    title: "Inventory Heavy",
    description: "Find matching requirements faster. Close 3-4 extra deals/month.",
    icon: <Warehouse size={22} />,
    color: "blue"
  },
  {
    title: "Requirement Rich",
    description: "Get fresh inventory matches daily. Save 20+ hours searching.",
    icon: <Users size={22} />,
    color: "emerald"
  },
  {
    title: "New Broker",
    description: "Build network from day one. Connect with 50+ established brokers.",
    icon: <Star size={22} />,
    color: "amber"
  },
  {
    title: "Niche Specialist",
    description: "Find exact property matches. 5x higher match rate in your specialty.",
    icon: <TrendingUp size={22} />,
    color: "indigo"
  }
];

const COLOR_MAP = {
  blue: { bg: 'bg-blue-500/10', border: 'bg-blue-500/20', text: 'text-blue-400', accent: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'bg-emerald-500/20', text: 'text-emerald-400', accent: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500/10', border: 'bg-amber-500/20', text: 'text-amber-400', accent: 'bg-amber-500' },
  indigo: { bg: 'bg-indigo-500/10', border: 'bg-indigo-500/20', text: 'text-indigo-400', accent: 'bg-indigo-500' },
  primary: { bg: 'bg-primary-500/10', border: 'bg-primary-500/20', text: 'text-primary-400', accent: 'bg-primary-500' }
};

const ICON_MAP = [
  <Warehouse size={22} />,
  <Users size={22} />,
  <Star size={22} />,
  <TrendingUp size={22} />
];

const BrokerBenefits = ({ data }) => {
  if (!data) return null;

  const { title, subtitle, benefits } = data;

  return (
    <section className="py-12 px-4 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-black text-white tracking-tight"
          >
            {title || "How Different Brokers Benefit"}
          </motion.h2>
          <p className="text-slate-500 font-medium text-sm">{subtitle || "Tailored advantages for every professional profile."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(benefits || []).map((benefit, index) => {
            const styles = COLOR_MAP[benefit.color] || COLOR_MAP.blue;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
              >
                <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300 flex items-start gap-5 shadow-xl relative overflow-hidden h-full">
                  <div className={`w-12 h-12 shrink-0 rounded-xl ${styles.bg} border ${styles.border} flex items-center justify-center ${styles.text} shadow-lg group-hover:scale-105 transition-transform`}>
                    {ICON_MAP[index % ICON_MAP.length]}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white tracking-tight">{benefit.title}</h3>
                    <p className="text-slate-400 text-[13px] font-medium leading-relaxed">
                      {benefit.description}
                    </p>
                    <div className="pt-2 flex items-center gap-1 text-[10px] font-black text-primary-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                      Connect <ChevronRight size={12} />
                    </div>
                  </div>

                  {/* Subtle side accent */}
                  <div className={`absolute top-0 right-0 w-1 h-full ${styles.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrokerBenefits;
