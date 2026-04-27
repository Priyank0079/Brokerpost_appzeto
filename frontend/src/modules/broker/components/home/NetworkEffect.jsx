import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowRight, CheckCircle2 } from 'lucide-react';

const networkPoints = [
  { id: 1, text: "You join", result: "Post 15 listings" },
  { id: 2, text: "99 others join", result: "1,500 total listings" },
  { id: 3, text: "Critical mass achieved", result: "Match probability hits 90%" },
  { id: 4, text: "More brokers join organically", result: "Your listings get seen by ALL" },
  { id: 5, text: "YOU WIN", result: "More matches, more deals, more commissions" }
];

const NetworkEffect = () => {
  return (
    <section className="py-12 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Content: The Points */}
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
              >
                The Network Effect:<br />
                <span className="text-primary-600">Everyone Wins Together</span>
              </motion.h2>
              <p className="text-slate-500 font-medium text-lg max-w-xl">
                As the network grows, the value for every single broker increases exponentially. 
                Our matching engine thrives on collective intelligence.
              </p>
            </div>

            <div className="space-y-6">
              {networkPoints.map((point, index) => (
                <motion.div
                  key={point.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">
                    {point.id}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-slate-900 text-lg">{point.text}</span>
                    <ArrowRight className="text-slate-300" size={18} />
                    <span className="font-bold text-primary-600">{point.result}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Content: Testimonial Card */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative Background Blob */}
              <div className="absolute -inset-4 bg-primary-600/5 rounded-[4rem] blur-3xl -z-10" />
              
              <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                <Quote className="absolute top-10 right-10 text-primary-50 opacity-20" size={120} />
                
                <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] text-white">★</div>
                    ))}
                  </div>

                  <p className="text-2xl md:text-3xl font-black text-slate-900 leading-tight italic">
                    "Joined when there were 50 brokers. Closed my first co-broking deal worth ₹85 Lakhs within 2 weeks!"
                  </p>

                  <div className="flex items-center gap-6 border-t border-slate-50 pt-8">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-xl">
                      <img src="https://i.pravatar.cc/150?u=rajesh" alt="Rajesh Sharma" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900">Rajesh Sharma</h4>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                        Founding Member, Gurgaon
                        <CheckCircle2 className="text-primary-500" size={14} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 md:right-10 bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-2xl border border-white/10 z-20"
              >
                <div className="text-xs font-black text-primary-400 uppercase tracking-widest mb-1">Success Rate</div>
                <div className="text-3xl font-black">94.2%</div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NetworkEffect;
