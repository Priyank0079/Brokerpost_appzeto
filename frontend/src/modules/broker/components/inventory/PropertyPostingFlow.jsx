import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Home, 
  ClipboardList, 
  Zap, 
  MapPin, 
  CircleDollarSign, 
  Layout, 
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';

const CONFIG = {
  RESIDENTIAL: {
    label: 'Residential Property',
    icon: <Home size={24} />,
    flows: {
      REQUIREMENT: {
        label: 'Requirement',
        subLabel: 'Broker Requirement',
        intents: {
          PURCHASE: { 
            label: 'Wanted on Purchase',
            fields: ['location', 'project', 'size', 'bedrooms', 'budget_type', 'total_budget', 'status_res']
          },
          RENT: { 
            label: 'Wanted on Rent',
            fields: ['location', 'project', 'size', 'bedrooms', 'budget_rent']
          }
        }
      },
      AVAILABILITY: {
        label: 'Availability',
        subLabel: 'Broker Inventory',
        intents: {
          SALE: { 
            label: 'Available on Sale',
            fields: ['location', 'project', 'size', 'bedrooms', 'price_sqft', 'total_cost', 'status_res']
          },
          RENTALS: { 
            label: 'Available on Rentals',
            fields: ['location', 'project', 'size', 'bedrooms', 'rent']
          }
        }
      }
    },
    types: ['Apartments', 'Low Rise Floors', 'Kothi / Villas', 'Plots']
  },
  COMMERCIAL: {
    label: 'Commercial Property',
    icon: <Building2 size={24} />,
    flows: {
      REQUIREMENT: {
        label: 'Requirement',
        subLabel: 'Broker Requirement',
        intents: {
          PURCHASE: { 
            label: 'Wanted on Purchase',
            fields: ['location', 'project', 'size', 'budget_type', 'total_budget', 'status_com']
          },
          LEASE: { 
            label: 'Wanted on Lease',
            fields: ['location', 'project', 'size', 'budget_type', 'total_budget']
          }
        }
      },
      AVAILABILITY: {
        label: 'Availability',
        subLabel: 'Broker Inventory',
        intents: {
          SALE: { 
            label: 'Available on Sale',
            fields: ['location', 'project', 'size', 'price_sqft', 'total_cost', 'status_com']
          },
          LEASE: { 
            label: 'Available on Lease',
            fields: ['location', 'project', 'size', 'rent_type']
          }
        }
      }
    },
    types: ['Shop / Showroom', 'Office', 'Warehouse', 'Standalone Building', 'Plot']
  }
};

