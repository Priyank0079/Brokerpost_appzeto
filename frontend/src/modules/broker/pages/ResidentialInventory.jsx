import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowLeft, Plus, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import PostListingModal from '../components/inventory/PostListingModal';

const ResidentialInventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const intent = searchParams.get('intent') || 'SALE';

  const [showSubTypes, setShowSubTypes] = React.useState(false);
  const [selectedSubType, setSelectedSubType] = React.useState('All Sub-types');
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const isPurchase = intent === 'PURCHASE';
  const isWantedRent = intent === 'WANTED_RENT';
  const subTypes = (isPurchase)
    ? ['All Sub-types', 'Apartments', 'Low Rise Floors', 'Kothi/Villas', 'Plots']
    : ['All Sub-types', 'Apartments', 'Low Rise Floors', 'Kothi/Villas'];

  const getPageConfig = () => {
    switch (intent) {
      case 'RENT':
        return {
          title: 'Available for Rental · Residential',
          heading: 'Available for Rental — Residential',
          subheading: 'Residential properties for rent',
          bg: 'bg-[#faf9f6]'
        };
      case 'PURCHASE':
        return {
          title: 'Wanted on Purchase · Residential',
          heading: 'Wanted on Purchase — Residential',
          subheading: 'Buyer requirements for residential',
          bg: 'bg-[#faf9f6]'
        };
      case 'WANTED_RENT':
        return {
          title: 'Wanted on Rent · Residential',
          heading: 'Wanted on Rent — Residential',
          subheading: 'Tenant requirements for residential',
          bg: 'bg-[#faf9f6]'
        };
      default:
        return {
          title: 'Available for Sale · Residential',
          heading: 'Available for Sale — Residential',
          subheading: 'Residential properties listed for sale',
          bg: 'bg-[#fff9fa]'
        };
    }
  };

  const config = getPageConfig();

  return (
    <div className={`-mx-6 lg:-mx-10 -my-6 lg:-my-10 px-6 lg:px-10 py-6 lg:py-10 ${config.bg} min-h-screen transition-colors duration-300`}>
      <div className="space-y-6 pb-10">
      {/* Custom Header */}
      <div className="-mx-6 lg:-mx-10 -mt-6 lg:-mt-10 mb-4 px-6 lg:px-10 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-serif text-black">{config.title}</h1>
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

      <div className="space-y-1">
        <h2 className="text-2xl font-serif text-black">{config.heading}</h2>
        <p className="text-[11px] text-slate-400 font-medium tracking-tight">{config.subheading}</p>
      </div>

      {/* Unified Card Container */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm">
        {/* Card Header (Filter Bar) */}
        <div className="p-4 flex items-center justify-between gap-4 border-b border-slate-200">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-64">
              <input 
                type="text" 
                placeholder="Search listings..."
                className="w-full pl-4 pr-4 py-2 bg-[#fefce8] border border-slate-200 rounded-lg text-[12px] font-medium outline-none focus:border-[#eab308]/30 transition-all text-slate-600"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowSubTypes(!showSubTypes)}
                className="px-4 py-2 bg-[#fefce8] border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 flex items-center gap-6 hover:bg-[#fefce8]/80 transition-all"
              >
                {selectedSubType} <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showSubTypes && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 shadow-xl rounded-lg z-50 py-1 overflow-hidden">
                  {subTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedSubType(type);
                        setShowSubTypes(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 text-[12px] transition-colors ${selectedSubType === type ? 'bg-[#3b82f6] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[12px] text-slate-400 font-medium italic">0 listings</span>
          </div>
          
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2 bg-[#C59D3F] hover:bg-[#B48C35] text-white rounded-lg text-[11px] font-bold flex items-center gap-2 shadow-lg shadow-[#C59D3F]/20 transition-all"
          >
            <Plus size={14} /> Add Listing
          </button>
        </div>

        {/* Card Content (Empty State) */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#fefce8] rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl opacity-50">📋</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-black">No listings in this section</h3>
        </div>
      </div>

      {/* High-Fidelity Add Listing Modal */}
      <PostListingModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} intent={intent} />
    </div>
  </div>
);
};

export default ResidentialInventory;
