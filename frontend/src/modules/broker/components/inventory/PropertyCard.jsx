import React from 'react';
import { MapPin, Home, BedDouble, Square, Tag, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ listing }) => {
  const {
    vertical,
    postType,
    intent,
    subType,
    location,
    project,
    size,
    sizeUnit,
    bedrooms,
    priceRate,
    priceRateType,
    totalAmount,
    totalAmountUnit,
    budgetMin,
    budgetMax,
    budgetUnit,
    constructionStatus,
    occupancy,
    images,
    createdAt
  } = listing;

  const isRequirement = postType === 'REQUIREMENT';
  const mainImage = images && images.length > 0 ? images[0] : null;

  const formatPrice = (val, unit) => {
    if (!val) return '—';
    return `${val} ${unit}`;
  };

  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/property/${listing._id}`)}
      className="bg-white rounded border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#c8962a]/20 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
    >
      {/* Media / Type Header */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {mainImage ? (
          <img src={mainImage} alt={project || subType} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
            <Home size={40} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-widest mt-2">No Image</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
            intent === 'SALE' ? 'bg-orange-500 text-white' : 
            intent === 'RENT' ? 'bg-blue-500 text-white' : 
            intent === 'PURCHASE' ? 'bg-green-600 text-white' : 'bg-slate-800 text-white'
          }`}>
            {intent.replace('_', ' ')}
          </span>
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
            {subType.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-serif font-bold text-slate-900 line-clamp-1">
              {project || 'Residential Project'}
            </h3>
            {isRequirement && (
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded uppercase tracking-tighter">Requirement</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-400 mt-1">
            <MapPin size={12} />
            <span className="text-[11px] font-medium truncate">{location}</span>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Square size={14} className="text-slate-300" />
            <span className="text-[11px] font-bold">{size} {sizeUnit.replace('_', '')}</span>
          </div>
          {vertical === 'RESIDENTIAL' && subType?.toUpperCase() !== 'PLOTS' && (
            <div className="flex items-center gap-2 text-slate-500">
              <BedDouble size={14} className="text-slate-300" />
              <span className="text-[11px] font-bold">{bedrooms} BHK</span>
            </div>
          )}
        </div>

        <div className="h-[1px] bg-slate-50 w-full" />

        {/* Pricing */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {isRequirement ? 'Budget' : 'Price'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-serif font-bold text-[#c8962a]">
                {isRequirement 
                  ? `₹${budgetMin}-${budgetMax}` 
                  : totalAmount ? `₹${totalAmount}` : 'Price on Request'
                }
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {isRequirement ? budgetUnit : totalAmountUnit}
              </span>
            </div>
          </div>
          
          <div className="text-[9px] font-bold text-slate-300 flex items-center gap-1">
            <Calendar size={10} />
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
