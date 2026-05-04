import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowRight, CheckCircle2, Star } from 'lucide-react';

const NetworkEffect = ({ data }) => {
  if (!data) return null;

  const { title, subtitle, points, testimonial } = data;

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
                {title || "The Network Effect: Everyone Wins Together"}
              </motion.h2>
              <p className="text-slate-500 font-medium text-sm md:text-base max-w-xl leading-relaxed">
                {subtitle || "As the network grows, the value for every broker increases. Our matching engine thrives on collective intelligence."}
              </p>
            </div>

            <div className="space-y-4 md:space-y-5">
              {(points || []).map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 transition-all group-hover:border-primary-600 group-hover:bg-primary-600 group-hover:text-white">
                    {index + 1}
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

                  <p className="text-lg md:text-xl font-bold text-slate-800 leading-snug italic">
                    "{testimonial?.quote || "Joined when there were 50 brokers. Closed my first co-broking deal worth ₹85 Lakhs within 2 weeks!"}"
                  </p>

                  <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-200 overflow-hidden border border-white shadow-sm">
                      <img
                        src={testimonial?.avatar || "https://i.pravatar.cc/150?u=rajesh"}
                        alt={testimonial?.author || "Rajesh Sharma"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base md:text-lg">{testimonial?.author || "Rajesh Sharma"}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                        {testimonial?.location || "Founding Member, Gurgaon"}
                        <CheckCircle2 className="text-primary-500" size={12} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Stat Badge */}
              <div className="absolute -bottom-4 -right-4 z-20 min-w-[150px] bg-slate-900 text-white px-5 py-4 rounded-[20px] shadow-xl border border-white/10">
                <div className="text-[9px] font-black text-primary-400 uppercase tracking-widest mb-0.5">Success Rate</div>
                <div className="text-2xl font-black leading-none">{testimonial?.successRate || "94.2%"}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkEffect;
