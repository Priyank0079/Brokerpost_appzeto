import React from 'react';
import { Search, ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const navigate = useNavigate();

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf9f6] min-h-screen transition-colors duration-300">
      <div className="space-y-6 pb-10">
        {/* Custom Header */}
        <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 mb-4 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <h1 className="text-base md:text-lg font-serif text-black">My Groups</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
              <input 
                type="text" 
                placeholder="Search listings..."
                className="w-[180px] lg:w-[240px] pl-9 pr-4 py-1.5 bg-[#fefce8] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/40 transition-all text-slate-600 placeholder:text-slate-600"
              />
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-3 md:px-4 py-1.5 rounded-full border border-slate-200 text-black text-[10px] md:text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={14} /> 
            <span className="hidden xs:inline">Public Site</span>
          </button>
        </div>

        <div className="space-y-1 px-2 md:px-0">
          <h2 className="text-xl md:text-2xl font-serif text-black">My Groups</h2>
          <p className="text-[10px] md:text-[11px] text-slate-400 font-medium tracking-tight">Live inventory from your assigned broker groups</p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#f1f5f9] rounded-full flex items-center justify-center mb-6">
            <Users size={28} className="text-black opacity-20 md:size-32" />
          </div>
          <h3 className="text-lg font-serif font-bold text-black">No groups assigned</h3>
          <p className="text-[10px] md:text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-black leading-relaxed">Contact admin to be added to a group</p>
        </div>
      </div>
    </div>
  );
};

export default Groups;
