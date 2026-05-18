import React, { useState, useEffect } from 'react';
import { X, Loader2, ScrollText, AlertTriangle } from 'lucide-react';

const TermsModal = ({ isOpen, onClose }) => {
  const [dynamicTerms, setDynamicTerms] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchTerms = async () => {
        setLoading(true);
        try {
          const termsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/landing-config`);
          const termsJson = await termsRes.json();
          if (termsJson.success && termsJson.data?.sections?.registrationTerms) {
            setDynamicTerms(termsJson.data.sections.registrationTerms);
          }
        } catch (err) {
          console.error('Failed to fetch terms:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchTerms();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[620px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/50 flex items-center justify-center text-amber-600">
              <ScrollText size={18} />
            </div>
            <div>
              <h2 className="text-base font-serif font-medium text-[#1a365d]">
                {dynamicTerms?.title || 'Terms & Disclaimer Policy'}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">
                Brokerspost Verified Broker Network Platform
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#fcf8f2] text-slate-400 hover:bg-[#f3ebd6] hover:text-slate-600 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#c8962a] animate-spin" />
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
                Loading dynamic terms...
              </p>
            </div>
          ) : (
            <>
              {/* Alert Note */}
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-3">
                <AlertTriangle size={16} className="text-[#3b82f6] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-[#1e3a8a] uppercase tracking-wider">
                    IMPORTANT NOTICE FOR BROKERS
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    This platform is strictly for professional, verified real estate brokers. Zero brokerage is charged. All listings and deal transactions must adhere strictly to these terms.
                  </p>
                </div>
              </div>

              {/* Dynamic list */}
              <div className="p-5 border border-slate-100 rounded-xl bg-[#faf7f2]/60 space-y-4">
                {(dynamicTerms?.items && dynamicTerms.items.length > 0) ? (
                  dynamicTerms.items.map((item, idx) => {
                    const cleanTitle = (item.title || "").replace(/^\d+\.\s*/, '').replace(/:*\s*$/, '');
                    return (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 mt-0.5 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-[#1a365d]">
                            {cleanTitle}
                          </h4>
                          <p className="text-[11px] font-medium text-slate-600 leading-loose">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 mt-0.5 shrink-0">
                        1
                      </span>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-[#1a365d]">No Liability</h4>
                        <p className="text-[11px] font-medium text-slate-600 leading-loose">
                          BrokersPost is a networking platform that connects verified real estate brokers. We do not participate in any transaction between brokers. This site does not take any responsibility for disputes, financial losses, or any issues arising between brokers during or after a deal.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 mt-0.5 shrink-0">
                        2
                      </span>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-[#1a365d]">Independent Dealing</h4>
                        <p className="text-[11px] font-medium text-slate-600 leading-loose">
                          Brokers are independent professionals. They may call and deal with each other directly. BrokersPost does not mediate, negotiate, or guarantee any transaction. All dealings happen independently between brokers at their own risk and discretion.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 mt-0.5 shrink-0">
                        3
                      </span>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-[#1a365d]">Genuine Listings Only</h4>
                        <p className="text-[11px] font-medium text-slate-600 leading-loose">
                          Brokers must post only genuine, verified inventory that they have the authority to list. Fake, misleading, or unauthorized listings are strictly prohibited and may result in account termination.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Agreement text */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed italic">
                  "{dynamicTerms?.agreementText || 'I have read and understood all the above terms. I agree to the Disclaimer & Terms of Use of BrokersPost. I confirm that I am a registered professional broker and all listings I post will be genuine.'}"
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end shrink-0 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1a365d] text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#152e50] transition-all shadow-md"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
