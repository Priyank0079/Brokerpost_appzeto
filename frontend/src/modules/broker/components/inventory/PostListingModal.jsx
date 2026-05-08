import React, { useState, useEffect } from 'react';
import { X, Camera, Video, ChevronDown, Lock, Loader2, AlertCircle, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createPosting, uploadPropertyImages, uploadPropertyVideo } from '../../services/postingService';

const PostListingModal = ({ isOpen, onClose, intent = 'SALE', vertical = 'RESIDENTIAL', onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Derived Classification
  const isRequirement = ['PURCHASE', 'WANTED_RENT', 'WANTED_LEASE'].includes(intent);
  const isRental = ['RENT', 'LEASE', 'WANTED_RENT', 'WANTED_LEASE'].includes(intent);
  const postType = isRequirement ? 'REQUIREMENT' : 'AVAILABILITY';

  const [formData, setFormData] = useState({
    vertical,
    postType,
    intent,
    subType: vertical === 'RESIDENTIAL' ? 'APARTMENTS' : 'OFFICE',
    location: '',
    project: '',
    city: 'Gurgaon',
    size: '',
    sizeUnit: 'SQ_FT',
    bedrooms: '2',
    priceRate: '',
    priceRateType: 'LUMPSUM',
    totalAmount: '',
    totalAmountUnit: 'LAKH',
    budgetMin: '',
    budgetMax: '',
    budgetUnit: 'LAKH',
    constructionStatus: 'READY',
    occupancy: 'VACANT',
    shortDescription: '',
    images: [],
    videos: []
  });

  const resetForm = () => {
    setFormData({
      vertical,
      postType,
      intent,
      subType: vertical === 'RESIDENTIAL' ? 'APARTMENTS' : 'OFFICE',
      location: '',
      project: '',
      city: 'Gurgaon',
      size: '',
      sizeUnit: 'SQ_FT',
      bedrooms: '2',
      priceRate: '',
      priceRateType: 'LUMPSUM',
      totalAmount: '',
      totalAmountUnit: 'LAKH',
      budgetMin: '',
      budgetMax: '',
      budgetUnit: 'LAKH',
      constructionStatus: 'READY',
      occupancy: 'VACANT',
      shortDescription: '',
      images: [],
      videos: []
    });
    setError('');
  };

  // Reset form when modal opens with new context
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, vertical, intent]);

  // Auto-calculate Total Price/Budget
  useEffect(() => {
    if (!isRequirement && formData.size && formData.priceRate && formData.priceRateType !== 'LUMPSUM') {
      const total = parseFloat(formData.size) * parseFloat(formData.priceRate);
      setFormData(prev => ({ ...prev, totalAmount: total }));
    }
  }, [formData.size, formData.priceRate, formData.priceRateType, isRequirement]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setLoading(true);
    setError('');
    try {
      const result = await uploadPropertyImages(files);
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...(Array.isArray(result.data) ? result.data : [result.data])].slice(0, 5)
        }));
      }
    } catch (err) {
      setError('Media upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (file.size > 20 * 1024 * 1024) {
      setError('Video size must be less than 20MB');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await uploadPropertyVideo(file);
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          videos: [result.data] // Limited to 1 video
        }));
      }
    } catch (err) {
      setError('Video upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || !formData.subType || !formData.city) {
      setError('Please fill in required fields (Location, City, Sub-type)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createPosting(formData);
      if (result.success) {
        resetForm();
        onSuccess?.();
        onClose();
      } else {
        setError(result.message || 'Failed to create listing');
      }
    } catch (err) {
      setError('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const subTypeOptions = vertical === 'RESIDENTIAL' 
    ? [
        { label: 'Apartments', value: 'APARTMENTS' },
        { label: 'Low Rise Floors', value: 'LOW_RISE_FLOORS' },
        { label: 'Kothi/Villas', value: 'KOTHI_VILLAS' },
        { label: 'Plots', value: 'PLOTS' }
      ]
    : [
        { label: 'Shops/Showroom', value: 'SHOP_SHOWROOM' },
        { label: 'Office', value: 'OFFICE' },
        { label: 'Warehouse', value: 'WAREHOUSE' },
        { label: 'Standalone Building', value: 'STANDALONE_BUILDING' },
        { label: 'Plot', value: 'PLOT' }
      ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-[#1a365d]">Add Listing</h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              {intent.replace('_', ' ')} · {vertical}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-600 text-xs font-bold items-center">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Classification Section */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-[#284366] uppercase tracking-widest border-b border-slate-200 pb-2">Classification</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Sub-type *</label>
                <div className="relative">
                  <select 
                    name="subType"
                    value={formData.subType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 outline-none appearance-none rounded-xl"
                  >
                    {subTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {vertical === 'RESIDENTIAL' && formData.subType !== 'PLOTS' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Configuration (BHK)</label>
                  <div className="relative">
                    <select 
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 outline-none appearance-none rounded-xl"
                    >
                      {['1', '2', '3', '4', '5+'].map(v => (
                        <option key={v} value={v}>{v} BHK</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Location Section */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-[#284366] uppercase tracking-widest border-b border-slate-200 pb-2">Location Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Location / Area *</label>
                <input 
                  type="text" 
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Sector or Locality" 
                  className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 rounded-xl outline-none placeholder:text-slate-400" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">City *</label>
                <div className="relative">
                  <select 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 outline-none appearance-none rounded-xl"
                  >
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Noida">Noida</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Faridabad">Faridabad</option>
                    <option value="Greater Noida">Greater Noida</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Project / Society</label>
                <input 
                  type="text" 
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  placeholder="e.g. DLF Magnolias" 
                  className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 rounded-xl outline-none placeholder:text-slate-400" 
                />
              </div>
            </div>
          </section>

          {/* Area & Pricing Section */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-[#284366] uppercase tracking-widest border-b border-slate-200 pb-2">Area & Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Area / Size *</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    name="size"
                    required
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="Size" 
                    className="flex-1 px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 rounded-xl outline-none" 
                  />
                  <select 
                    name="sizeUnit"
                    value={formData.sizeUnit}
                    onChange={handleChange}
                    className="w-24 px-2 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none"
                  >
                    <option value="SQ_FT">Sq.Ft</option>
                    <option value="SQ_YD">Sq.Yd</option>
                    <option value="SQ_MT">Sq.Mt</option>
                  </select>
                </div>
              </div>

              {!isRequirement ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Rate / Price (₹)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      name="priceRate"
                      value={formData.priceRate}
                      onChange={handleChange}
                      placeholder="Rate" 
                      className="flex-1 px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 rounded-xl outline-none" 
                    />
                    <select 
                      name="priceRateType"
                      value={formData.priceRateType}
                      onChange={handleChange}
                      className="w-24 px-2 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 outline-none"
                    >
                      <option value="PER_SQFT">/SqFt</option>
                      <option value="PER_SQYD">/SqYd</option>
                      <option value="LUMPSUM">Fixed</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Budget Range (Lakhs)</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      name="budgetMin"
                      value={formData.budgetMin}
                      onChange={handleChange}
                      placeholder="Min" 
                      className="w-1/2 px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 rounded-xl outline-none" 
                    />
                    <span className="text-slate-300">-</span>
                    <input 
                      type="number" 
                      name="budgetMax"
                      value={formData.budgetMax}
                      onChange={handleChange}
                      placeholder="Max" 
                      className="w-1/2 px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 rounded-xl outline-none" 
                    />
                  </div>
                </div>
              )}
            </div>

            {!isRequirement && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estimated Total</p>
                <span className="text-xl font-serif text-[#1a365d]">
                  {formData.totalAmount ? `₹ ${formData.totalAmount.toLocaleString()}` : 'On Request'}
                </span>
              </div>
            )}
          </section>

          {/* Status & Remarks Section */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-[#284366] uppercase tracking-widest border-b border-slate-200 pb-2">Status & Remarks</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Construction Status</label>
                <div className="relative">
                  <select 
                    name="constructionStatus"
                    value={formData.constructionStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 outline-none appearance-none rounded-xl"
                  >
                    <option value="READY">Ready to Move</option>
                    <option value="UNDER_CONSTRUCTION">Under Construction</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              {vertical === 'COMMERCIAL' && !isRequirement && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Occupancy</label>
                  <div className="relative">
                    <select 
                      name="occupancy"
                      value={formData.occupancy}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 outline-none appearance-none rounded-xl"
                    >
                      <option value="VACANT">Vacant</option>
                      <option value="RENTED">Rented / ROI</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Short Description / Notes</label>
              <textarea 
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Add any specific details or preferences..." 
                className="w-full px-4 py-3 bg-[#fefce8] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-sm font-bold text-slate-700 h-24 resize-none rounded-xl outline-none placeholder:text-slate-400"
              />
            </div>
          </section>

          {/* Media Section */}
          {!isRequirement && (
            <section className="space-y-4">
              <h3 className="text-[11px] font-black text-[#284366] uppercase tracking-widest border-b border-slate-200 pb-2">Property Media</h3>
              
              {/* Photos */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Photos (Up to 5)</p>
                <div className="flex flex-wrap gap-3">
                  <label className="w-24 h-24 relative group cursor-pointer">
                    <input type="file" multiple accept="image/*" onChange={handleMediaUpload} className="hidden" />
                    <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-slate-50 transition-all">
                      <Camera size={20} className="text-slate-400" />
                      <p className="text-[8px] font-black text-slate-400 uppercase">Add Photo</p>
                    </div>
                  </label>
                  
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border border-slate-100 relative group shadow-sm">
                      <img src={img} alt="Property" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                        className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Video Walkthrough</p>
                {!formData.videos[0] ? (
                  <label className="w-full h-20 relative group cursor-pointer">
                    <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                      <Video size={20} className="text-slate-400" />
                      <p className="text-[9px] font-black text-slate-400 uppercase">Upload Video Walkthrough</p>
                    </div>
                  </label>
                ) : (
                  <div className="w-full h-20 bg-slate-900 rounded-xl relative overflow-hidden group shadow-md">
                    <video className="w-full h-full object-cover opacity-60">
                      <source src={formData.videos[0]} type="video/mp4" />
                    </video>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, videos: [] }))}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-red-500 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Footer Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-slate-200 text-slate-500 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-[#c8962a] hover:bg-[#B48C35] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#c8962a]/20 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Save Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostListingModal;
