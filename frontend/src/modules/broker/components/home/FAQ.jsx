import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "What if I post my inventory and no one matches?",
    answer: "With 100 brokers and 1,500 listings, your property will be seen by 100+ brokers actively looking for requirements. The match probability is 90%+. And it's completely free - zero risk!"
  },
  {
    id: 2,
    question: "Will my listing get buried under thousands of others?",
    answer: "No! RealtyPost is SEARCH-based, not scroll-based. Brokers search for specific requirements (e.g., \"3 BHK in Gurgaon\"). If your property matches, it appears. Every time. No algorithm hides your listings."
  },
  {
    id: 3,
    question: "How is this different from WhatsApp groups?",
    answer: "WhatsApp groups are noisy, unorganized, and messages get lost. RealtyPost is structured, searchable, and shows you ONLY relevant matches. Save 15-20 hours per week!"
  },
  {
    id: 4,
    question: "What if other brokers don't join?",
    answer: "47 brokers already joined with 705 listings. We're investing in marketing to ensure we hit 100. Your participation helps everyone reach critical mass faster."
  }
];

const FAQItem = ({ faq, isOpen, toggle }) => {
  return (
    <div className="border-b border-slate-100 last:border-none">
      <button
        onClick={toggle}
        className="w-full py-8 flex items-center justify-between text-left group focus:outline-none"
      >
        <span className={`text-lg md:text-xl font-black tracking-tight transition-colors duration-300 ${isOpen ? 'text-primary-600' : 'text-slate-900 group-hover:text-primary-500'}`}>
          "{faq.question}"
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary-600 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-slate-500 font-medium leading-relaxed max-w-3xl">
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
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <HelpCircle className="text-primary-500" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Common Concerns</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-2xl shadow-slate-200/20">
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
        <div className="mt-12 text-center">
          <p className="text-slate-400 font-bold text-sm">
            Still have questions? <a href="mailto:support@realtypost.com" className="text-primary-600 hover:underline">Chat with our team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
