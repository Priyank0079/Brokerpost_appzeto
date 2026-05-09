import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LandingFooter = ({ config }) => {
  return (
    <footer>
      {/* Disclaimer Bar */}
      <div className="bg-[#FFF9EA] border-y border-[#FFEBB0] py-3 px-6 lg:px-20">
        <div className="max-w-[1800px] mx-auto flex items-center gap-3 whitespace-nowrap overflow-x-auto no-scrollbar">
          <AlertTriangle size={14} className="text-[#B08B35] shrink-0" />
          <p className="text-[10px] text-[#84682A]">
            <span className="font-bold uppercase tracking-wider mr-2">Disclaimer:</span>
            BrokersPost is a networking platform only. We do not participate in, mediate, or take responsibility for any transaction, dispute, or loss arising between brokers. All listings must be genuine. By using this platform, you agree to our <button className="font-bold underline hover:text-[#c8962a]">Terms & Disclaimer Policy</button>.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#0f172a] py-6 px-6 lg:px-20 text-white">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base font-bold"><span className="text-[#1e3a5f]">Brokers</span><span className="text-[#c8962a]">Post</span></span>
                <span className="text-slate-300 text-xs"> — {config?.brandingDesc || 'Verified Broker Inventory Network'}</span>
              </div>
              <p className="text-slate-300 text-xs">
                For professional brokers only · Zero brokerage charged
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <p className="text-slate-300 text-xs mb-1">
                {config?.copyright || '© 2026 Brokerspost Network Platform.'} - <button className="hover:text-white transition-colors underline decoration-slate-600">Disclaimer & Terms</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
