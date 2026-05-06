import React from 'react';
import { Search, ArrowLeft, Plus, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import PostListingModal from '../components/inventory/PostListingModal';

const CommercialInventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const intent = searchParams.get('intent') || 'SALE';

  const [showSubTypes, setShowSubTypes] = React.useState(false);
  const [selectedSubType, setSelectedSubType] = React.useState('All Sub-types');
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  
  const isLease = intent === 'LEASE' || intent === 'WANTED_LEASE';
  const isRequirement = intent === 'PURCHASE' || intent === 'WANTED_LEASE' || intent === 'WANTED_RENT';
  const subTypes = isLease
    ? ['All Sub-types', 'Shops/Showroom', 'Office', 'Standalone Building']
    : ['All Sub-types', 'Retail Shops/Showroom', 'Office', 'Warehouse', 'Standalone Building', 'Plot'];

  const getPageConfig = () => {
    switch (intent) {
      case 'LEASE':
        return {
          title: 'Available for Lease · Commercial',
          heading: 'Available for Lease — Commercial',
          subheading: 'Commercial properties for lease',
          bg: 'bg-[#faf9f6]'
        };
      case 'PURCHASE':
        return {
          title: 'Wanted on Purchase · Commercial',
          heading: 'Wanted on Purchase — Commercial',
          subheading: 'Buyer requirements for commercial',
          bg: 'bg-[#faf9f6]'
        };
      case 'WANTED_LEASE':
        return {
          title: 'Wanted on Lease · Commercial',
          heading: 'Wanted on Lease — Commercial',
          subheading: 'Lease requirements for commercial',
          bg: 'bg-[#faf9f6]'
        };
      default:
        return {
          title: 'Available for Sale · Commercial',
          heading: 'Available for Sale — Commercial',
          subheading: 'Commercial properties for sale',
          bg: 'bg-[#faf9f6]'
        };
    }
  };

  const config = getPageConfig();

  return (
    <div className={`-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 ${config.bg} min-h-screen transition-colors duration-300`}>
      <div className="space-y-6 pb-10">
      {/* Custom Header */}
      <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 mb-4 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 md:gap-6">
          <h1 className="text-sm md:text-lg font-serif text-black truncate max-w-[150px] md:max-w-none">{config.title}</h1>
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
        <h2 className="text-xl md:text-2xl font-serif text-black">{config.heading}</h2>
        <p className="text-[10px] md:text-[11px] text-slate-400 font-medium tracking-tight">{config.subheading}</p>
      </div>

      {/* Unified Card Container */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header (Filter Bar) */}
        <div className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 flex-1">
            <div className="relative flex-1 min-w-[180px] sm:max-w-64">
              <input 
                type="text" 
                placeholder="Search location/project..."
                className="w-full pl-4 pr-4 py-2 bg-[#fefce8] border border-slate-200 rounded-lg text-[12px] font-medium outline-none focus:border-[#eab308]/30 transition-all text-slate-600 placeholder:text-slate-600"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowSubTypes(!showSubTypes)}
                className="px-4 py-2 bg-[#fefce8] border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 flex items-center justify-between gap-4 hover:bg-[#fefce8]/80 transition-all min-w-[140px]"
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

            <span className="text-[11px] md:text-[12px] text-slate-400 font-medium italic">0 listings</span>
          </div>
          
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#c8962a] hover:bg-[#B48C35] text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#c8962a]/20 transition-all"
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
      <PostListingModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} intent={intent} vertical="Commercial" />
    </div>
  </div>
);
};

export default CommercialInventory;
