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
    icon: <Warehouse size={28} />,
    color: "bg-blue-500"
  },
  {
    title: "Requirement Rich",
    description: "Get fresh inventory matches daily. Save 20+ hours searching.",
    icon: <Users size={28} />,
    color: "bg-emerald-500"
  },
  {
    title: "New Broker",
    description: "Build network from day one. Connect with 50+ established brokers.",
    icon: <Star size={28} />,
    color: "bg-amber-500"
  },
  {
    title: "Niche Specialist",
    description: "Find exact property matches. 5x higher match rate in your specialty.",
    icon: <TrendingUp size={28} />,
    color: "bg-indigo-500"
  }
];

const BrokerBenefits = () => {
  return (
    <section className="py-12 px-4 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            How Different Brokers Benefit
          </motion.h2>
          <p className="text-slate-400 font-medium text-lg">Tailored advantages for every professional profile.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                x: index % 2 === 0 ? -50 : 50 
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="group"
            >
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 md:p-10 rounded-[3rem] hover:bg-slate-800/60 transition-all duration-500 flex flex-col sm:flex-row items-center sm:items-start gap-8 shadow-2xl relative overflow-hidden">
                {/* Decorative Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${benefit.color} opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-[0.08] transition-opacity`} />
                
                <div className={`w-16 h-16 shrink-0 rounded-2xl ${benefit.color} flex items-center justify-center text-white shadow-lg shadow-black/20 transform group-hover:rotate-6 transition-transform`}>
                  {benefit.icon}
                </div>

                <div className="space-y-3 text-center sm:text-left">
                  <h3 className="text-2xl font-black text-white tracking-tight">{benefit.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
                    {benefit.description}
                  </p>
                  <div className="pt-4 flex items-center justify-center sm:justify-start gap-2 text-primary-400 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BrokerBenefits;
