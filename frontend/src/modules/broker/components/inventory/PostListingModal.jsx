import React, { useState, useEffect } from 'react';
import { X, Camera, Video, ChevronDown, Lock, Loader2, AlertCircle, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createPosting, updatePosting, uploadPropertyImages, uploadPropertyVideo } from '../../services/postingService';

const PostListingModal = ({ isOpen, onClose, intent = 'SALE', vertical = 'RESIDENTIAL', posting = null, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const isEdit = !!posting;

  const [formData, setFormData] = useState({
    vertical,
    postType: 'AVAILABILITY',
    intent,
    subType: vertical === 'RESIDENTIAL' ? 'APARTMENTS' : 'OFFICE',
    location: '',
    project: '',
    city: user?.city || 'Gurgaon',
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
    remarks: '',
    images: [],
    videos: []
  });

  // Derived Classification
  const isRequirement = ['PURCHASE', 'WANTED_RENT', 'WANTED_LEASE'].includes(formData.intent || intent);
  const isRental = ['RENT', 'LEASE', 'WANTED_RENT', 'WANTED_LEASE', 'RENTALS'].includes(formData.intent || intent);
  const postType = isRequirement ? 'REQUIREMENT' : 'AVAILABILITY';

  const resetForm = () => {
    const isReq = ['PURCHASE', 'WANTED_RENT', 'WANTED_LEASE'].includes(intent);
    setFormData({
      vertical,
      postType: isReq ? 'REQUIREMENT' : 'AVAILABILITY',
      intent,
      subType: vertical === 'RESIDENTIAL' ? 'APARTMENTS' : 'OFFICE',
      location: '',
      project: '',
      city: user?.city || 'Gurgaon',
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
      remarks: '',
      images: [],
      videos: []
    });
    setError('');
  };

  // Reset or populate form when modal state changes
  useEffect(() => {
    if (isOpen) {
      if (posting) {
        // Handle legacy intent conversions
        let mappedIntent = posting.intent || intent;
        if (posting.postType === 'REQUIREMENT' && posting.intent === 'LEASE') {
          mappedIntent = 'WANTED_LEASE';
        } else if (posting.postType === 'REQUIREMENT' && posting.intent === 'RENT') {
          mappedIntent = 'WANTED_RENT';
        } else if (posting.postType === 'AVAILABILITY' && posting.intent === 'RENTALS') {
          mappedIntent = 'RENT';
        }

        setFormData({
          vertical: posting.vertical || vertical,
          postType: posting.postType || 'AVAILABILITY',
          intent: mappedIntent,
          subType: posting.subType || 'APARTMENTS',
          location: posting.location || '',
          project: posting.project || '',
          city: posting.city || user?.city || 'Gurgaon',
          size: posting.size || '',
          sizeUnit: posting.sizeUnit || 'SQ_FT',
          bedrooms: posting.bedrooms || '2',
          priceRate: posting.priceRate || '',
          priceRateType: posting.priceRateType || 'LUMPSUM',
          totalAmount: posting.totalAmount || '',
          totalAmountUnit: posting.totalAmountUnit || 'LAKH',
          budgetMin: posting.budgetMin || '',
          budgetMax: posting.budgetMax || '',
          budgetUnit: posting.budgetUnit || 'LAKH',
          constructionStatus: posting.constructionStatus || 'READY',
          occupancy: posting.occupancy || 'VACANT',
          shortDescription: posting.shortDescription || '',
          remarks: posting.remarks || '',
          images: posting.images || [],
          videos: posting.videos || []
        });
        setError('');
      } else {
        resetForm();
      }
    }
  }, [isOpen, posting, vertical, intent]);

  // Auto-calculate Total Price/Budget
  useEffect(() => {
    if (!isRequirement && formData.priceRate) {
      let total = 0;
      if (formData.priceRateType === 'LUMPSUM') {
        total = parseFloat(formData.priceRate) || 0;
      } else if (formData.size) {
        total = (parseFloat(formData.size) || 0) * (parseFloat(formData.priceRate) || 0);
      }
      setFormData(prev => ({ ...prev, totalAmount: total }));
    } else {
      setFormData(prev => ({ ...prev, totalAmount: '' }));
    }
  }, [formData.size, formData.priceRate, formData.priceRateType, isRequirement]);

  const [dynamicSubTypes, setDynamicSubTypes] = useState([]);

  useEffect(() => {
    import('../../services/categoryService').then(({ getCategories }) => {
      getCategories({ vertical: formData.vertical, intent: formData.intent || intent }).then(res => {
        if (res.success && res.data.length > 0) {
          const cat = res.data[0];
          setDynamicSubTypes(cat.subCategories || []);
          
          // Auto-select first subtype if current one is not in list
          setFormData(prev => {
            if (cat.subCategories && cat.subCategories.length > 0 && !cat.subCategories.includes(prev.subType)) {
              return { ...prev, subType: cat.subCategories[0] };
            }
            return prev;
          });
        } else {
          setDynamicSubTypes([]);
        }
      });
    });
  }, [formData.vertical, formData.intent, intent]);

  const [showUploadOptions, setShowUploadOptions] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Prevent special characters in location and project
    if (name === 'location' || name === 'project') {
      value = value.replace(/[^a-zA-Z0-9\s,.-]/g, '');
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setImageLoading(true);
    setError('');
    try {
      // Compress files before upload to speed up camera uploads
      const compressImage = (file) => {
        return new Promise((resolve) => {
          if (!file.type.startsWith('image/')) return resolve(file);
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1200;
              const MAX_HEIGHT = 1200;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
              } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg', lastModified: Date.now() }));
                } else {
                  resolve(file);
                }
              }, 'image/jpeg', 0.8);
            };
            img.onerror = () => resolve(file);
            img.src = event.target.result;
          };
          reader.onerror = () => resolve(file);
          reader.readAsDataURL(file);
        });
      };

      const compressedFilesArray = await Promise.all(Array.from(files).map(compressImage));

      // We still pass a FileList-like or Array to uploadPropertyImages depending on what it expects
      // Usually fetch/FormData can append from an Array.
      const result = await uploadPropertyImages(compressedFilesArray);
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...(Array.isArray(result.data) ? result.data : [result.data])].slice(0, 5)
        }));
      }
    } catch (err) {
      setError('Media upload failed');
    } finally {
      setImageLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (file.size > 20 * 1024 * 1024) {
      setVideoError('Video size must be less than 20MB. Please select a smaller file.');
      return;
    }

    setVideoLoading(true);
    setVideoError('');
    setError('');
    try {
      const result = await uploadPropertyVideo(file);
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          videos: [result.data] // Limited to 1 video
        }));
      } else {
        setVideoError('Video upload failed');
      }
    } catch (err) {
      setVideoError('Video upload failed');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Custom inline validation
    const errors = {};
    if (!formData.subType) errors.subType = 'Please select a sub-type.';
    if (!formData.location) errors.location = 'Location / Area is required.';
    if (!formData.city) errors.city = 'City is required.';
    if (!isRequirement && !formData.size) errors.size = 'Area / Size is required.';
    if (!isRequirement && !formData.priceRate) errors.priceRate = 'Rate / Price is required.';
    
    if (isRequirement) {
      if (!formData.budgetMin) errors.budgetMin = 'Minimum Budget is mandatory for Requirement listings.';
      if (!formData.budgetMax) errors.budgetMax = 'Maximum Budget is mandatory for Requirement listings.';
      
      if (formData.budgetMin && formData.budgetMax) {
        if (parseFloat(formData.budgetMax) <= parseFloat(formData.budgetMin)) {
          errors.budgetMax = 'Maximum Budget must be greater than Minimum Budget.';
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields.');
      
      // Find the first field with an error and scroll to it
      setTimeout(() => {
        const firstErrorName = Object.keys(errors)[0];
        const firstErrorField = document.querySelector(`[name="${firstErrorName}"]`);
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorField.focus();
        }
      }, 50);
      
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError('');

    try {
      let result;
      if (isEdit) {
        result = await updatePosting(posting._id, formData);
      } else {
        result = await createPosting(formData);
      }
      
      if (result.success) {
        resetForm();
        onSuccess?.();
        window.dispatchEvent(new Event('listing-updated'));
        onClose();
      } else {
        setError(result.message || `Failed to ${isEdit ? 'update' : 'create'} listing`);
      }
    } catch (err) {
      setError('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const subTypeOptions = dynamicSubTypes.length > 0 
    ? dynamicSubTypes.map(st => ({ label: st, value: st }))
    : [
        { label: 'Property', value: 'PROPERTY' } // Fallback
      ];

  const currentIntent = formData.intent || intent;
  const currentVertical = formData.vertical || vertical;
  const hideUnderConstruction = 
    (currentIntent === 'WANTED_LEASE' && currentVertical === 'COMMERCIAL') ||
    (currentIntent === 'WANTED_RENT' && currentVertical === 'RESIDENTIAL');

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-[#1a365d]">{isEdit ? 'Edit Listing' : 'Add Listing'}</h2>
            <p className="text-[12px] text-slate-400 font-medium uppercase tracking-wider">
              {(formData.intent || intent).replace('_', ' ')} · {formData.vertical || vertical}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <form 
          onSubmit={handleSubmit} 
          noValidate 
          className="flex-1 flex flex-col overflow-hidden"
          onFocusCapture={(e) => {
            setTimeout(() => {
              if (e.target && typeof e.target.scrollIntoView === 'function') {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 300);
          }}
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-600 text-xs font-medium items-center">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Category Section */}
          <section className="space-y-1.5">
            <h3 className="text-[12px] font-black text-[#284366] uppercase tracking-normal border-b border-slate-200 pb-1">Category</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider ml-1">Sub-type *</label>
              <div className="relative">
                <select 
                  name="subType"
                  value={formData.subType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#faf7f2] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-[12px] font-medium text-[#2d3748] outline-none appearance-none rounded-lg"
                >
                  {subTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </section>

          {/* Property Details Section */}
          <section className="space-y-1.5">
            <h3 className="text-[12px] font-black text-[#284366] uppercase tracking-normal border-b border-slate-200 pb-1">Property Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={`text-[10px] font-medium uppercase tracking-wider ml-1 ${fieldErrors.location ? 'text-red-500' : 'text-slate-500'}`}>Location / Area *</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={(e) => {
                    handleChange(e);
                    if (fieldErrors.location) setFieldErrors(prev => ({ ...prev, location: null }));
                  }}
                  placeholder="Sector, locality, area..." 
                  className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${fieldErrors.location ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#c8962a]/40'} transition-all text-[12px] font-medium text-[#2d3748] rounded-lg outline-none placeholder:font-normal placeholder:text-[#7f7f7f] placeholder:text-[12px]`} 
                />
                {fieldErrors.location && <p className="text-[10px] text-red-500 font-medium ml-1">{fieldErrors.location}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider ml-1">City *</label>
                <div className="relative">
                  <input 
                    type="text"
                    name="city"
                    value={formData.city}
                    readOnly
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-[12px] font-medium text-[#2d3748] outline-none rounded-lg cursor-not-allowed opacity-80"
                  />
                  <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <p className="flex items-center gap-1 text-[9px] text-[#c8962a] font-medium ml-1 mt-0.5">
                  <Lock size={10} /> Auto-filled from profile
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider ml-1">Project / Society</label>
                <input 
                  type="text" 
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  placeholder="Project or Society name" 
                  className="w-full px-4 py-2.5 bg-[#faf7f2] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-[12px] font-medium text-[#2d3748] rounded-lg outline-none placeholder:font-normal placeholder:text-[#7f7f7f] placeholder:text-[12px]" 
                />
              </div>
              {formData.vertical === 'RESIDENTIAL' && formData.subType?.toUpperCase() !== 'PLOTS' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider ml-1">Bedrooms</label>
                  <div className="relative">
                    <select 
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#faf7f2] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-[12px] font-medium text-[#2d3748] outline-none appearance-none rounded-lg"
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

          {/* Area Section */}
          <section className="space-y-1.5">
            <h3 className="text-[12px] font-black text-[#284366] uppercase tracking-normal border-b border-slate-200 pb-1">Area</h3>
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 space-y-1">
                <label className={`text-[10px] font-medium uppercase tracking-wider ml-1 ${fieldErrors.size ? 'text-red-500' : 'text-slate-500'}`}>Area / Size *</label>
                <input 
                  type="number" 
                  name="size"
                  value={formData.size}
                  onKeyDown={(e) => ['ArrowUp', 'ArrowDown'].includes(e.key) && e.preventDefault()}
                  onChange={(e) => {
                    handleChange(e);
                    if (fieldErrors.size) setFieldErrors(prev => ({ ...prev, size: null }));
                  }}
                  placeholder="e.g. 1200" 
                  className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${fieldErrors.size ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#c8962a]/40'} transition-all text-[12px] font-medium text-[#2d3748] rounded-lg outline-none placeholder:text-[12px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
                />
                {fieldErrors.size && <p className="text-[10px] text-red-500 font-medium ml-1">{fieldErrors.size}</p>}
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider ml-1">Unit</label>
                <div className="relative">
                  <select 
                    name="sizeUnit"
                    value={formData.sizeUnit}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#faf7f2] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-[12px] font-medium text-[#2d3748] outline-none appearance-none rounded-lg"
                  >
                    <option value="SQ_FT">Sq.Ft</option>
                    <option value="SQ_YD">Sq.Yd</option>
                    <option value="SQ_MT">Sq.Mt</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="space-y-1.5">
            <h3 className="text-[12px] font-black text-[#284366] uppercase tracking-normal border-b border-slate-200 pb-1">Pricing</h3>
            {!isRequirement ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 mt-1">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider ml-1">Price Type</label>
                  <div className="flex items-center gap-4 px-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="priceRateType" 
                        value="PER_SQFT"
                        checked={formData.priceRateType === 'PER_SQFT'}
                        onChange={handleChange}
                        className="w-3.5 h-3.5 accent-[#c8962a]"
                      />
                      <span className="text-[11px] font-medium text-[#2d3748]">Per Area Unit</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="priceRateType" 
                        value="LUMPSUM"
                        checked={formData.priceRateType === 'LUMPSUM'}
                        onChange={handleChange}
                        className="w-3.5 h-3.5 accent-[#c8962a]"
                      />
                      <span className="text-[11px] font-medium text-[#2d3748]">Fixed Amount</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-medium uppercase tracking-wider ml-1 ${fieldErrors.priceRate ? 'text-red-500' : 'text-slate-500'}`}>Rate / Price (₹) *</label>
                  <input 
                    type="number" 
                    name="priceRate"
                    value={formData.priceRate}
                    onKeyDown={(e) => ['ArrowUp', 'ArrowDown'].includes(e.key) && e.preventDefault()}
                    onChange={(e) => {
                      handleChange(e);
                      if (fieldErrors.priceRate) setFieldErrors(prev => ({ ...prev, priceRate: null }));
                    }}
                    placeholder="e.g. 5500" 
                    className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${fieldErrors.priceRate ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#c8962a]/40'} transition-all text-[12px] font-medium text-[#2d3748] rounded-lg outline-none placeholder:text-[12px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
                  />
                  {fieldErrors.priceRate && <p className="text-[10px] text-red-500 font-medium ml-1">{fieldErrors.priceRate}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className={`text-[10px] font-medium uppercase tracking-wider ml-1 ${fieldErrors.budgetMin || fieldErrors.budgetMax ? 'text-red-500' : 'text-slate-500'}`}>Budget Range *</label>
                <div className="flex gap-2 items-start">
                  <div className="w-1/2 flex flex-col gap-1">
                    <input 
                      type="number" 
                      name="budgetMin"
                      value={formData.budgetMin}
                      onKeyDown={(e) => ['ArrowUp', 'ArrowDown'].includes(e.key) && e.preventDefault()}
                      onChange={(e) => {
                        handleChange(e);
                        if (fieldErrors.budgetMin) setFieldErrors(prev => ({ ...prev, budgetMin: null }));
                      }}
                      placeholder="Min" 
                      className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${fieldErrors.budgetMin ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#c8962a]/40'} transition-all text-[12px] font-medium text-[#2d3748] rounded-lg outline-none placeholder:text-[12px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
                    />
                    {fieldErrors.budgetMin && <p className="text-[10px] text-red-500 font-medium ml-1 leading-tight">{fieldErrors.budgetMin}</p>}
                  </div>
                  <span className="text-slate-300 mt-2.5">-</span>
                  <div className="w-1/2 flex flex-col gap-1">
                    <input 
                      type="number" 
                      name="budgetMax"
                      value={formData.budgetMax}
                      onKeyDown={(e) => ['ArrowUp', 'ArrowDown'].includes(e.key) && e.preventDefault()}
                      onChange={(e) => {
                        handleChange(e);
                        if (fieldErrors.budgetMax) setFieldErrors(prev => ({ ...prev, budgetMax: null }));
                      }}
                      placeholder="Max" 
                      className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${fieldErrors.budgetMax ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#c8962a]/40'} transition-all text-[12px] font-medium text-[#2d3748] rounded-lg outline-none placeholder:text-[12px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
                    />
                    {fieldErrors.budgetMax && <p className="text-[10px] text-red-500 font-medium ml-1 leading-tight">{fieldErrors.budgetMax}</p>}
                  </div>
                </div>
              </div>
            )}
            
            {!isRequirement && (
              <div className="mt-4 p-4 bg-[#faf7f2] rounded-lg border border-slate-100 flex flex-col gap-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-normal">Calculated Total Price</p>
                <span className="text-xl font-serif text-[#1a365d]">
                  {formData.totalAmount ? `₹ ${formData.totalAmount.toLocaleString('en-IN')}` : '₹ 0'}
                </span>
              </div>
            )}
          </section>

          {/* Status Section */}
          <section className="space-y-1.5">
            <h3 className="text-[12px] font-black text-[#284366] uppercase tracking-normal border-b border-slate-200 pb-1">Status</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider ml-1">Property Status</label>
              <div className="relative">
                <select 
                  name="constructionStatus"
                  value={formData.constructionStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#faf7f2] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-[12px] font-medium text-[#2d3748] outline-none appearance-none rounded-lg"
                >
                  <option value="READY">Ready to Move</option>
                  {!hideUnderConstruction && (
                    <option value="UNDER_CONSTRUCTION">Under Construction</option>
                  )}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            {formData.vertical === 'COMMERCIAL' && !isRequirement && (
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider ml-1">Occupancy</label>
                <div className="relative">
                  <select 
                    name="occupancy"
                    value={formData.occupancy}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#faf7f2] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-[12px] font-medium text-[#2d3748] outline-none appearance-none rounded-lg"
                  >
                    <option value="VACANT">Vacant</option>
                    <option value="RENTED">Rented / ROI</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            )}
          </section>



          {/* Media Section */}
          {!isRequirement && (
            <section className="space-y-4">
              <h3 className="text-[12px] font-black text-[#284366] uppercase tracking-normal border-b border-slate-200 pb-1">Media</h3>
              
              {/* Photos */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Photos (JPG/PNG)</p>
                <div className="space-y-3">
                  <div className="w-full h-32 relative group cursor-pointer block">
                    <input id="gallery-upload-input" type="file" multiple accept="image/jpeg, image/png, image/jpg, image/webp" onChange={handleMediaUpload} className="hidden" />
                    <input id="camera-upload-input" type="file" accept="image/*" capture="environment" onChange={handleMediaUpload} className="hidden" />
                    <div 
                      onClick={(e) => {
                        e.preventDefault();
                        setShowUploadOptions(true);
                      }}
                      className="absolute inset-0 border-2 border-dashed border-[#ddd6c8] rounded-lg transition-all flex flex-col items-center justify-center bg-transparent group-hover:bg-[#faf7f2]"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 transition-transform">
                        <Camera size={20} className="text-slate-400" />
                      </div>
                      <p className="text-[13px] font-bold text-[#1a365d]">Click to upload photos</p>
                      <p className="text-[11px] text-slate-400">JPG, PNG — max 5 images allowed</p>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="w-20 h-20 relative group rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                          <img src={img} alt="Property" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                            className="absolute top-1 right-1 p-1 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Video */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Videos (MP4/MOV) - Max 20MB</p>
                {!formData.videos[0] ? (
                  <>
                  <label className="w-full h-32 relative group cursor-pointer block">
                    <input type="file" accept="video/mp4, video/webm, video/quicktime" onChange={handleVideoUpload} className="hidden" />
                    <div className="absolute inset-0 border-2 border-dashed border-[#ddd6c8] rounded-lg transition-all flex flex-col items-center justify-center bg-transparent group-hover:bg-[#faf7f2]">
                      {videoLoading ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 size={24} className="text-[#c8962a] animate-spin" />
                          <p className="text-[11px] font-bold text-[#c8962a] uppercase tracking-normal">Uploading Video...</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 transition-transform">
                            <Video size={20} className="text-slate-400" />
                          </div>
                          <p className="text-[13px] font-bold text-[#1a365d]">Click to upload videos</p>
                          <p className="text-[11px] text-slate-400">MP4, MOV — Max 20MB</p>
                        </>
                      )}
                    </div>
                  </label>
                  {videoError && <p className="text-[11px] text-red-500 font-medium ml-1 leading-tight">{videoError}</p>}
                </>
                ) : (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 shadow-lg group">
                    <video className="w-full h-full object-cover" controls playsInline>
                      <source src={formData.videos[0]} type="video/mp4" />
                    </video>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, videos: [] }))}
                      className="absolute top-3 right-3 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm hover:bg-red-500"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-3 left-4">
                      <p className="text-[10px] font-medium text-white uppercase tracking-normal bg-black/40 px-2 py-1 rounded backdrop-blur-sm">Walkthrough Ready</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Remarks Section */}
          <section className="space-y-1.5">
            <h3 className="text-[12px] font-black text-[#284366] uppercase tracking-normal border-b border-slate-200 pb-1">Remarks</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Notes / Additional Info</label>
              <textarea 
                name="remarks"
                value={formData.remarks || ''}
                onChange={handleChange}
                placeholder="Any extra details..." 
                rows="1"
                className="w-full px-4 py-2.5 bg-[#faf7f2] border border-slate-200 focus:border-[#c8962a]/40 transition-all text-[12px] font-medium text-[#2d3748] rounded-lg outline-none placeholder:font-normal placeholder:text-[#7f7f7f] placeholder:text-[12px] resize-none" 
              />
            </div>
          </section>

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-white z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-200 text-slate-500 text-[12px] font-black tracking-normal hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading || imageLoading || videoLoading}
              className="px-6 py-2 bg-[#c8962a] hover:bg-[#B48C35] text-white rounded-md text-[12px] font-black tracking-normal shadow-lg shadow-[#c8962a]/20 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Save Listing'}
            </button>
          </div>
        </form>
      </div>

      {/* Upload Options Action Sheet */}
      {showUploadOptions && (
        <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowUploadOptions(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Select Upload Method</h3>
              <button onClick={() => setShowUploadOptions(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>
            <div className="p-2">
              <button 
                onClick={() => {
                  setShowUploadOptions(false);
                  if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
                    window.flutter_inappwebview.callHandler('openCameraPicker');
                  } else {
                    document.getElementById('camera-upload-input').click();
                  }
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Camera size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Take Photo</p>
                  <p className="text-xs text-slate-500">Use your device camera</p>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  setShowUploadOptions(false);
                  if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
                    window.flutter_inappwebview.callHandler('openGalleryPicker');
                  } else {
                    document.getElementById('gallery-upload-input').click();
                  }
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Image size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Choose from Gallery</p>
                  <p className="text-xs text-slate-500">Select multiple existing photos</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostListingModal;
