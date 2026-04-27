import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowRight, CheckCircle2, Star } from 'lucide-react';

const networkPoints = [
  { id: 1, text: "You join", result: "Post 15 listings" },
  { id: 2, text: "99 others join", result: "1,500 total listings" },
  { id: 3, text: "Critical mass achieved", result: "Match probability hits 90%" },
  { id: 4, text: "More brokers join", result: "Seen by the entire network" },
  { id: 5, text: "YOU WIN", result: "More deals, more commissions" }
];

const NetworkEffect = () => {
  return (
    <section className="py-12 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Left Content: The Points */}
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight"
              >
                The Network Effect:<br />
                <span className="text-primary-600">Everyone Wins Together</span>
              </motion.h2>
              <p className="text-slate-500 font-medium text-sm md:text-base max-w-xl leading-relaxed">
                As the network grows, the value for every broker increases. 
                Our matching engine thrives on collective intelligence.
              </p>
            </div>

            <div className="space-y-4">
              {networkPoints.map((point, index) => (
                <motion.div
                  key={point.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                    {point.id}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-700 text-sm md:text-base">{point.text}</span>
                    <ArrowRight className="text-slate-200" size={14} />
                    <span className="font-bold text-primary-600 text-sm md:text-base">{point.result}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Content: Testimonial Card */}
          <div className="flex-1 w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-slate-50/50 rounded-3xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden">
                <Quote className="absolute top-6 right-6 text-slate-200 opacity-20" size={60} />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>

                  <p className="text-lg md:text-xl font-bold text-slate-800 leading-snug italic">
                    "Joined when there were 50 brokers. Closed my first co-broking deal worth ₹85 Lakhs within 2 weeks!"
                  </p>

                  <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden border border-white shadow-sm">
                      <img src="https://i.pravatar.cc/150?u=rajesh" alt="Rajesh Sharma" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Rajesh Sharma</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                        Founding Member, Gurgaon
                        <CheckCircle2 className="text-primary-500" size={12} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Stat Badge */}
              <div className="absolute -bottom-4 -right-4 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-white/10 z-20">
                <div className="text-[9px] font-black text-primary-400 uppercase tracking-widest mb-0.5">Success Rate</div>
                <div className="text-xl font-black">94.2%</div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NetworkEffect;
