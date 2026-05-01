import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowRight, CheckCircle2, Star } from 'lucide-react';

const networkPoints = [
  { id: 1, text: 'You join', result: 'Post 15 listings' },
  { id: 2, text: '99 others join', result: '1,500 total listings' },
  { id: 3, text: 'Critical mass achieved', result: 'Match probability hits 90%' },
  { id: 4, text: 'More brokers join', result: 'Seen by the entire network' },
  { id: 5, text: 'YOU WIN', result: 'More deals, more commissions' },
];

const NetworkEffect = () => {
  return (
    <section className="w-full overflow-hidden bg-white py-10 md:py-14">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] xl:gap-12">
          <div className="w-full max-w-2xl space-y-7">
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl xl:text-[46px]"
              >
                The Network Effect:
                <br />
                <span className="text-primary-600">Everyone Wins Together</span>
              </motion.h2>
              <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-500 md:text-base">
                As the network grows, the value for every broker increases.
                Our matching engine thrives on collective intelligence.
              </p>
            </div>

            <div className="space-y-4 md:space-y-5">
              {networkPoints.map((point, index) => (
                <motion.div
                  key={point.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 transition-all group-hover:border-primary-600 group-hover:bg-primary-600 group-hover:text-white">
                    {point.id}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
                    <span className="font-bold text-slate-700">{point.text}</span>
                    <ArrowRight className="text-slate-200" size={14} />
                    <span className="font-bold text-primary-600">{point.result}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-full justify-self-center lg:max-w-2xl lg:justify-self-center mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-full mx-auto"
            >
              <div className="relative overflow-hidden rounded-[30px] border border-slate-100 bg-slate-50/70 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-10">
                <Quote className="absolute right-6 top-6 text-slate-200/80" size={72} />

                <div className="relative z-10 space-y-7">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>

                  <p className="max-w-xl text-[20px] font-extrabold italic leading-snug text-slate-800 md:text-[24px]">
                    "Joined when there were 50 brokers. Closed my first co-broking deal worth Rs. 85 Lakhs within 2 weeks!"
                  </p>

                  <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white bg-slate-200 shadow-sm">
                      <img
                        src="https://i.pravatar.cc/150?u=rajesh"
                        alt="Rajesh Sharma"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 md:text-lg">Rajesh Sharma</h4>
                      <p className="mt-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Founding Member, Gurgaon
                        <CheckCircle2 className="text-primary-500" size={12} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 z-20 min-w-[150px] rounded-[20px] border border-white/10 bg-slate-900 px-5 py-4 text-white shadow-xl">
                <div className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-primary-400">
                  Success Rate
                </div>
                <div className="text-2xl font-black leading-none">94.2%</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkEffect;
