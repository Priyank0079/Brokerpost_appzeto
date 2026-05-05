import React from 'react';
import { Trophy } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="bg-[#FAF9F6] py-12 px-6">
      <div className="max-w-[720px] mx-auto">
        <div className="bg-white rounded-[40px] p-10 text-center shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
              <Trophy size={32} className="text-[#C59D3F]" />
            </div>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-serif text-[#0f172a] mb-4">
            Join the Verified Broker Network
          </h2>
          
          <p className="text-slate-500 text-[14px] leading-relaxed mb-8 max-w-xl mx-auto">
            Only serious, professional brokers. A community built on trust, transparency and real inventory. Register today and start accessing deals your competitors can't see.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <button className="bg-[#C59D3F] text-white px-8 py-3.5 rounded-2xl font-bold text-xs hover:bg-[#b08b35] transition-all shadow-lg shadow-[#C59D3F]/20">
              Register as a Verified Broker
            </button>
            
            <p className="text-slate-400 text-xs">
              Already registered? <button className="text-[#1a365d] font-bold hover:underline">Login here</button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
