import React from 'react';
import { Link } from 'react-router-dom';

const LandingFooter = ({ config, onTermsClick }) => {
  return (
    <>
      {/* Disclaimer Bar */}
      <div className="disclaimer-bar">
        <span className="font-bold uppercase tracking-wider mr-2">Disclaimer:</span>
        {config?.disclaimer || "BrokersPost is a networking platform only. We do not participate in, mediate, or take responsibility for any transaction, dispute, or loss arising between brokers. All listings must be genuine. By using this platform, you agree to our"} <button onClick={onTermsClick} className="font-bold underline hover:text-[#c8962a]">{config?.sections?.registrationTerms?.title || 'Registration Terms & Conditions'}</button> and <Link to="/privacy-policy" className="font-bold underline hover:text-[#c8962a]">Privacy Policy</Link>.
      </div>

      {/* Main Footer */}
      <footer>
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#c8962a]">BrokersPost</span>
                <span> — {config?.brandingDesc || 'Verified Broker Inventory Network'} </span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <p className="mb-1 text-sm flex flex-wrap gap-2 md:gap-4 items-center justify-center md:justify-start text-slate-300">
                <span>{config?.copyright || '© 2026 Brokerspost Network Platform.'}</span>
                <span className="hidden md:inline text-slate-600">|</span>
                <button onClick={onTermsClick} className="hover:text-white transition-colors underline decoration-white/30">{config?.sections?.registrationTerms?.title || 'Registration Terms & Conditions'}</button>
                <span className="hidden md:inline text-slate-600">|</span>
                <Link to="/privacy-policy" className="hover:text-white transition-colors underline decoration-white/30">Privacy Policy</Link>
                <span className="hidden md:inline text-slate-600">|</span>
                <Link to="/support" className="hover:text-white transition-colors underline decoration-white/30">Support & FAQs</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingFooter;
