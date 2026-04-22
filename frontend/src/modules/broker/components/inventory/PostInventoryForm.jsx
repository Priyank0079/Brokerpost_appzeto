import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

import Badge from '../ui/Badge';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Building2, 
  Home, 
  Warehouse, 
  CheckCircle2,
  X
} from 'lucide-react';


const PostInventoryForm = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const [formData, setFormData] = useState({
    vertical: '',
    listingType: '',
    transactionType: '',
    propertyType: '',
    title: '',
    location: '',
    price: '',
    sqft: '',
    description: '',
    images: [],
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));


  const steps = [
    { title: 'Vertical', icon: <Building2 /> },
    { title: 'Listing', icon: <Check /> },
    { title: 'Transaction', icon: <Check /> },
    { title: 'Property', icon: <Home /> },
    { title: 'Details', icon: <Check /> },
    { title: 'Upload', icon: <Upload /> },
    { title: 'Review', icon: <CheckCircle2 /> },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['Residential', 'Commercial'].map((v) => (
              <button 
                key={v}
                onClick={() => { setFormData({...formData, vertical: v}); nextStep(); }}
                className={`p-6 sm:p-8 border-2 rounded-3xl text-left transition-all hover:border-primary-500 hover:bg-primary-50/30 group ${formData.vertical === v ? 'border-primary-500 bg-primary-50' : 'border-slate-100 bg-slate-50/50'}`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-all ${formData.vertical === v ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-white text-slate-400 group-hover:text-primary-600 shadow-sm'}`}>
                  {v === 'Residential' ? <Home className="w-6 h-6 sm:w-7 sm:h-7" /> : <Warehouse className="w-6 h-6 sm:w-7 sm:h-7" />}
                </div>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">{v}</h4>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2">Professional {v.toLowerCase()} network access.</p>
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['Availability', 'Requirement'].map((t) => (
              <button 
                key={t}
                onClick={() => { setFormData({...formData, listingType: t}); nextStep(); }}
                className={`p-8 border-2 rounded-3xl text-left transition-all hover:border-primary-500 hover:bg-primary-50/30 group ${formData.listingType === t ? 'border-primary-500 bg-primary-50' : 'border-slate-100 bg-slate-50/50'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${formData.listingType === t ? 'bg-primary-500 text-white' : 'bg-white text-slate-400Shadow-sm'}`}>
                   {t === 'Availability' ? <CheckCircle2 size={24} /> : <Check size={24} />}
                </div>
                <h4 className="text-xl font-black text-slate-900 leading-tight">{t}</h4>
                <p className="text-sm font-medium text-slate-500 mt-2">Submit your {t.toLowerCase()} to the group.</p>
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-6">
               {['Sale', 'Rent'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => { setFormData({...formData, transactionType: t}); nextStep(); }}
                    className={`p-10 border-2 rounded-3xl text-center transition-all hover:border-primary-500 hover:bg-primary-50/30 ${formData.transactionType === t ? 'border-primary-500 bg-primary-50' : 'border-slate-100 bg-slate-50/50'}`}
                  >
                    <span className={`text-2xl font-black ${formData.transactionType === t ? 'text-primary-700' : 'text-slate-400'}`}>{t}</span>
                  </button>
               ))}
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             {['Apartment', 'Villa', 'Penthouse', 'Plot', 'Office', 'Shop'].map((p) => (
                <button 
                  key={p}
                  onClick={() => { setFormData({...formData, propertyType: p}); nextStep(); }}
                  className={`p-4 border-2 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${formData.propertyType === p ? 'bg-primary-600 text-white border-primary-600 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-primary-200'}`}
                >
                  {p}
                </button>
             ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Title</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-200 outline-none font-bold text-slate-900 transition-all"
                  placeholder="e.g. Modern 3BHK Apartment"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exact Location</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-200 outline-none font-bold text-slate-900 transition-all"
                  placeholder="e.g. Bandra West, Mumbai"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (INR)</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-200 outline-none font-bold text-slate-900 transition-all"
                  placeholder="e.g. 25000000"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Built-up Area (Sq Ft)</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-200 outline-none font-bold text-slate-900 transition-all"
                  placeholder="e.g. 1250"
                  value={formData.sqft}
                  onChange={(e) => setFormData({...formData, sqft: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div 
              className="border-4 border-dashed border-slate-50 rounded-[40px] p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary-100 transition-all cursor-pointer group relative"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input 
                id="fileInput"
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleImageUpload}
                accept="image/*"
              />
              <div className="w-16 h-16 rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>
              <h4 className="text-lg font-black text-slate-900">Add Property Images</h4>
              <p className="text-sm font-medium text-slate-400 mt-2 max-w-xs mx-auto">Click here to browse or drag & drop high-res photos.</p>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="absolute top-2 right-2 p-1 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-white pb-6">
               <h4 className="text-xl font-black text-slate-900 tracking-tight">Listing Review</h4>
               <Badge variant="primary" className="px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">Ready to Submit</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vertical</p>
                   <p className="font-bold text-slate-900">{formData.vertical || 'Not selected'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing Category</p>
                   <p className="font-bold text-primary-600">{formData.listingType || 'Not selected'}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Heading</p>
                   <p className="font-bold text-slate-900 text-lg">{formData.title || 'No title provided'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expectation</p>
                   <p className="font-black text-slate-900 text-xl">₹{formData.price || '0'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Region</p>
                   <p className="font-bold text-slate-900">{formData.location || 'Not specified'}</p>
                </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      {/* Visual Step Indicator (Clickable) */}
      <div className="flex justify-between items-center px-2 sm:px-4 relative">
        <div className="absolute top-[12px] sm:top-[15px] left-6 right-6 sm:left-8 sm:right-8 h-[2px] bg-slate-100" />
        {steps.map((s, i) => (
          <button 
            key={i} 
            onClick={() => setStep(i + 1)}
            className="relative z-10 flex flex-col items-center gap-2 sm:gap-3 group outline-none"
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 ring-4 ring-primary-50' : 'bg-white border-2 border-slate-50 text-slate-300 group-hover:border-primary-200 group-hover:text-primary-600'}`}>
              {step > i + 1 ? <Check className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : React.cloneElement(s.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
            </div>
            <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tight sm:tracking-widest transition-all ${step === i + 1 ? 'opacity-100 scale-100' : 'opacity-0 sm:opacity-100 scale-50 sm:scale-100 hidden sm:block'} ${step >= i + 1 ? 'text-primary-600' : 'text-slate-300 group-hover:text-slate-500'}`}>
              {s.title}
            </span>
          </button>
        ))}
      </div>


      {/* Form Area */}
      <div className="min-h-[350px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-10 border-t border-slate-50">
        <Button 
          variant="ghost" 
          onClick={prevStep} 
          disabled={step === 1}
          className="font-black text-slate-400 uppercase tracking-widest text-[10px] sm:text-[11px] hover:bg-slate-50 px-4 sm:px-8 py-3 sm:py-4 transition-all"
          leftIcon={<ChevronLeft size={18} />}
        >
          Previous
        </Button>
        
        {step === totalSteps ? (
          <Button 
            onClick={() => { alert('Post Distributed Successfully!'); onSuccess(); }} 
            variant="primary" 
            className="px-6 sm:px-12 py-3 sm:py-4 font-black uppercase tracking-widest text-[10px] sm:text-[11px] shadow-2xl shadow-primary-600/20 scale-105"
          >
            Broadcast
          </Button>
        ) : (
          <Button 
            onClick={nextStep} 
            variant="primary" 
            rightIcon={<ChevronRight size={18} />}
            className="px-6 sm:px-12 py-3 sm:py-4 font-black uppercase tracking-widest text-[10px] sm:text-[11px] shadow-xl shadow-primary-600/10"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostInventoryForm;
