import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, Shield, FileText, CheckCircle } from 'lucide-react';
import { api } from '../../broker/services/api';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await api.get('/landing-config');
      if (response.success) {
        setConfig(response.data);
      }
    } catch (err) {
      console.error('Error fetching config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.put('/landing-config', config);
      if (response.success) {
        setSuccessMessage('Settings updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error updating config:', err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateTermsField = (field, value) => {
    setConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        registrationTerms: {
          ...prev.sections.registrationTerms,
          [field]: value
        }
      }
    }));
  };

  const handleTermChange = (index, field, value) => {
    const newItems = [...config.sections.registrationTerms.items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateTermsField('items', newItems);
  };

  const addTerm = () => {
    const newItems = [...config.sections.registrationTerms.items, { title: '', content: '' }];
    updateTermsField('items', newItems);
  };

  const removeTerm = (index) => {
    const newItems = config.sections.registrationTerms.items.filter((_, i) => i !== index);
    updateTermsField('items', newItems);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="animate-spin text-[#c0922e]" size={32} />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading Settings...</p>
      </div>
    );
  }

  const terms = config?.sections?.registrationTerms || { items: [], agreementText: '' };

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Custom Header */}
        <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 mb-8 px-4 md:px-6 lg:px-10 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-lg font-serif text-black leading-none">Platform Settings</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage global configurations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {successMessage && (
              <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-right-4 duration-300">
                <CheckCircle size={16} />
                <span className="text-[11px] font-bold">{successMessage}</span>
              </div>
            )}
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#c0922e] text-white rounded-lg text-[11px] font-bold flex items-center gap-2 hover:bg-[#a67d26] transition-all shadow-lg shadow-[#c0922e]/20 disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Changes
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {/* Registration Terms Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Registration Terms & Conditions</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Dynamically updated on the broker registration modal</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Visible</span>
                <input 
                  type="checkbox" 
                  checked={terms.visible}
                  onChange={(e) => updateTermsField('visible', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-200 text-[#c0922e] focus:ring-[#c0922e]"
                />
              </label>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modal Heading Title</label>
                <input 
                  type="text"
                  value={terms.title}
                  onChange={(e) => updateTermsField('title', e.target.value)}
                  placeholder="e.g. Important Disclaimer & Terms of Use"
                  className="w-full px-4 py-3 bg-[#fdf8f3] border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all outline-none"
                />
              </div>

              {/* Dynamic Terms List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Defined Clauses</label>
                  <button 
                    onClick={addTerm}
                    className="flex items-center gap-1.5 text-[10px] font-black text-[#c0922e] hover:text-[#a67d26] transition-all"
                  >
                    <Plus size={12} strokeWidth={3} /> ADD NEW CLAUSE
                  </button>
                </div>
                
                <div className="space-y-4">
                  {terms.items.map((item, idx) => (
                    <div key={idx} className="relative group p-5 bg-[#faf9f6] rounded-2xl border border-slate-100 hover:border-[#c8962a]/20 transition-all">
                      <button 
                        onClick={() => removeTerm(idx)}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-white text-rose-500 rounded-full border border-slate-100 shadow-sm flex items-center justify-center hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-[10px] font-black text-[#c0922e] border border-slate-100 shadow-sm">
                            {idx + 1}
                          </span>
                          <input 
                            type="text"
                            value={item.title}
                            onChange={(e) => handleTermChange(idx, 'title', e.target.value)}
                            placeholder="Clause Title (e.g. No Liability)"
                            className="flex-1 bg-transparent border-none text-[12px] font-black text-[#1a365d] placeholder:text-slate-300 outline-none p-0"
                          />
                        </div>
                        <textarea 
                          value={item.content}
                          onChange={(e) => handleTermChange(idx, 'content', e.target.value)}
                          placeholder="Write the clause description here..."
                          className="w-full h-24 bg-white border border-slate-100 rounded-xl p-4 text-[11px] font-medium text-slate-600 placeholder:text-slate-300 resize-none outline-none focus:border-[#c8962a]/30 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agreement Text */}
              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmation Text (Checkbox Label)</label>
                <textarea 
                  value={terms.agreementText}
                  onChange={(e) => updateTermsField('agreementText', e.target.value)}
                  placeholder="The text next to the 'I agree' checkbox..."
                  className="w-full h-24 bg-[#fdf8f3] border border-slate-100 rounded-xl p-4 text-[11px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
