import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';

const FAQItem = ({ faq, isOpen, toggle }) => {
  return (
    <div className="border-b border-slate-100 last:border-none">
      <button
        onClick={toggle}
        className="w-full py-4 flex items-center justify-between text-left group focus:outline-none"
      >
        <span className={`text-base md:text-lg font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-primary-600' : 'text-slate-800 group-hover:text-primary-500'}`}>
          {faq.question}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary-600 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-slate-500 font-medium text-sm leading-relaxed max-w-3xl">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = ({ data }) => {
  const [openId, setOpenId] = useState(null);

  if (!data || !data.items || data.items.length === 0) return null;

  const { title, subtitle, items } = data;

  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
            <HelpCircle className="text-primary-500" size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{subtitle || "Concerns"}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{title || "Frequently Asked Questions"}</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-8 shadow-lg shadow-slate-200/10">
          {items.map((faq, index) => (
            <FAQItem 
              key={index} 
              faq={faq} 
              isOpen={openId === index} 
              toggle={() => setOpenId(openId === index ? null : index)} 
            />
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            {data.footerText || "Still have questions? Connect with us"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
