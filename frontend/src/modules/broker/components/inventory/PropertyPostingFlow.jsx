import React, { useState, useEffect } from 'react';
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
  X,
  Loader2,
  Image as ImageIcon,
  Upload,
  XCircle
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPosting, uploadPropertyImages } from '../../services/postingService';

// Maps display labels (from CONFIG) → schema enum keys
const SUBTYPE_KEY_MAP = {
  'Apartments':          'APARTMENTS',
  'Low Rise Floors':     'LOW_RISE_FLOORS',
  'Kothi / Villas':      'KOTHI_VILLAS',
  'Plots':               'PLOTS',
  'Shop / Showroom':     'SHOP_SHOWROOM',
  'Office':              'OFFICE',
  'Warehouse':           'WAREHOUSE',
  'Standalone Building': 'STANDALONE_BUILDING',
  'Plot':                'PLOT',
};

const CONFIG = {
  RESIDENTIAL: {
    label: 'Residential',
    icon: <Home size={20} />,
    flows: {
      REQUIREMENT: {
        label: 'Requirement',
        subLabel: 'Client looking for property',
        intents: {
          PURCHASE: { 
            label: 'Wanted on Purchase',
            fields: [
              'location',
              'project',
              'bedrooms',
              'size',
              'budget_sqft',
              'lumpsum_budget',
              'total_budget',
              'status_res',
              'short_description'
            ]
          },
          RENT: { 
            label: 'Wanted on Rent',
            fields: ['location', 'project', 'bedrooms', 'size', 'budget_rent', 'tenant_status', 'short_description']
          }
        }
      },
      AVAILABILITY: {
        label: 'Availability',
        subLabel: 'Property available for deal',
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
    label: 'Commercial',
    icon: <Building2 size={20} />,
    flows: {
      REQUIREMENT: {
        label: 'Requirement',
        subLabel: 'Client looking for space',
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
        subLabel: 'Space available for deal',
        intents: {
          SALE: { 
            label: 'Available on Sale',
            fields: ['location', 'project', 'size', 'price_sqft', 'total_cost', 'vacant_rented', 'status_com']
          },
          LEASE: { 
            label: 'Available on Lease',
            fields: ['location', 'project', 'size', 'rent_type', 'total_rent']
          }
        }
      }
    },
    types: ['Shop / Showroom', 'Office', 'Warehouse', 'Standalone Building', 'Plot', 'Apartments']
  }
};

const DynamicPropertyForm = ({ selections, onCancel, onBack, onSubmit }) => {
  const navigate = useNavigate();
  const { propertyType, flowType, intent, subType } = selections;
  const isResidentialPurchaseRequirement =
    propertyType === 'RESIDENTIAL' && flowType === 'REQUIREMENT' && intent === 'PURCHASE';

  // ── Controlled form state (keys match backend schema exactly) ──────────────
  const [formData, setFormData] = useState({
    location: '', project: '',
    size: '', sizeUnit: 'SQ_FT',
    bedrooms: '',
    priceRate: '', priceRateType: 'PER_SQFT',
    totalAmount: '', totalAmountUnit: 'LAKH',
    budgetMin: '', budgetMax: '', budgetUnit: 'LAKH',
    occupancy: '', constructionStatus: '',
    tenantPreference: [], shortDescription: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }));
  
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (formData.images.length + files.length > 5) {
      setError('Max 5 images allowed');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const result = await uploadPropertyImages(files);
      if (result.success) {
        set('images', [...formData.images, ...result.data]);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    set('images', formData.images.filter(img => img !== url));
  };

  const toggleArr = (key, val) => setFormData(p => ({
    ...p,
    [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const missingFields = [];
    fields.forEach(f => {
      if (f === 'location' && !formData.location.trim()) missingFields.push('Location');
      if (f === 'project' && !formData.project.trim()) missingFields.push('Project');
      if (f === 'size' && !formData.size) missingFields.push('Size');
      if (f === 'bedrooms' && !formData.bedrooms) missingFields.push('BHK');
      if ((f === 'price_sqft' || f === 'rent_type' || f === 'budget_type') && !formData.priceRate) missingFields.push('Rate/Price');
      if ((f === 'total_cost' || f === 'total_rent') && !formData.totalAmount) missingFields.push('Total Amount');
      if (f === 'total_budget') {
        if (flowType === 'REQUIREMENT') {
          if (!formData.budgetMin || !formData.budgetMax) missingFields.push('Budget Range');
        } else {
          if (!formData.totalAmount) missingFields.push('Total Budget');
        }
      }
      if (f === 'budget_rent' && (!formData.budgetMin || !formData.budgetMax)) missingFields.push('Budget Range');
      if (f === 'vacant_rented' && !formData.occupancy) missingFields.push('Occupancy');
      if ((f === 'status_res' || f === 'status_com') && !formData.constructionStatus) missingFields.push('Status');
      if (f === 'short_description' && !formData.shortDescription.trim()) missingFields.push('Short Description');
    });

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        vertical:  propertyType,
        postType:  flowType,
        intent:    intent,
        subType:   propertyType === 'COMMERCIAL' && subType === 'Apartments' 
                   ? 'COMMERCIAL_APARTMENTS' 
                   : (SUBTYPE_KEY_MAP[subType] || subType),
        // Remove empty strings so mongoose doesn't complain
        ...Object.fromEntries(
          Object.entries(formData).filter(([, v]) =>
            v !== '' && !(Array.isArray(v) && v.length === 0)
          )
        )
      };
      const result = await createPosting(payload);
      if (result.success) {
        onSubmit(result.data);
        // Navigate based on post type
        if (payload.postType === 'AVAILABILITY') {
          navigate('/my-listings');
        } else {
          navigate('/my-requirements');
        }
      } else {
        setError(result.message || 'Failed to create posting');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentIntent = CONFIG[propertyType].flows[flowType].intents[intent];
  let fields = [...currentIntent.fields];

  // Dynamic field filtering based on subtype for Residential
  if (propertyType === 'RESIDENTIAL') {
    if (flowType === 'REQUIREMENT') {
      if (intent === 'PURCHASE') {
        if (subType === 'Plots') {
          fields = ['location', 'project', 'size', 'budget_type', 'lumpsum_budget', 'total_budget'];
        } else if (subType === 'Low Rise Floors' || subType === 'Kothi / Villas') {
          fields = ['location', 'project', 'size', 'bedrooms', 'total_budget', 'status_res'];
        }
      } else if (intent === 'RENT') {
        if (subType === 'Low Rise Floors' || subType === 'Kothi / Villas') {
          fields = ['location', 'project', 'size', 'bedrooms', 'budget_rent'];
        }
      }
    } else if (flowType === 'AVAILABILITY') {
      if (intent === 'SALE') {
        if (subType === 'Plots') {
          fields = ['location', 'project', 'size', 'price_sqft', 'total_cost', 'images'];
        } else if (subType === 'Apartments') {
          fields = ['location', 'project', 'size', 'bedrooms', 'price_sqft', 'total_cost', 'status_res', 'images'];
        } else {
          fields = ['location', 'project', 'size', 'bedrooms', 'total_cost', 'status_res', 'images'];
        }
      } else if (intent === 'RENTALS') {
        fields = ['location', 'project', 'size', 'bedrooms', 'rent', 'images'];
      }
    }
  } else if (propertyType === 'COMMERCIAL') {
    if (flowType === 'REQUIREMENT') {
      if (intent === 'PURCHASE') {
        if (subType === 'Plot') {
          fields = ['location', 'project', 'size', 'budget_type', 'lumpsum_budget', 'total_budget'];
        } else if (subType === 'Warehouse') {
          fields = ['location', 'project', 'size', 'budget_type', 'total_budget', 'vacant_rented'];
        } else {
          fields = ['location', 'project', 'size', 'budget_type', 'total_budget', 'vacant_rented', 'status_com'];
        }
      } else if (intent === 'LEASE') {
        fields = ['location', 'project', 'size', 'budget_type', 'total_budget'];
      }
    } else if (flowType === 'AVAILABILITY') {
      if (intent === 'SALE') {
        if (subType === 'Plot') {
          fields = ['location', 'project', 'size', 'price_sqft', 'total_cost', 'images'];
        } else {
          fields = ['location', 'project', 'size', 'price_sqft', 'total_cost', 'vacant_rented', 'status_com', 'images'];
        }
      } else if (intent === 'LEASE') {
        fields = ['location', 'project', 'size', 'rent_type', 'total_rent', 'images'];
      }
    }
  }

  const units = ['Thousand', 'Lakh', 'Cr'];

  const renderField = (fieldKey) => {
    switch (fieldKey) {
      case 'location':
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location <span className="text-red-500">*</span></label>
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                placeholder="Sector / Area / City"
                value={formData.location}
                onChange={e => set('location', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        );
      case 'project':
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {propertyType === 'RESIDENTIAL' ? 'Project/Society Name' : 'Project Name'} <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                placeholder={propertyType === 'RESIDENTIAL' ? 'Enter project or society name' : 'Enter Name'}
                value={formData.project}
                onChange={e => set('project', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        );
      case 'size':
        const sizeUnits = (
          subType === 'Plots' || 
          subType === 'Plot' || 
          subType === 'Low Rise Floors' || 
          subType === 'Kothi / Villas' || 
          subType === 'Warehouse' || 
          subType === 'Standalone Building'
        ) 
          ? ['Sq. Ft.', 'Sq. Yd.', 'Sq. Mt.'] 
          : ['Sq. Ft.'];
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Size <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="number"
                  placeholder="Enter Size"
                  value={formData.size}
                  onChange={e => set('size', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all"
                />
              </div>
              {sizeUnits.length > 1 ? (
                <select
                  value={formData.sizeUnit}
                  onChange={e => set('sizeUnit', e.target.value)}
                  className="bg-slate-900 text-white rounded-xl px-3 text-[10px] font-bold uppercase tracking-widest outline-none">
                  <option value="SQ_FT">Sq. Ft.</option>
                  <option value="SQ_YD">Sq. Yd.</option>
                  <option value="SQ_MT">Sq. Mt.</option>
                </select>
              ) : (
                <div className="bg-slate-100 text-slate-500 rounded-xl px-4 flex items-center text-[10px] font-bold uppercase tracking-widest">
                  Sq.ft
                </div>
              )}
            </div>
          </div>
        );
      case 'bedrooms':
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BHK <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-5 gap-2">
              {['1', '2', '3', '4', '5+'].map(num => (
                <button
                  key={num} type="button"
                  onClick={() => set('bedrooms', num)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    formData.bedrooms === num
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white border-slate-200 hover:border-primary-500'
                  }`}>{num}</button>
              ))}
            </div>
          </div>
        );
      case 'budget_type':
      case 'price_sqft':
      case 'rent_type': {
        const priceTypeOpts = (subType === 'Plots' || subType === 'Plot')
          ? [['PER_SQFT','Per Sqft'],['PER_SQYD','Per Sqyd'],['PER_SQMT','Per Sqmt'],['LUMPSUM','Lumpsum']]
          : [['PER_SQFT','Per Sqft'],['LUMPSUM','Lumpsum']];
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {fieldKey === 'rent_type' ? 'Rent Rate' : 'Price Rate'} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="number" placeholder="Amount"
                  value={formData.priceRate}
                  onChange={e => set('priceRate', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <select value={formData.priceRateType} onChange={e => set('priceRateType', e.target.value)}
                className="bg-slate-100 text-slate-900 rounded-xl px-3 text-[10px] font-bold uppercase tracking-widest outline-none border-none">
                {priceTypeOpts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        );
      }
      case 'budget_sqft':
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget in Sq.ft. <span className="text-red-500">*</span></label>
            <div className="relative group">
              <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="e.g. 11,000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        );
      case 'budget_rent':
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget Range <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative group">
                <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="number" placeholder="Min"
                  value={formData.budgetMin} onChange={e => set('budgetMin', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <div className="relative group">
                <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="number" placeholder="Max"
                  value={formData.budgetMax} onChange={e => set('budgetMax', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all"
                />
              </div>
            </div>
          </div>
        );
      case 'rent':
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rent <span className="text-red-500">*</span></label>
            <div className="relative group">
              <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="number" placeholder="e.g. 55000"
                value={formData.totalAmount} onChange={e => set('totalAmount', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        );
      case 'tenant_status':
        return (
          <div key={fieldKey} className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tenant Preference</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[['STUDENTS','Students'],['FAMILY','Family'],['MNC','MNC'],['KOREAN','Korean'],['BUSINESSMAN','Businessman']].map(([v,l]) => (
                <button key={v} type="button"
                  onClick={() => toggleArr('tenantPreference', v)}
                  className={`rounded-xl border px-3 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    formData.tenantPreference.includes(v)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-primary-500'
                  }`}>{l}</button>
              ))}
            </div>
          </div>
        );
      case 'lumpsum_budget':
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lumpsum Budget</label>
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  placeholder="e.g. 85,00,000 - 95,00,000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <select className="bg-slate-100 text-slate-900 rounded-xl px-3 text-[10px] font-bold uppercase tracking-widest outline-none border-none">
                <option>Lakh</option>
                <option>Cr</option>
              </select>
            </div>
          </div>
        );
      case 'total_budget':
      case 'total_cost':
      case 'total_rent': {
        const totalLabel = fieldKey === 'total_budget' ? 'Total Budget' : fieldKey === 'total_rent' ? 'Total Rent' : 'Total Cost';
        const isRangeField = flowType === 'REQUIREMENT' && fieldKey === 'total_budget';
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{totalLabel} <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              {isRangeField ? (
                <div className="flex-1 flex gap-2">
                  <input type="number" placeholder="Min" value={formData.budgetMin} onChange={e => set('budgetMin', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all" />
                  <input type="number" placeholder="Max" value={formData.budgetMax} onChange={e => set('budgetMax', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all" />
                </div>
              ) : (
                <div className="relative flex-1">
                  <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="number" placeholder="Amount" value={formData.totalAmount} onChange={e => set('totalAmount', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all" />
                </div>
              )}
              <select value={isRangeField ? formData.budgetUnit : formData.totalAmountUnit}
                onChange={e => set(isRangeField ? 'budgetUnit' : 'totalAmountUnit', e.target.value)}
                className="bg-slate-900 text-white rounded-xl px-3 text-[10px] font-bold uppercase tracking-widest outline-none">
                <option value="THOUSAND">Thousand</option>
                <option value="LAKH">Lakh</option>
                <option value="CR">Cr</option>
              </select>
            </div>
          </div>
        );
      }
      case 'vacant_rented':
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Occupancy <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {[['VACANT','Vacant'],['RENTED','Rented']].map(([v,l]) => (
                <button key={v} type="button" onClick={() => set('occupancy', v)}
                  className={`py-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                    formData.occupancy === v ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-primary-500'
                  }`}>{l}</button>
              ))}
            </div>
          </div>
        );
      case 'status_res':
      case 'status_com':
        return (
          <div key={fieldKey} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {[['READY','Ready to Move'],['UNDER_CONSTRUCTION','Under Construction']].map(([v,l]) => (
                <button key={v} type="button" onClick={() => set('constructionStatus', v)}
                  className={`py-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                    formData.constructionStatus === v ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-primary-500'
                  }`}>{l}</button>
              ))}
            </div>
          </div>
        );
      case 'images':
        return (
          <div key={fieldKey} className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
              <span>Property Images (Max 5)</span>
              <span className={formData.images.length === 5 ? 'text-red-500' : ''}>{formData.images.length}/5</span>
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {formData.images.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-sm rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              ))}
              
              {formData.images.length < 5 && (
                <label className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${uploading ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:border-primary-400 hover:bg-primary-50'}`}>
                  {uploading ? (
                    <Loader2 className="text-primary-500 animate-spin" size={24} />
                  ) : (
                    <>
                      <Upload className="text-slate-400" size={24} />
                      <span className="text-[10px] font-bold text-slate-400 mt-2">Upload</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>
        );

      case 'short_description':
        return (
          <div key={fieldKey} className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Short Description <span className="text-red-500">*</span></label>
            <textarea rows={4}
              placeholder="Add a short note about furnishing, parking, floor preference, possession, etc."
              value={formData.shortDescription}
              onChange={e => set('shortDescription', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all resize-none"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-5xl mx-auto">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all group"
            title="Go Back"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
            {CONFIG[propertyType].icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Post Property</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{flowType} • {subType}</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
      </div>

      <form className="p-8 space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(f => renderField(f))}
        </div>
        {error && (
          <p className="text-red-500 text-sm font-bold">{error}</p>
        )}
        <div className="pt-4 flex items-center gap-3">
          <button type="submit" disabled={loading}
            className="px-10 py-4 bg-primary-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary-500 shadow-lg shadow-primary-600/20 transition-all disabled:opacity-60 flex items-center gap-2">
            {loading && <Loader2 size={14} className="animate-spin" />}
            {isResidentialPurchaseRequirement ? 'Submit Requirement' : 'Submit Listing'}
          </button>
          <button type="button" onClick={onCancel} className="px-10 py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
        </div>
      </form>
    </motion.div>
  );
};

const PropertyPostingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState('TYPE');
  const [selections, setSelections] = useState({ propertyType: '', flowType: '', intent: '', subType: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type && CONFIG[type]) {
      setSelections(prev => ({ ...prev, propertyType: type }));
      setStep('FLOW');
    } else {
      setStep('TYPE');
      setSelections({ propertyType: '', flowType: '', intent: '', subType: '' });
    }
  }, [location.search]);

  const handleSelect = (key, val, nextStep) => {
    setSelections(prev => ({ ...prev, [key]: val }));
    setStep(nextStep);
  };

  const ProgressTimeline = () => {
    const steps = ['Vertical', 'Purpose', 'Intent', 'Category', 'Details'];
    const currentStepIndex = ['TYPE', 'FLOW', 'INTENT', 'SUBTYPE', 'FORM'].indexOf(step);

    return (
      <div className="max-w-3xl mx-auto mb-12 px-8">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-4 left-0 w-full h-[3px] bg-slate-100 rounded-full" />
          
          {/* Active Progress Bar */}
          <motion.div 
            className="absolute top-4 left-0 h-[3px] bg-primary-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="relative flex justify-between">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-500 z-10 ${
                    i <= currentStepIndex 
                      ? 'bg-primary-600 text-white border-primary-50 shadow-lg shadow-primary-600/20 scale-110' 
                      : 'bg-white text-slate-300 border-slate-100'
                  }`}
                >
                  {i < currentStepIndex ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${i <= currentStepIndex ? 'text-slate-900' : 'text-slate-400'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSelectionScreen = () => {
    const renderHeader = (title, sub, backStep) => (
      <div className="text-center space-y-3 mb-10">
        {backStep && (
          <button onClick={() => setStep(backStep)} className="mb-4 inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
        )}
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
        <p className="text-slate-500 font-medium text-sm">{sub}</p>
      </div>
    );

    const Card = ({ onClick, icon, title, sub, variant = 'primary' }) => (
      <button onClick={onClick} className="group relative bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-500/20 transition-all text-center flex flex-col items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${variant === 'primary' ? 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white' : 'bg-slate-900 text-white'}`}>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
          {sub && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>}
        </div>
      </button>
    );

    switch (step) {
      case 'TYPE':
        return (
          <div className="max-w-4xl mx-auto">
            {renderHeader("Select Property Type", "Choose the vertical for your posting.")}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(CONFIG).map(([key, c]) => (
                <Card key={key} onClick={() => handleSelect('propertyType', key, 'FLOW')} icon={c.icon} title={c.label} sub={`Manage ${c.label} deals`} variant="dark" />
              ))}
            </div>
          </div>
        );
      case 'FLOW':
        return (
          <div className="max-w-4xl mx-auto">
            {renderHeader("What are you posting?", "Identify if this is an inventory or a requirement.", "TYPE")}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(CONFIG[selections.propertyType].flows).map(([key, c]) => (
                <Card key={key} onClick={() => handleSelect('flowType', key, 'INTENT')} icon={key === 'AVAILABILITY' ? <Building2 size={24} /> : <ClipboardList size={24} />} title={c.label} sub={c.subLabel} />
              ))}
            </div>
          </div>
        );
      case 'INTENT':
        return (
          <div className="max-w-4xl mx-auto">
            {renderHeader("Select Intent", "Specify the transaction type.", "FLOW")}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(CONFIG[selections.propertyType].flows[selections.flowType].intents).map(([key, c]) => (
                <Card key={key} onClick={() => handleSelect('intent', key, 'SUBTYPE')} icon={<Zap size={24} />} title={c.label} />
              ))}
            </div>
          </div>
        );
      case 'SUBTYPE':
        return (
          <div className="max-w-4xl mx-auto">
            {renderHeader("Property Category", "What type of property is this?", "INTENT")}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CONFIG[selections.propertyType].types.map(t => (
                <button key={t} onClick={() => handleSelect('subType', t, 'FORM')} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-primary-500 hover:shadow-lg transition-all text-center">
                  <span className="text-[11px] font-bold uppercase tracking-tight text-slate-800">{t}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'FORM':
        return (
          <DynamicPropertyForm
            selections={selections}
            onCancel={() => setStep('TYPE')}
            onBack={() => setStep('SUBTYPE')}
            onSubmit={(posted) => {
              setStep('TYPE');
              setSelections({ propertyType: '', flowType: '', intent: '', subType: '' });
            }}
          />
        );
      default: return null;
    }
  };

  return (
    <div className="py-10 px-4">
      <ProgressTimeline />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
          {renderSelectionScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PropertyPostingFlow;