const DynamicPropertyForm = ({ config, selections, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const { propertyType, flowType, intent, subType } = selections;

  const currentIntent = CONFIG[propertyType].flows[flowType].intents[intent];
  const fields = currentIntent.fields;

  // Rule: Bedrooms only for Residential (not plots)
  const showBedrooms = propertyType === 'RESIDENTIAL' && subType !== 'Plots' && fields.includes('bedrooms');
  
  // Rule: Floor can be included for apartments or offices (optional but let's show if relevant)
  const showFloor = (subType === 'Apartments' || subType === 'Office');

  const [pricing, setPricing] = useState({
    min: '',
    max: '',
    unit: 'Lakh',
    rate: '',
    rateUnit: 'Sqft',
    total: '',
    totalUnit: 'Cr'
  });

  const units = ['Thousand', 'Lakh', 'Cr'];

  const renderPricingInput = (label, valueKey, unitKey, placeholder, isRange = false) => (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{label}</label>
      <div className="flex gap-3">
        {isRange ? (
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1 group">
              <input 
                type="number" 
                placeholder="Min"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
            </div>
            <div className="flex items-center text-slate-300 font-bold">-</div>
            <div className="relative flex-1 group">
              <input 
                type="number" 
                placeholder="Max"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
            </div>
          </div>
        ) : (
          <div className="relative flex-1 group">
            <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
            <input 
              type="number" 
              placeholder={placeholder}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
            />
          </div>
        )}
        <select className="bg-slate-900 text-white rounded-2xl px-4 text-[10px] font-black uppercase tracking-widest outline-none border-none appearance-none cursor-pointer hover:bg-primary-600 transition-colors">
          {units.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
    </div>
  );

  const renderField = (fieldKey) => {
    switch (fieldKey) {
      case 'location':
        return (
          <div key={fieldKey} className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Sector / Area / City"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
            </div>
          </div>
        );
      case 'project':
        return (
          <div key={fieldKey} className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project / Society Name</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Enter Name"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
            </div>
          </div>
        );
      case 'size':
        return (
          <div key={fieldKey} className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Size {propertyType === 'RESIDENTIAL' ? '(Sqft or Sqyd)' : '(Sqft)'}</label>
            <div className="relative group">
              <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
              <input 
                type="number" 
                placeholder="Enter Size"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
            </div>
          </div>
        );
      case 'bedrooms':
        if (!showBedrooms) return null;
        return (
          <div key={fieldKey} className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Number of Bedrooms</label>
            <div className="grid grid-cols-5 gap-2">
              {['1', '2', '3', '4', '5+'].map(num => (
                <button 
                  key={num}
                  type="button"
                  className="py-3 rounded-xl border border-slate-100 bg-white text-xs font-black hover:border-primary-500 hover:text-primary-600 transition-all"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        );
      case 'budget_type':
      case 'price_sqft':
        return (
          <div key={fieldKey} className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {fieldKey === 'budget_type' ? 'Budget Rate / Sqft or Lumpsum' : 'Price Per Sqft'}
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                <input 
                  type="number" 
                  placeholder="Amount"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
              <select className="bg-slate-100 text-slate-900 rounded-2xl px-4 text-[10px] font-black uppercase tracking-widest outline-none border-none cursor-pointer">
                <option>Per Sqft</option>
                <option>Lumpsum</option>
                <option>Per Sqyd</option>
              </select>
            </div>
          </div>
        );
      case 'total_budget':
      case 'total_cost':
      case 'total_price':
        return (
          <div key={fieldKey} className="space-y-0">
             {renderPricingInput(
               `Total ${fieldKey.includes('budget') ? 'Budget' : 'Cost'}`, 
               'total', 
               'totalUnit', 
               'Enter Total Amount',
               flowType === 'REQUIREMENT' // Show range for Requirements
             )}
             <p className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
               Calculated based on rate and size
             </p>
          </div>
        );
      case 'budget_rent':
      case 'rent':
      case 'rent_type':
        return (
          <div key={fieldKey} className="space-y-0">
            {renderPricingInput(
               fieldKey.includes('budget') ? 'Budget for Rent' : 'Rent Amount',
               'rent',
               'rentUnit',
               'Enter Rent Amount'
            )}
            <div className="mt-4 flex gap-2">
              {['Per Month', 'Per Sqft', 'Maintenance Inc.'].map(tag => (
                <button key={tag} className="px-3 py-1 rounded-full bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-primary-50 hover:text-primary-600 transition-all border border-slate-100">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        );
      case 'status_res':
        return (
          <div key={fieldKey} className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
            <div className="grid grid-cols-2 gap-4">
              {['Ready to Move', 'Under Construction'].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  className="py-4 rounded-2xl border border-slate-100 bg-white text-xs font-black hover:border-primary-500 hover:text-primary-600 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 'status_com':
        return (
          <div key={fieldKey} className="text-[10px] font-black text-slate-400 uppercase tracking-widest space-y-4">
            <label>Current Status</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Vacant', 'Rented', 'Ready to Move', 'Under Construction'].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  className="py-4 rounded-2xl border border-slate-100 bg-white text-[10px] font-black hover:border-primary-500 hover:text-primary-600 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
    >
      <div className="p-8 md:p-12 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl">
            {CONFIG[propertyType].icon}
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Post Property</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{flowType}</span>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subType}</span>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentIntent.label}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="p-4 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <form className="p-8 md:p-12 space-y-12" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {/* Sections based on UI Requirements */}
        
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Building2 size={16} />
            </div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Basic Info</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderField('location')}
            {renderField('project')}
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layout size={16} />
            </div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Property Details</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderField('size')}
            {showBedrooms && renderField('bedrooms')}
            {showFloor && (
               <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor Number (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Enter Floor"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CircleDollarSign size={16} />
            </div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Pricing & Budget</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fields.map(f => {
              if (['budget_type', 'price_sqft', 'total_budget', 'total_cost', 'total_price', 'budget_rent', 'rent', 'rent_type'].includes(f)) {
                return renderField(f);
              }
              return null;
            })}
          </div>
        </div>

        {/* Status */}
        {(fields.includes('status_res') || fields.includes('status_com')) && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
              <h4 className="text-lg font-black text-slate-900 tracking-tight">Current Status</h4>
            </div>
            {renderField(fields.includes('status_res') ? 'status_res' : 'status_com')}
          </div>
        )}

        {/* Submit */}
        <div className="pt-8 flex flex-col md:flex-row items-center gap-4">
           <button 
            type="submit"
            className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary-600 transition-all shadow-2xl shadow-slate-900/20"
           >
             Submit Listing
           </button>
           <button 
            type="button"
            onClick={onCancel}
            className="w-full md:w-auto px-12 py-5 bg-transparent text-slate-400 font-black uppercase tracking-[0.2em] text-xs hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
           >
             Cancel
           </button>
        </div>
      </form>
    </motion.div>
  );
};

import { useLocation } from 'react-router-dom';

const PropertyPostingFlow = () => {
  const location = useLocation();
  const [step, setStep] = useState('TYPE'); // TYPE -> FLOW -> INTENT -> SUBTYPE -> FORM
  const [selections, setSelections] = useState({
    propertyType: '',
    flowType: '',
    intent: '',
    subType: ''
  });

  // Handle pre-selection from Sidebar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type && CONFIG[type]) {
      setSelections(prev => ({ ...prev, propertyType: type }));
      setStep('FLOW');
    } else {
      setStep('TYPE');
      setSelections({
        propertyType: '',
        flowType: '',
        intent: '',
        subType: ''
      });
    }
  }, [location.search]);

  const handleSelect = (key, val, nextStep) => {
    setSelections(prev => ({ ...prev, [key]: val }));
    setStep(nextStep);
  };

  const ProgressTimeline = () => {
    const steps = [
      { id: 'TYPE', label: 'Vertical', selection: selections.propertyType ? CONFIG[selections.propertyType]?.label : '' },
      { id: 'FLOW', label: 'Purpose', selection: selections.flowType ? CONFIG[selections.propertyType]?.flows[selections.flowType]?.label : '' },
      { id: 'INTENT', label: 'Intent', selection: selections.intent ? CONFIG[selections.propertyType]?.flows[selections.flowType]?.intents[selections.intent]?.label : '' },
      { id: 'SUBTYPE', label: 'Category', selection: selections.subType },
      { id: 'FORM', label: 'Details' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === step);

    return (
      <div className="max-w-4xl mx-auto mb-16 px-4">
        <div className="relative flex justify-between">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary-600 -translate-y-1/2 -z-10" 
            initial={{ width: 0 }}
            animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />

          {steps.map((s, i) => {
            const isCompleted = i < currentStepIndex;
            const isActive = i === currentStepIndex;
            
            return (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div 
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 border-4 shadow-xl ${
                    isCompleted 
                      ? 'bg-primary-600 text-white border-primary-50 shadow-primary-600/20' 
                      : isActive 
                        ? 'bg-white text-slate-900 border-primary-600 shadow-slate-200'
                        : 'bg-white text-slate-300 border-slate-50'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <div className="text-center">
                  <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                  {s.selection && (
                    <p className="text-[8px] font-bold text-primary-500 uppercase tracking-tighter mt-0.5 max-w-[80px] truncate">
                      {s.selection}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSelectionScreen = () => {
    switch (step) {
      case 'TYPE':
        return (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Select Property Type</h2>
              <p className="text-slate-500 font-medium text-lg">Choose the vertical for your posting.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {Object.entries(CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleSelect('propertyType', key, 'FLOW')}
                  className="group relative bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-primary-500/20 transition-all text-left overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform`} />
                  <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center mb-8 shadow-2xl group-hover:bg-primary-600 transition-colors">
                    {config.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{config.label}</h3>
                  <p className="text-slate-400 text-sm font-medium">Manage all {config.label.toLowerCase()} listings and requirements.</p>
                  <div className="mt-8 flex items-center gap-2 text-primary-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Select Vertical <ChevronRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'FLOW':
        const flowConfig = CONFIG[selections.propertyType].flows;
        return (
          <div className="space-y-12">
            <button onClick={() => setStep('TYPE')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors">
              <ArrowLeft size={14} /> Back to Vertical
            </button>
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">What are you posting?</h2>
              <p className="text-slate-500 font-medium text-lg">Identify if this is an inventory or a requirement.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {Object.entries(flowConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleSelect('flowType', key, 'INTENT')}
                  className="group bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-primary-500/20 transition-all text-left"
                >
                  <div className="w-16 h-16 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center mb-8 shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-all">
                    {key === 'AVAILABILITY' ? <Building2 size={24} /> : <ClipboardList size={24} />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">{config.label}</h3>
                  <p className="text-primary-600 text-[10px] font-black uppercase tracking-widest">{config.subLabel}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 'INTENT':
        const intentConfig = CONFIG[selections.propertyType].flows[selections.flowType].intents;
        return (
          <div className="space-y-12">
            <button onClick={() => setStep('FLOW')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors">
              <ArrowLeft size={14} /> Back to Flow
            </button>
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Select Intent</h2>
              <p className="text-slate-500 font-medium text-lg">Specify the transaction type.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {Object.entries(intentConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleSelect('intent', key, 'SUBTYPE')}
                  className="group bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-primary-500/20 transition-all text-left"
                >
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-8 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">{config.label}</h3>
                </button>
              ))}
            </div>
          </div>
        );
      case 'SUBTYPE':
        const subTypes = CONFIG[selections.propertyType].types;
        return (
          <div className="space-y-12">
            <button onClick={() => setStep('INTENT')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors">
              <ArrowLeft size={14} /> Back to Intent
            </button>
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Property Category</h2>
              <p className="text-slate-500 font-medium text-lg">What type of {selections.propertyType.toLowerCase()} property is this?</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {subTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleSelect('subType', type, 'FORM')}
                  className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-xl hover:border-primary-500/20 transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                    <Layout size={20} />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">{type}</h3>
                </button>
              ))}
            </div>
          </div>
        );
      case 'FORM':
        return (
          <DynamicPropertyForm 
            config={CONFIG} 
            selections={selections} 
            onCancel={() => setStep('TYPE')}
            onSubmit={() => alert('Property Posted Successfully!')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-start py-12">
      <ProgressTimeline />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSelectionScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PropertyPostingFlow;
