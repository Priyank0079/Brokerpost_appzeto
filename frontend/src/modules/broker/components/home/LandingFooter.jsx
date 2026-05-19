import React from 'react';

const LandingFooter = ({ config, onTermsClick }) => {
  return (
    <>
      {/* Disclaimer Bar */}
      <div className="disclaimer-bar">
        <span className="font-bold uppercase tracking-wider mr-2">Disclaimer:</span>
        {config?.disclaimer || "BrokersPost is a networking platform only. We do not participate in, mediate, or take responsibility for any transaction, dispute, or loss arising between brokers. All listings must be genuine. By using this platform, you agree to our"} <button onClick={onTermsClick} className="font-bold underline hover:text-[#c8962a]">Terms & Disclaimer Policy</button>.
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
              <p className="mb-1">
                {config?.copyright || '© 2026 Brokerspost Network Platform.'} - <button onClick={onTermsClick} className="hover:text-white transition-colors underline decoration-white/30">Disclaimer & Terms</button>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingFooter;
