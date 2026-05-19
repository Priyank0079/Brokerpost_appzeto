import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

const CTASection = ({ onRegisterClick, config }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
    <section className="bg-[#f0ebe0] py-12 px-6">
      <div className="max-w-[660px] mx-auto">
        <div className="cta-card bg-white rounded-[20px] py-6 px-10 text-center shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
              <Trophy size={32} className="text-[#c8962a]" />
            </div>
          </div>
          
          <h2>
            {config?.title || 'Join the Verified Broker Network'}
          </h2>
          
          <p className="leading-relaxed max-w-xl mx-auto">
            {config?.subtitle || 'Only serious, professional brokers. A community built on trust, transparency and real inventory. Register today and start accessing deals your competitors can\'t see.'}
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={onRegisterClick}
              className="bg-[#c8962a] text-white px-8 py-3.5 rounded-lg font-bold text-xs hover:bg-[#b08b35] transition-all shadow-lg shadow-[#c8962a]/20"
            >
              {config?.buttonText || 'Register as a Verified Broker'}
            </button>
            
            <p className="text-slate-400 text-xs">
              Already registered? <button onClick={() => setIsLoginModalOpen(true)} className="text-[#1a365d] font-bold hover:underline">Login here</button>
            </p>
          </div>
        </div>
      </div>
    </section>

    <LoginModal 
      isOpen={isLoginModalOpen} 
      onClose={() => setIsLoginModalOpen(false)} 
      onSwitchToRegister={() => {
        setIsLoginModalOpen(false);
        if (onRegisterClick) onRegisterClick();
      }}
    />
    </>
  );
};

export default CTASection;
