import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import LandingNavbar from '../components/home/LandingNavbar';
import LandingFooter from '../components/home/LandingFooter';
import { Loader2, Mail, Phone, ChevronDown } from 'lucide-react';

const Support = () => {
  const [supportData, setSupportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchConfig = async () => {
      try {
        const response = await api.get('/landing-config');
        if (response.success && response.data?.legalPages?.support) {
          setSupportData(response.data.legalPages.support);
        }
      } catch (err) {
        console.error('Failed to fetch config', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans">
      <LandingNavbar />
      
      <main className="max-w-4xl mx-auto px-6 py-20 mt-16">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-serif text-[#1a365d] mb-4">
            How can we help you?
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Get in touch with our support team or browse through our frequently asked questions below.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#c8962a]" size={32} />
            <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Loading...</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-[#c8962a]/30 transition-all group">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Email Support</h3>
                <p className="text-slate-500 text-sm mb-4">Drop us an email and we'll get back to you within 24 hours.</p>
                <a href={`mailto:${supportData?.email || 'support@brokerspost.com'}`} className="text-[#c8962a] font-bold hover:text-[#a67d26] transition-colors">
                  {supportData?.email || 'support@brokerspost.com'}
                </a>
              </div>
              
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-[#c8962a]/30 transition-all group">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Phone Support</h3>
                <p className="text-slate-500 text-sm mb-4">Call our dedicated helpline for immediate assistance.</p>
                <a href={`tel:${supportData?.mobile || ''}`} className="text-[#c8962a] font-bold hover:text-[#a67d26] transition-colors">
                  {supportData?.mobile || 'Not Available'}
                </a>
              </div>
            </div>

            {/* FAQs */}
            {supportData?.faqs && supportData.faqs.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
                <h2 className="text-2xl font-serif text-[#1a365d] mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4 max-w-3xl mx-auto">
                  {supportData.faqs.map((faq, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden bg-[#faf9f6]">
                      <button 
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-bold text-slate-900 pr-4">{faq.question}</span>
                        <ChevronDown 
                          size={18} 
                          className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      <div 
                        className={`transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96 opacity-100 p-5 border-t border-slate-100' : 'max-h-0 opacity-0 p-0 overflow-hidden'}`}
                      >
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
};

export default Support;
