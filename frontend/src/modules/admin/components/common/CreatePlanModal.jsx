import React, { useState } from 'react';
import { X, Check, Plus, Zap, ShieldCheck, Clock } from 'lucide-react';
import Modal from '../../../broker/components/ui/Modal';
import Button from '../../../broker/components/ui/Button';

const CreatePlanModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '1 Year',
    features: [''],
  });

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill in required fields');
      return;
    }
    onCreate({
      ...formData,
      price: Number(formData.price),
      activeUsers: 0,
      features: formData.features.filter(f => f.trim() !== '')
    });
    setFormData({ name: '', price: '', duration: '1 Year', features: [''] });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Architect New Subscription Tier"
    >
      <form onSubmit={handleSubmit} className="space-y-8 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Zap size={12} className="text-primary-500" /> Plan Identity
            </label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Platinum Elite"
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-200 outline-none font-bold text-slate-900 transition-all"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <ShieldCheck size={12} className="text-emerald-500" /> Pricing (₹)
            </label>
            <input 
              type="number" 
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="9999"
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-200 outline-none font-bold text-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Clock size={12} className="text-blue-500" /> Validity Duration
          </label>
          <div className="flex gap-3">
            {['1 Month', '6 Months', '1 Year', 'Lifetime'].map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setFormData({ ...formData, duration: d })}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.duration === d ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Included Privileges</label>
            <button 
              type="button"
              onClick={addFeature}
              className="text-[9px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 underline decoration-2 underline-offset-4"
            >
              Add Feature
            </button>
          </div>
          
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 animate-in slide-in-from-left-2 duration-300">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400" />
                  <input 
                    type="text" 
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Describe a feature..."
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary-500/5 outline-none text-xs font-bold text-slate-700 transition-all"
                  />
                </div>
                {formData.features.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-3.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <Button 
            variant="ghost" 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 font-black uppercase tracking-widest text-[11px]"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            className="flex-2 py-4 px-12 bg-primary-600 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary-600/20"
            leftIcon={<Check size={18} />}
          >
            Deploy Plan
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePlanModal;
