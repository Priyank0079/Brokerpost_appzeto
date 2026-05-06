import React from 'react';
import { Search, ArrowLeft, Users2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const navigate = useNavigate();

  return (
    <div className="-mx-6 lg:-mx-10 -my-6 lg:-my-10 px-6 lg:px-10 py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-8 pb-10">
        {/* Custom Header */}
        <div className="-mx-6 lg:-mx-10 -mt-6 lg:-mt-10 mb-4 px-6 lg:px-10 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-serif text-black">My Groups</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
              <input 
                type="text" 
                placeholder="Search listings..."
                className="w-[240px] pl-9 pr-4 py-1.5 bg-[#fefce8] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/40 transition-all text-slate-600"
              />
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-1.5 rounded-full border border-slate-200 text-black text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Public Site
          </button>
        </div>

        {/* Title Section */}
        <div className="space-y-1">
          <h2 className="text-2xl font-serif text-black">My Groups</h2>
          <p className="text-[11px] text-slate-400 font-medium tracking-tight">Live inventory from your assigned broker groups</p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 bg-[#e2e8f0]/40 rounded-xl flex items-center justify-center mb-4">
             <Users2 size={28} className="text-[#a5b4fc]" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No groups assigned</h3>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">Contact admin to be added to a group</p>
        </div>
      </div>
    </div>
  );
};

export default Groups;
