import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowLeft, Plus, ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPostings } from '../services/postingService';

import PostListingModal from '../components/inventory/PostListingModal';
import PropertyCard from '../components/inventory/PropertyCard'; // I'll check if this exists or create it

const ResidentialInventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const intent = searchParams.get('intent') || 'SALE';

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubTypes, setShowSubTypes] = useState(false);
  const [selectedSubType, setSelectedSubType] = useState('All Sub-types');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const isRequirement = ['PURCHASE', 'WANTED_RENT', 'WANTED_LEASE'].includes(intent);
  
  const subTypes = isRequirement
    ? ['All Sub-types', 'Apartments', 'Low Rise Floors', 'Kothi/Villas', 'Plots']
    : ['All Sub-types', 'Apartments', 'Low Rise Floors', 'Kothi/Villas'];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        vertical: 'RESIDENTIAL',
        intent: intent,
      };
      if (selectedSubType !== 'All Sub-types') {
        params.subType = selectedSubType.toUpperCase().replace(' ', '_').replace('/', '_');
      }
      
      const result = await getPostings(params);
      if (result.success) {
        setListings(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [intent, selectedSubType]);

  const getPageConfig = () => {
    switch (intent) {
      case 'RENT':
        return {
          title: 'Available for Rental · Residential',
          heading: 'Available for Rental — Residential',
          subheading: 'Residential properties for rent',
          bg: 'bg-[#faf7f2]'
        };
      case 'PURCHASE':
        return {
          title: 'Wanted on Purchase · Residential',
          heading: 'Wanted on Purchase — Residential',
          subheading: 'Buyer requirements for residential',
          bg: 'bg-[#faf7f2]'
        };
      case 'WANTED_RENT':
        return {
          title: 'Wanted on Rent · Residential',
          heading: 'Wanted on Rent — Residential',
          subheading: 'Tenant requirements for residential',
          bg: 'bg-[#faf7f2]'
        };
      default:
        return {
          title: 'Available for Sale · Residential',
          heading: 'Available for Sale — Residential',
          subheading: 'Residential properties listed for sale',
          bg: 'bg-[#faf7f2]'
        };
    }
  };

  const config = getPageConfig();

  return (
    <div className={`-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 ${config.bg} min-h-screen transition-colors duration-300`}>
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-normal font-serif text-[#0d1b2a]">{config.heading}</h1>
          <p className="text-sm text-[#718199] mt-1">{config.subheading}</p>
        </div>
        {/* Unified Card Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[60vh]">
          {/* Card Header (Filter Bar) */}
          <div className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2 md:gap-4 flex-1">
              <div className="relative flex-1 min-w-[180px] sm:max-w-56">
                <input 
                  type="text" 
                  placeholder="Search location/project..."
                  className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/30 transition-all text-slate-600 placeholder-[#9c7f84] tracking-tighter"
                />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowSubTypes(!showSubTypes)}
                  className="px-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-[11px] font-medium text-[#26296c] flex items-center justify-between gap-4 hover:bg-[#faf7f2]/80 transition-all min-w-[120px] tracking-tighter"
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
                        className={`w-full text-left px-4 py-1.5 text-[12px] transition-colors ${selectedSubType === type ? 'bg-[#c8962a] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 font-medium">{listings.length} listings</span>
            </div>
            
            <button 
              onClick={() => setIsPostModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#c8962a] hover:bg-[#B48C35] text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#c8962a]/20 transition-all"
            >
              <Plus size={14} /> Add Listing
            </button>
          </div>

          {/* Card Content */}
          <div className="p-4 md:p-6">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 size={40} className="animate-spin text-[#c8962a]" />
                <p className="text-sm font-bold uppercase tracking-widest">Loading inventory...</p>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <PropertyCard key={listing._id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[#fefce8] rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl opacity-50">📋</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-black">No listings in this section</h3>
                <p className="text-slate-400 text-xs mt-2">Try changing filters or add your first listing.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Add Listing Modal */}
        <PostListingModal 
          isOpen={isPostModalOpen} 
          onClose={() => setIsPostModalOpen(false)} 
          intent={intent} 
          vertical="RESIDENTIAL"
          onSuccess={fetchListings}
        />
      </div>
    </div>
  );
};

export default ResidentialInventory;
