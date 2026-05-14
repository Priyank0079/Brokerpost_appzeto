import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LandingFooter = ({ config }) => {
  return (
    <footer>
      {/* Disclaimer Bar */}
      <div className="bg-[#FFF9EA] border-y border-[#FFEBB0] py-3 px-6 lg:px-10">
        <div className="max-w-[1800px] mx-auto flex items-center gap-3 whitespace-nowrap overflow-x-auto no-scrollbar">
          <AlertTriangle size={14} className="text-[#B08B35] shrink-0" />
          <p className="text-[10px] text-[#84682A]">
            <span className="font-bold uppercase tracking-wider mr-2">Disclaimer:</span>
            BrokersPost is a networking platform only. We do not participate in, mediate, or take responsibility for any transaction, dispute, or loss arising between brokers. All listings must be genuine. By using this platform, you agree to our <button className="font-bold underline hover:text-[#c8962a]">Terms & Disclaimer Policy</button>.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#0f172a] py-6 px-6 lg:px-10 text-white">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#c8962a]">BrokersPost</span>
                <span className="text-slate-300 text-[10px]"> — {config?.brandingDesc || 'Verified Broker Inventory Network'} · For professional brokers only · Zero brokerage charged</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <p className="text-slate-300 text-[10px] mb-1">
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
