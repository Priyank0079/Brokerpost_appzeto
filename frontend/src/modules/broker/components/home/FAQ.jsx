import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "What if I post my inventory and no one matches?",
    answer: "With our growing network of verified brokers, your property is seen by professionals actively searching for requirements. The high match probability ensures zero-risk exposure for your inventory."
  },
  {
    id: 2,
    question: "Will my listing get buried under others?",
    answer: "No. Brokerspost is search-first, not feed-based. Listings appear when they match specific criteria (e.g., location, BHK, budget), ensuring equal visibility regardless of when you post."
  },
  {
    id: 3,
    question: "How is this different from WhatsApp groups?",
    answer: "WhatsApp is noisy and unorganized. Brokerspost provides a structured, searchable CRM experience that saves you hours by filtering for only relevant matching deals."
  },
  {
    id: 4,
    question: "What if other brokers don't join?",
    answer: "Hundreds of brokers are already active on the platform. As the network grows, so does the value and match probability for every individual member."
  }
];

const FAQItem = ({ faq, isOpen, toggle }) => {
  return (
    <div className="border-b border-slate-100 last:border-none">
      <button
        onClick={toggle}
        className="w-full py-5 flex items-center justify-between text-left group focus:outline-none"
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

const FAQ = () => {
  const [openId, setOpenId] = useState(1);

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
            <HelpCircle className="text-primary-500" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Concerns</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-10 shadow-xl shadow-slate-200/20">
          {faqs.map((faq) => (
            <FAQItem 
              key={faq.id} 
              faq={faq} 
              isOpen={openId === faq.id} 
              toggle={() => setOpenId(openId === faq.id ? null : faq.id)} 
            />
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            Still have questions? <a href="mailto:support@brokerspost.com" className="text-primary-600 hover:underline">Connect with us</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
