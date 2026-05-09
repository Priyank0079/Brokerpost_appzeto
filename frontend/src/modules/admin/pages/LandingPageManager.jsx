import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Image as ImageIcon, 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Edit2, 
  Settings, 
  ExternalLink, 
  Search, 
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';
import * as landingConfigService from '../services/landingConfigService';
import { useNavigate } from 'react-router-dom';

const LandingPageManager = () => {
  const navigate = useNavigate();
  const [activeContentSection, setActiveContentSection] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await landingConfigService.getLandingConfig();
      if (result.success) setConfig(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to load configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const result = await landingConfigService.updateLandingConfig(config);
      if (result.success) {
        showToast('Landing page updated successfully');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      showToast('Failed to save changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSectionField = (sectionKey, field, value) => {
    setConfig({
      ...config,
      sections: {
        ...config.sections,
        [sectionKey]: {
          ...config.sections[sectionKey],
          [field]: value
        }
      }
    });
  };

  const updateArrayField = (sectionKey, arrayKey, index, field, value) => {
    const newArray = [...config.sections[sectionKey][arrayKey]];
    newArray[index] = { ...newArray[index], [field]: value };
    
    setConfig({
      ...config,
      sections: {
        ...config.sections,
        [sectionKey]: {
          ...config.sections[sectionKey],
          [arrayKey]: newArray
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="text-[#c8962a] animate-spin" size={40} />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading CMS Studio...</p>
      </div>
    );
  }

  const contentSections = [
    { id: 'hero', label: 'Hero & Stats' },
    { id: 'search', label: 'Search Area' },
    { id: 'inventory', label: 'Inventory Grid' },
    { id: 'features', label: 'Platform Features' },
    { id: 'process', label: 'Process Flow' },
    { id: 'cta', label: 'CTA Section' },
    { id: 'footer', label: 'Footer Settings' },
  ];

  return (
    <div className="-mx-6 lg:-mx-10 -my-6 lg:-my-10 px-6 lg:px-10 py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-8 animate-fade-in pb-20">
        {/* Header */}
        <div className="-mx-6 lg:-mx-10 -mt-6 lg:-mt-10 mb-4 px-6 lg:px-10 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-serif text-black">Landing Manager</h1>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
               <CheckCircle2 size={12} />
               <span className="text-[10px] font-bold uppercase tracking-wider">Live Sync Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => navigate('/')}
                className="px-4 py-1.5 rounded-full border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <ExternalLink size={14} /> View Site
              </button>
              <button 
                onClick={handleSaveConfig} 
                disabled={isSaving}
                className="px-8 h-10 bg-[#c8962a] text-white rounded-xl text-[11px] font-bold hover:bg-[#b08425] transition-all shadow-lg shadow-[#c8962a]/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} 
                Publish Changes
              </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-1">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Edit Sections</p>
            {contentSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveContentSection(section.id)}
                className={`w-full px-4 py-3 rounded-xl text-left text-[11px] font-bold transition-all flex items-center justify-between group ${activeContentSection === section.id ? 'bg-[#c8962a] text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
              >
                {section.label}
                {activeContentSection === section.id && <Edit2 size={12} />}
              </button>
            ))}
          </div>

          {/* Editor */}
          <Card className="flex-1 p-8 border-slate-100 shadow-xl shadow-slate-200/20 bg-white">
            {config && config.sections && config.sections[activeContentSection] ? (
              <div className="space-y-8">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-[10px] font-black text-[#c8962a] uppercase tracking-widest">Section Editor</span>
                     <div className="h-px flex-1 bg-slate-100" />
                   </div>
                   <h3 className="text-2xl font-serif text-black capitalize">
                     {activeContentSection.replace(/([A-Z])/g, ' $1')}
                   </h3>
                </div>

                <div className="space-y-6">
                   {/* Visibility & Badge */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {config.sections[activeContentSection].hasOwnProperty('badge') && (
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Badge Text</label>
                         <input 
                           type="text" 
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:border-[#c8962a] outline-none transition-all"
                           value={config.sections[activeContentSection].badge || ''}
                           onChange={(e) => updateSectionField(activeContentSection, 'badge', e.target.value)}
                         />
                       </div>
                     )}
                     {config.sections[activeContentSection].hasOwnProperty('visible') && (
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section Visibility</label>
                         <button 
                           onClick={() => updateSectionField(activeContentSection, 'visible', !config.sections[activeContentSection].visible)}
                           className={`w-full h-[46px] rounded-xl flex items-center justify-center gap-2 font-bold text-xs border transition-all ${config.sections[activeContentSection].visible ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                         >
                           {config.sections[activeContentSection].visible ? <Eye size={14} /> : <AlertCircle size={14} />}
                           {config.sections[activeContentSection].visible ? 'Section is Visible' : 'Section is Hidden'}
                         </button>
                       </div>
                     )}
                   </div>

                    {activeContentSection === 'hero' ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title Part 1 (Regular)</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:border-[#c8962a] outline-none transition-all"
                            value={config.sections.hero.titlePart1 || ''}
                            onChange={(e) => updateSectionField('hero', 'titlePart1', e.target.value)}
                            placeholder="India's Most Trusted"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#c8962a] uppercase tracking-widest font-black">Title Highlight (Italic Gold)</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-[#c8962a]/5 border border-[#c8962a]/30 rounded-xl font-bold italic text-[#c8962a] text-sm focus:border-[#c8962a] outline-none transition-all"
                            value={config.sections.hero.titleHighlight || ''}
                            onChange={(e) => updateSectionField('hero', 'titleHighlight', e.target.value)}
                            placeholder="Broker-to-Broker"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title Part 2 (Regular)</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:border-[#c8962a] outline-none transition-all"
                            value={config.sections.hero.titlePart2 || ''}
                            onChange={(e) => updateSectionField('hero', 'titlePart2', e.target.value)}
                            placeholder="Inventory Platform"
                          />
                        </div>
                      </div>
                    ) : config.sections[activeContentSection].hasOwnProperty('title') && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Title</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:border-[#c8962a] outline-none transition-all"
                          value={config.sections[activeContentSection].title || ''}
                          onChange={(e) => updateSectionField(activeContentSection, 'title', e.target.value)}
                        />
                      </div>
                    )}

                   {config.sections[activeContentSection].hasOwnProperty('subtitle') && (
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subtitle / Description</label>
                       <textarea 
                         rows={3}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 text-sm focus:border-[#c8962a] outline-none transition-all"
                         value={config.sections[activeContentSection].subtitle || ''}
                         onChange={(e) => updateSectionField(activeContentSection, 'subtitle', e.target.value)}
                       />
                     </div>
                   )}

                   {/* Custom Array Editors */}
                   {activeContentSection === 'hero' && config.sections.hero.stats && (
                     <div className="pt-6 border-t border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Hero Counters</p>
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                         {config.sections.hero.stats.map((stat, idx) => (
                           <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                              <input 
                                 type="text" 
                                 className="w-full bg-transparent font-serif font-bold text-lg text-[#1a365d] border-b border-slate-200 outline-none"
                                 value={stat.value}
                                 onChange={(e) => updateArrayField('hero', 'stats', idx, 'value', e.target.value)}
                              />
                              <input 
                                 type="text" 
                                 className="w-full bg-transparent text-[10px] font-bold text-slate-400 uppercase tracking-widest outline-none"
                                 value={stat.label}
                                 onChange={(e) => updateArrayField('hero', 'stats', idx, 'label', e.target.value)}
                              />
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {activeContentSection === 'features' && config.sections.features.items && (
                     <div className="pt-6 border-t border-slate-100 space-y-6">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Feature Cards</p>
                          <Button size="sm" variant="secondary" onClick={() => {
                             const newItems = [...config.sections.features.items, { title: 'New Feature', description: '', icon: 'ShieldCheck', color: 'bg-primary-50 text-primary-500' }];
                             updateSectionField('features', 'items', newItems);
                          }} leftIcon={<Plus size={14} />}>Add Feature</Button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {config.sections.features.items.map((item, idx) => (
                           <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group">
                              <button className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors" onClick={() => {
                                const newItems = config.sections.features.items.filter((_, i) => i !== idx);
                                updateSectionField('features', 'items', newItems);
                              }}>
                                <Trash2 size={14} />
                              </button>
                              <input 
                                 type="text" 
                                 className="w-full bg-transparent font-bold text-slate-900 border-b border-slate-200 outline-none pb-1"
                                 value={item.title}
                                 placeholder="Feature Title"
                                 onChange={(e) => updateArrayField('features', 'items', idx, 'title', e.target.value)}
                              />
                              <textarea 
                                 className="w-full bg-transparent text-xs text-slate-500 outline-none"
                                 rows={2}
                                 value={item.description}
                                 placeholder="Description..."
                                 onChange={(e) => updateArrayField('features', 'items', idx, 'description', e.target.value)}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                 <input type="text" className="w-full bg-white px-3 py-1 rounded-lg border text-[10px] font-mono" value={item.icon || ''} onChange={(e) => updateArrayField('features', 'items', idx, 'icon', e.target.value)} placeholder="Icon Name" />
                                 <input type="text" className="w-full bg-white px-3 py-1 rounded-lg border text-[10px] font-mono" value={item.color || ''} onChange={(e) => updateArrayField('features', 'items', idx, 'color', e.target.value)} placeholder="Classes" />
                              </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {activeContentSection === 'process' && config.sections.process.steps && (
                     <div className="pt-6 border-t border-slate-100 space-y-6">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Process Steps</p>
                          <Button size="sm" variant="secondary" onClick={() => {
                             const newSteps = [...config.sections.process.steps, { number: '01', title: 'New Step', description: '' }];
                             updateSectionField('process', 'steps', newSteps);
                          }} leftIcon={<Plus size={14} />}>Add Step</Button>
                       </div>
                       <div className="space-y-4">
                         {config.sections.process.steps.map((step, idx) => (
                           <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-4 items-start relative group">
                              <button className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors" onClick={() => {
                                const newSteps = config.sections.process.steps.filter((_, i) => i !== idx);
                                updateSectionField('process', 'steps', newSteps);
                              }}>
                                <Trash2 size={14} />
                              </button>
                              <input type="text" className="w-12 bg-transparent font-serif font-bold text-[#c8962a] text-xl border-b border-slate-200 outline-none text-center" value={step.number} onChange={(e) => updateArrayField('process', 'steps', idx, 'number', e.target.value)} />
                              <div className="flex-1 space-y-2">
                                 <input type="text" className="w-full bg-transparent font-bold text-slate-900 border-b border-slate-200 outline-none" value={step.title} onChange={(e) => updateArrayField('process', 'steps', idx, 'title', e.target.value)} placeholder="Step Title" />
                                 <textarea className="w-full bg-transparent text-xs text-slate-500 outline-none" rows={1} value={step.description} onChange={(e) => updateArrayField('process', 'steps', idx, 'description', e.target.value)} placeholder="Step Description" />
                              </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Settings size={40} className="mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">Select a section to edit</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 z-50"
          >
            <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-[#1a365d] border-slate-700 text-white'}`}>
              {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <span className="text-sm font-bold">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPageManager;
