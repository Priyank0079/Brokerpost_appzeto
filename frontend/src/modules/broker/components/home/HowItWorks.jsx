import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Home as HomeIcon, 
  Search, 
  Handshake, 
  ArrowRight
} from 'lucide-react';

const HowItWorks = ({ data }) => {
  if (!data) return null;

  const { title, subtitle, steps } = data;

  return (
    <section className="pt-2 pb-10 px-0 bg-white relative overflow-hidden">
      <div className="w-full px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-2 mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight"
          >
            {title || "How Brokerspost Works"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 font-bold uppercase tracking-widest text-[10px]"
          >
            {subtitle || "Streamlined for Professional Success"}
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 relative">
          {(steps || []).map((step, index) => {
            const icons = [
              <UserPlus size={24} />,
              <HomeIcon size={24} />,
              <Search size={24} />,
              <Handshake size={24} />
            ];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 md:p-6 h-full hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 text-center flex flex-col items-center">
                  
                  {/* Step Number Badge */}
                  <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                    {index + 1}
                  </div>

                  {/* Icon Wrapper */}
                  <div className={`w-14 h-14 rounded-2xl bg-${step.color || 'primary'}-500/10 text-${step.color || 'primary'}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {icons[index % icons.length]}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Desktop Arrow Indicator */}
                  {index < (steps?.length || 0) - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-slate-200 group-hover:text-primary-300 transition-colors">
                      <ArrowRight size={20} />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
