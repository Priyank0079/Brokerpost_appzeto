import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Home as HomeIcon, 
  Search, 
  Handshake, 
  ChevronRight 
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Register Free",
    description: "Create your broker profile in 2 minutes. No credit card needed.",
    icon: <UserPlus size={32} />,
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Post Listings",
    description: "Add your inventory OR client requirements. 15 avg per broker.",
    icon: <HomeIcon size={32} />,
    color: "from-indigo-500 to-purple-600"
  },
  {
    id: 3,
    title: "Search & Match",
    description: "Enter what you need. Get instant matching results.",
    icon: <Search size={32} />,
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 4,
    title: "Collaborate",
    description: "Contact matched brokers. Close deals. Share commissions.",
    icon: <Handshake size={32} />,
    color: "from-pink-500 to-rose-600"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-12 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            How RealtyPost Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs"
          >
            Simple. Fast. Effective.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 h-full shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-500 text-center flex flex-col items-center">
                
                {/* Icon Wrapper with Gradient */}
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform duration-500`}>
                  {step.icon}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {step.id}. {step.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting Arrow (Desktop Only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-12 z-10 text-slate-200 group-hover:text-primary-300 transition-colors duration-500 translate-x-2">
                    <ChevronRight size={32} strokeWidth={3} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
