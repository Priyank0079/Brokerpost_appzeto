import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Image as ImageIcon, 
  HelpCircle, 
  BarChart3, 
  Eye, 
  EyeOff, 
  Award,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
  Users,
  Building2,
  Target,
  ArrowRight,
  Settings,
  ExternalLink
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';
import Badge from '../../broker/components/ui/Badge';
import CarouselManagement from './CarouselManagement';
import * as faqService from '../services/faqService';
import * as landingConfigService from '../services/landingConfigService';

const LandingPageManager = () => {
  const [activeTab, setActiveTab] = useState('visibility');
  const [activeContentSection, setActiveContentSection] = useState('searchPhilosophy');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [config, setConfig] = useState(null);

  // FAQ State
  const [faqs, setFaqs] = useState([]);
  const [isFaqLoading, setIsFaqLoading] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', order: 0 });
  const [showFaqForm, setShowFaqForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [configRes, faqRes] = await Promise.all([
        landingConfigService.getLandingConfig(),
        faqService.getAdminFAQs()
      ]);

      if (configRes.success) setConfig(configRes.data);
      if (faqRes.success) setFaqs(faqRes.data);
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
        showToast('Landing page configuration updated');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      showToast('Failed to save changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // FAQ Handlers
  const handleSaveFaq = async () => {
    try {
      if (editingFaq) {
        await faqService.updateFAQ(editingFaq._id, newFaq);
        showToast('FAQ updated');
      } else {
        await faqService.createFAQ(newFaq);
        showToast('New FAQ added');
      }
      setNewFaq({ question: '', answer: '', order: 0 });
      setEditingFaq(null);
      setShowFaqForm(false);
      
      const faqRes = await faqService.getAdminFAQs();
      if (faqRes.success) setFaqs(faqRes.data);
    } catch (error) {
      console.error('Error saving FAQ:', error);
      showToast('Failed to save FAQ', 'error');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await faqService.deleteFAQ(id);
        setFaqs(faqs.filter(f => f._id !== id));
        showToast('FAQ removed', 'warning');
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        showToast('Failed to delete FAQ', 'error');
      }
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setNewFaq({ question: faq.question, answer: faq.answer, order: faq.order });
    setShowFaqForm(true);
  };

  const toggleSection = (sectionKey) => {
    setConfig({
      ...config,
      sections: {
        ...config.sections,
        [sectionKey]: {
          ...config.sections[sectionKey],
          visible: !config.sections[sectionKey].visible
        }
      }
    });
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

  const updateNestedField = (sectionKey, nestedKey, field, value) => {
    if (!nestedKey) {
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
        return;
    }
    setConfig({
      ...config,
      sections: {
        ...config.sections,
        [sectionKey]: {
          ...config.sections[sectionKey],
          [nestedKey]: {
            ...(config.sections[sectionKey][nestedKey] || {}),
            [field]: value
          }
        }
      }
    });
  };

  const updateArrayField = (sectionKey, arrayKey, index, field, value) => {
    const newArray = [...config.sections[sectionKey][arrayKey]];
    if (field === null) {
      newArray[index] = value;
    } else {
      newArray[index] = { ...newArray[index], [field]: value };
    }
    
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
        <Loader2 className="text-primary-600 animate-spin" size={40} />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading CMS Studio...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="text-red-500" size={40} />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Failed to load configuration</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  const tabs = [
    { id: 'visibility', label: 'Visibility', icon: <Eye size={18} /> },
    { id: 'content', label: 'Section Content', icon: <Edit2 size={18} /> },
    { id: 'carousel', label: 'Carousel', icon: <ImageIcon size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const contentSections = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'searchPhilosophy', label: 'Search Philosophy' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'howItWorks', label: 'How It Works' },
    { id: 'campaignProgress', label: 'Campaign Stats' },
    { id: 'theMath', label: 'The Math' },
    { id: 'brokerBenefits', label: 'Broker Benefits' },
    { id: 'networkEffect', label: 'Network Effect' },
    { id: 'foundingMember', label: 'Founding Member' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'footer', label: 'Footer Links' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Landing Page Manager</h1>
           <p className="text-slate-500 font-medium mt-1">Dynamically control every section of your public portal.</p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ExternalLink size={16} />
            Preview Site
          </a>
          <Button 
            variant="primary" 
            onClick={handleSaveConfig} 
            loading={isSaving}
            leftIcon={<Save size={18} />} 
            className="px-8 font-bold shadow-xl shadow-primary-600/20"
          >
            Save Configuration
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl border border-slate-200/60 shadow-inner overflow-x-auto no-scrollbar max-w-full">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-primary-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'visibility' && (
          <motion.div 
            key="visibility"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {contentSections.map(section => (
              <Card key={section.id} className="p-6 border-slate-100 hover:border-primary-200 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${config?.sections?.[section.id]?.visible ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Layout size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{section.label}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {config?.sections?.[section.id]?.visible ? 'Visible on site' : 'Hidden from site'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSection(section.id)}
                    className={`w-14 h-8 rounded-full p-1.5 transition-all flex items-center ${config?.sections?.[section.id]?.visible ? 'bg-primary-600 justify-end' : 'bg-slate-200 justify-start'}`}
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            <div className="w-full lg:w-64 shrink-0 space-y-2">
              {contentSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveContentSection(section.id)}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm font-bold transition-all ${activeContentSection === section.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <Card className="flex-1 p-8 border-slate-100 shadow-xl shadow-slate-200/20">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 capitalize">
                    Edit {activeContentSection.replace(/([A-Z])/g, ' $1')} Content
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Modify titles, text, and data for this section.</p>
                </div>

                {config?.sections?.[activeContentSection] && config.sections[activeContentSection].hasOwnProperty('title') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {config.sections[activeContentSection].hasOwnProperty('badgeText') && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Badge</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-primary-200 font-bold text-slate-900"
                            value={config.sections[activeContentSection].badgeText || ''}
                            onChange={(e) => updateSectionField(activeContentSection, 'badgeText', e.target.value)}
                          />
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Title</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-primary-200 font-bold text-slate-900"
                          value={config.sections[activeContentSection].title || ''}
                          onChange={(e) => updateSectionField(activeContentSection, 'title', e.target.value)}
                        />
                      </div>
                    </div>
                    {config.sections[activeContentSection].hasOwnProperty('subtitle') && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Subtitle</label>
                        <textarea 
                          rows={activeContentSection === 'hero' ? 1 : 3}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-primary-200 font-medium text-slate-600"
                          value={config.sections[activeContentSection].subtitle || ''}
                          onChange={(e) => updateSectionField(activeContentSection, 'subtitle', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeContentSection === 'searchPhilosophy' && (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Feature Cards</h5>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => {
                          const newFeatures = [...(config.sections.searchPhilosophy.features || []), { title: 'New Feature', desc: [], color: 'primary' }];
                          updateSectionField('searchPhilosophy', 'features', newFeatures);
                        }}
                        leftIcon={<Plus size={14} />}
                      >
                        Add Feature
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(config?.sections?.searchPhilosophy?.features || []).map((feature, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl space-y-3 relative group">
                          <button 
                            className="absolute top-4 right-4 p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newFeatures = config.sections.searchPhilosophy.features.filter((_, i) => i !== idx);
                              updateSectionField('searchPhilosophy', 'features', newFeatures);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <input 
                            type="text" 
                            className="w-full bg-transparent border-b border-slate-200 font-bold text-slate-900 pb-1"
                            value={feature.title || ''}
                            onChange={(e) => updateArrayField('searchPhilosophy', 'features', idx, 'title', e.target.value)}
                          />
                          <textarea 
                            className="w-full bg-transparent text-xs text-slate-500"
                            rows="2"
                            value={(feature.desc || []).join('\n')}
                            onChange={(e) => updateArrayField('searchPhilosophy', 'features', idx, 'desc', e.target.value.split('\n'))}
                            placeholder="Bullet points (one per line)"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Matching Logic Card</h5>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matching Title</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900"
                            value={config.sections.searchPhilosophy.matchingTitle || ''}
                            onChange={(e) => updateSectionField('searchPhilosophy', 'matchingTitle', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matching Subtitle</label>
                          <textarea 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                            rows="2"
                            value={config.sections.searchPhilosophy.matchingSubtitle || ''}
                            onChange={(e) => updateSectionField('searchPhilosophy', 'matchingSubtitle', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matching Badge</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900"
                            value={config.sections.searchPhilosophy.matchingBadge || ''}
                            onChange={(e) => updateSectionField('searchPhilosophy', 'matchingBadge', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Match Simulator Labels</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Query Label</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900"
                            value={config.sections.searchPhilosophy.liveNetworkQueryLabel || ''}
                            onChange={(e) => updateSectionField('searchPhilosophy', 'liveNetworkQueryLabel', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Query Example</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900"
                            value={config.sections.searchPhilosophy.liveNetworkQueryExample || ''}
                            onChange={(e) => updateSectionField('searchPhilosophy', 'liveNetworkQueryExample', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Match Label</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900"
                            value={config.sections.searchPhilosophy.instantMatchLabel || ''}
                            onChange={(e) => updateSectionField('searchPhilosophy', 'instantMatchLabel', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Match Stats</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900"
                            value={config.sections.searchPhilosophy.instantMatchStats || ''}
                            onChange={(e) => updateSectionField('searchPhilosophy', 'instantMatchStats', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeContentSection === 'comparison' && (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Badge</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900"
                          value={config.sections.comparison.badge || ''}
                          onChange={(e) => updateSectionField('comparison', 'badge', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Active Brokers Count</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900"
                          value={config.sections.comparison.activeBrokers || ''}
                          onChange={(e) => updateSectionField('comparison', 'activeBrokers', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Benefit Cards</h5>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => {
                          const newBenefits = [...(config.sections.comparison.benefits || []), { title: 'New Benefit', desc: '', color: 'emerald' }];
                          updateSectionField('comparison', 'benefits', newBenefits);
                        }}
                        leftIcon={<Plus size={14} />}
                      >
                        Add Benefit
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(config?.sections?.comparison?.benefits || []).map((benefit, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl space-y-3 relative group">
                          <button 
                            className="absolute top-4 right-4 p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newBenefits = config.sections.comparison.benefits.filter((_, i) => i !== idx);
                              updateSectionField('comparison', 'benefits', newBenefits);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <input 
                            type="text" 
                            className="w-full bg-transparent border-b border-slate-200 font-bold text-slate-900 pb-1"
                            value={benefit.title || ''}
                            onChange={(e) => updateArrayField('comparison', 'benefits', idx, 'title', e.target.value)}
                          />
                          <input 
                            type="text" 
                            className="w-full bg-transparent text-xs text-slate-500"
                            value={benefit.desc || ''}
                            onChange={(e) => updateArrayField('comparison', 'benefits', idx, 'desc', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeContentSection === 'howItWorks' && (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Workflow Steps</h5>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => {
                          const newSteps = [...(config.sections.howItWorks.steps || []), { title: 'New Step', description: '', color: 'blue' }];
                          updateSectionField('howItWorks', 'steps', newSteps);
                        }}
                        leftIcon={<Plus size={14} />}
                      >
                        Add Step
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {(config?.sections?.howItWorks?.steps || []).map((step, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl flex gap-4 items-start relative group">
                           <button 
                            className="absolute top-4 right-4 p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newSteps = config.sections.howItWorks.steps.filter((_, i) => i !== idx);
                              updateSectionField('howItWorks', 'steps', newSteps);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <span className="w-8 h-8 shrink-0 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs mt-2">{idx + 1}</span>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                className="w-full bg-transparent border-b border-slate-200 font-bold text-slate-900 pb-1"
                                value={step.title || ''}
                                onChange={(e) => updateArrayField('howItWorks', 'steps', idx, 'title', e.target.value)}
                                placeholder="Step Title"
                              />
                              <select 
                                className="bg-transparent text-[10px] font-bold text-primary-600"
                                value={step.color || 'blue'}
                                onChange={(e) => updateArrayField('howItWorks', 'steps', idx, 'color', e.target.value)}
                              >
                                <option value="blue">Blue</option>
                                <option value="emerald">Emerald</option>
                                <option value="amber">Amber</option>
                                <option value="indigo">Indigo</option>
                              </select>
                            </div>
                            <textarea 
                              className="w-full bg-transparent text-sm text-slate-500"
                              rows="2"
                              value={step.description || ''}
                              onChange={(e) => updateArrayField('howItWorks', 'steps', idx, 'description', e.target.value)}
                              placeholder="Step Description"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeContentSection === 'campaignProgress' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brokers Counter</label>
                         <div className="flex gap-2">
                           <input type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold" value={config?.sections?.campaignProgress?.brokersCurrent || 0} onChange={(e) => updateSectionField('campaignProgress', 'brokersCurrent', parseInt(e.target.value))} />
                           <span className="py-3 text-slate-300">/</span>
                           <input type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold" value={config?.sections?.campaignProgress?.brokersTotal || 0} onChange={(e) => updateSectionField('campaignProgress', 'brokersTotal', parseInt(e.target.value))} />
                         </div>
                      </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Listings Counter</label>
                          <div className="flex gap-2">
                            <input type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold" value={config?.sections?.campaignProgress?.listingsCurrent || 0} onChange={(e) => updateSectionField('campaignProgress', 'listingsCurrent', parseInt(e.target.value))} />
                            <span className="py-3 text-slate-300">/</span>
                            <input type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold" value={config?.sections?.campaignProgress?.listingsTotal || 0} onChange={(e) => updateSectionField('campaignProgress', 'listingsTotal', parseInt(e.target.value))} />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Campaign Footer</h5>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Title</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900"
                            value={config.sections.campaignProgress.footerTitle || ''}
                            onChange={(e) => updateSectionField('campaignProgress', 'footerTitle', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Subtitle</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                            value={config.sections.campaignProgress.footerSubtitle || ''}
                            onChange={(e) => updateSectionField('campaignProgress', 'footerSubtitle', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeContentSection === 'theMath' && (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Probability Cards</h5>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => {
                          const newCards = [...(config.sections.theMath.cards || []), { brokers: '', listings: '', requirements: '', badge: '', description: '', accent: '#6366f1', iconColor: '#6366f1' }];
                          updateSectionField('theMath', 'cards', newCards);
                        }}
                        leftIcon={<Plus size={14} />}
                      >
                        Add Card
                      </Button>
                    </div>
                    <div className="space-y-6">
                      {(config?.sections?.theMath?.cards || []).map((card, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 relative group">
                           <button 
                            className="absolute top-4 right-4 p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newCards = config.sections.theMath.cards.filter((_, i) => i !== idx);
                              updateSectionField('theMath', 'cards', newCards);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                           <div className="space-y-4">
                             <input type="text" className="w-full bg-transparent font-bold text-primary-600 text-lg border-b border-slate-200" value={card.brokers || ''} onChange={(e) => updateArrayField('theMath', 'cards', idx, 'brokers', e.target.value)} />
                             <input type="text" className="w-full bg-transparent font-bold text-slate-900 text-2xl border-b border-slate-200" value={card.listings || ''} onChange={(e) => updateArrayField('theMath', 'cards', idx, 'listings', e.target.value)} />
                             <input type="text" className="w-full bg-transparent font-medium text-slate-500 border-b border-slate-200" value={card.requirements || ''} onChange={(e) => updateArrayField('theMath', 'cards', idx, 'requirements', e.target.value)} />
                              <div className="flex gap-4">
                                <div className="flex-1 space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase">Accent Color</label>
                                  <input type="text" className="w-full bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs font-mono" value={card.accent || ''} onChange={(e) => updateArrayField('theMath', 'cards', idx, 'accent', e.target.value)} placeholder="#HEX" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase">Icon Color</label>
                                  <input type="text" className="w-full bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs font-mono" value={card.iconColor || ''} onChange={(e) => updateArrayField('theMath', 'cards', idx, 'iconColor', e.target.value)} placeholder="#HEX" />
                                </div>
                              </div>
                           </div>
                           <div className="md:col-span-2 space-y-4">
                             <div className="flex gap-4">
                               <input type="text" className="flex-1 bg-transparent font-black text-[10px] uppercase tracking-widest border-b border-slate-200" value={card.badge || ''} onChange={(e) => updateArrayField('theMath', 'cards', idx, 'badge', e.target.value)} />
                               <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                 <input type="checkbox" checked={card.featured || false} onChange={(e) => updateArrayField('theMath', 'cards', idx, 'featured', e.target.checked)} /> Featured
                               </label>
                             </div>
                             <textarea className="w-full bg-transparent text-sm text-slate-600 italic leading-relaxed" rows="3" value={card.description || ''} onChange={(e) => updateArrayField('theMath', 'cards', idx, 'description', e.target.value)} />
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeContentSection === 'brokerBenefits' && (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Benefit Profiles</h5>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => {
                          const newBenefits = [...(config.sections.brokerBenefits.benefits || []), { title: 'New Benefit', description: '', color: 'blue' }];
                          updateSectionField('brokerBenefits', 'benefits', newBenefits);
                        }}
                        leftIcon={<Plus size={14} />}
                      >
                        Add Benefit
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(config?.sections?.brokerBenefits?.benefits || []).map((benefit, idx) => (
                        <div key={idx} className="p-5 bg-slate-50 rounded-2xl space-y-3 relative group">
                          <button 
                            className="absolute top-4 right-4 p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newBenefits = config.sections.brokerBenefits.benefits.filter((_, i) => i !== idx);
                              updateSectionField('brokerBenefits', 'benefits', newBenefits);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="flex gap-4">
                            <input 
                              type="text" 
                              className="flex-1 bg-transparent border-b border-slate-200 font-bold text-slate-900"
                              value={benefit.title || ''}
                              onChange={(e) => updateArrayField('brokerBenefits', 'benefits', idx, 'title', e.target.value)}
                            />
                            <select 
                              className="bg-transparent text-[10px] font-bold text-primary-600"
                              value={benefit.color || 'blue'}
                              onChange={(e) => updateArrayField('brokerBenefits', 'benefits', idx, 'color', e.target.value)}
                            >
                              <option value="blue">Blue</option>
                              <option value="emerald">Emerald</option>
                              <option value="amber">Amber</option>
                              <option value="indigo">Indigo</option>
                            </select>
                          </div>
                          <textarea 
                            className="w-full bg-transparent text-sm text-slate-500 leading-relaxed"
                            rows="3"
                            value={benefit.description || ''}
                            onChange={(e) => updateArrayField('brokerBenefits', 'benefits', idx, 'description', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeContentSection === 'networkEffect' && (
                  <div className="space-y-8 pt-6 border-t border-slate-100">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Milestone Points</h5>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => {
                            const newPoints = [...(config.sections.networkEffect.points || []), { id: Date.now(), text: '', result: '' }];
                            updateSectionField('networkEffect', 'points', newPoints);
                          }}
                          leftIcon={<Plus size={14} />}
                        >
                          Add Point
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {(config?.sections?.networkEffect?.points || []).map((point, idx) => (
                          <div key={idx} className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl group relative">
                            <span className="font-bold text-slate-400 text-xs w-6">{idx + 1}</span>
                            <input type="text" className="flex-1 bg-transparent border-b border-slate-100 font-bold text-sm" value={point.text || ''} onChange={(e) => updateArrayField('networkEffect', 'points', idx, 'text', e.target.value)} />
                            <ArrowRight size={14} className="text-slate-300" />
                            <input type="text" className="flex-1 bg-transparent border-b border-slate-100 font-bold text-sm text-primary-600" value={point.result || ''} onChange={(e) => updateArrayField('networkEffect', 'points', idx, 'result', e.target.value)} />
                            <button 
                              className="p-1 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newPoints = config.sections.networkEffect.points.filter((_, i) => i !== idx);
                                updateSectionField('networkEffect', 'points', newPoints);
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Success Story (Testimonial)</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 p-6 rounded-2xl shadow-2xl">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest">The Quote</label>
                            <textarea className="w-full bg-slate-800 border-none rounded-xl text-white text-sm p-4 focus:ring-1 focus:ring-primary-500 outline-none" rows="4" value={config?.sections?.networkEffect?.testimonial?.quote || ''} onChange={(e) => updateNestedField('networkEffect', 'testimonial', 'quote', e.target.value)} />
                         </div>
                         <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Author Name</label>
                               <input type="text" className="w-full bg-slate-800 border-none rounded-xl text-white text-sm px-4 py-2 focus:ring-1 focus:ring-primary-500 outline-none" value={config?.sections?.networkEffect?.testimonial?.author || ''} onChange={(e) => updateNestedField('networkEffect', 'testimonial', 'author', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Author Bio/Location</label>
                              <input type="text" className="w-full bg-slate-800 border-none rounded-xl text-white text-sm px-4 py-2 focus:ring-1 focus:ring-primary-500 outline-none" value={config?.sections?.networkEffect?.testimonial?.location || ''} onChange={(e) => updateNestedField('networkEffect', 'testimonial', 'location', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Platform Success Rate</label>
                               <input type="text" className="w-full bg-slate-800 border-none rounded-xl text-white text-sm px-4 py-2 focus:ring-1 focus:ring-primary-500 outline-none" value={config?.sections?.networkEffect?.testimonial?.successRate || ''} onChange={(e) => updateNestedField('networkEffect', 'testimonial', 'successRate', e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                               <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Avatar URL</label>
                               <input type="text" className="w-full bg-slate-800 border-none rounded-xl text-white text-sm px-4 py-2 focus:ring-1 focus:ring-primary-500 outline-none" value={config?.sections?.networkEffect?.testimonial?.avatar || ''} onChange={(e) => updateNestedField('networkEffect', 'testimonial', 'avatar', e.target.value)} />
                             </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeContentSection === 'foundingMember' && (
                  <div className="space-y-8 pt-6 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slots Remaining Counter</label>
                      <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-2xl text-primary-600" value={config?.sections?.foundingMember?.slotsRemaining || 0} onChange={(e) => updateNestedField('foundingMember', null, 'slotsRemaining', parseInt(e.target.value))} />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Benefit List</h5>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => {
                            const newBenefits = [...(config.sections.foundingMember.benefits || []), 'New Benefit'];
                            updateSectionField('foundingMember', 'benefits', newBenefits);
                          }}
                          leftIcon={<Plus size={14} />}
                        >
                          Add Benefit
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(config?.sections?.foundingMember?.benefits || []).map((benefit, idx) => (
                          <div key={idx} className="flex gap-2 group relative">
                             <input type="text" className="flex-1 bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold pr-10" value={benefit || ''} onChange={(e) => updateArrayField('foundingMember', 'benefits', idx, null, e.target.value)} />
                             <button 
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newBenefits = config.sections.foundingMember.benefits.filter((_, i) => i !== idx);
                                updateSectionField('foundingMember', 'benefits', newBenefits);
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">CTA & Footer</h5>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Button Text</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900"
                            value={config.sections.foundingMember.ctaText || ''}
                            onChange={(e) => updateSectionField('foundingMember', 'ctaText', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Note</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                            value={config.sections.foundingMember.footerNote || ''}
                            onChange={(e) => updateSectionField('foundingMember', 'footerNote', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeContentSection === 'faqs' && (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Questions & Answers</h5>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => {
                          const newItems = [...(config.sections.faqs.items || []), { question: '', answer: '' }];
                          updateSectionField('faqs', 'items', newItems);
                        }}
                        leftIcon={<Plus size={14} />}
                      >
                        Add Question
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {(config?.sections?.faqs?.items || []).map((faq, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl space-y-3 relative group">
                          <button 
                            className="absolute top-4 right-4 p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newItems = config.sections.faqs.items.filter((_, i) => i !== idx);
                              updateSectionField('faqs', 'items', newItems);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Question {idx + 1}</span>
                          </div>
                          <input 
                            type="text" 
                            className="w-full bg-white px-4 py-2 rounded-xl border border-slate-100 font-bold text-slate-900"
                            value={faq.question || ''}
                            onChange={(e) => updateArrayField('faqs', 'items', idx, 'question', e.target.value)}
                            placeholder="Question"
                          />
                          <textarea 
                            className="w-full bg-white px-4 py-2 rounded-xl border border-slate-100 text-sm text-slate-500"
                            rows="2"
                            value={faq.answer || ''}
                            onChange={(e) => updateArrayField('faqs', 'items', idx, 'answer', e.target.value)}
                            placeholder="Answer"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Support Footer</h5>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Text</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-600"
                          value={config.sections.faqs.footerText || ''}
                          onChange={(e) => updateSectionField('faqs', 'footerText', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeContentSection === 'footer' && (
                  <div className="space-y-8 pt-6 border-t border-slate-100">
                    <div className="space-y-4">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Branding & Certifications</h5>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Description</label>
                          <textarea 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                            rows="3"
                            value={config.sections.footer.brandingDesc || ''}
                            onChange={(e) => updateNestedField('footer', null, 'brandingDesc', e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {(config.sections.footer.certifications || []).map((cert, idx) => (
                             <div key={idx} className="flex gap-2 items-center bg-slate-50 p-3 rounded-xl">
                               <input type="text" className="flex-1 bg-transparent border-b border-slate-200 text-xs font-bold" value={cert.label || ''} onChange={(e) => updateArrayField('footer', 'certifications', idx, 'label', e.target.value)} placeholder="Label" />
                               <select className="bg-transparent text-[10px] font-bold" value={cert.icon || ''} onChange={(e) => updateArrayField('footer', 'certifications', idx, 'icon', e.target.value)}>
                                 <option value="ShieldCheck">Shield</option>
                                 <option value="Globe">Globe</option>
                               </select>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Navigation Columns</h5>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => {
                            const newNav = [...(config.sections.footer.navigation || []), { title: 'New Column', links: [] }];
                            updateNestedField('footer', null, 'navigation', newNav);
                          }}
                          leftIcon={<Plus size={14} />}
                        >
                          Add Column
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(config.sections.footer.navigation || []).map((col, idx) => (
                          <div key={idx} className="p-5 bg-slate-50 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                              <input 
                                type="text" 
                                className="bg-transparent border-b border-slate-300 font-black text-[10px] uppercase tracking-widest text-primary-600"
                                value={col.title || ''}
                                onChange={(e) => {
                                  const newNav = [...config.sections.footer.navigation];
                                  newNav[idx].title = e.target.value;
                                  updateNestedField('footer', null, 'navigation', newNav);
                                }}
                              />
                              <button onClick={() => {
                                const newNav = config.sections.footer.navigation.filter((_, i) => i !== idx);
                                updateNestedField('footer', null, 'navigation', newNav);
                              }} className="text-rose-500"><Trash2 size={14} /></button>
                            </div>
                            <div className="space-y-2">
                              {(col.links || []).map((link, lIdx) => (
                                <div key={lIdx} className="flex gap-2 items-center">
                                  <input type="text" className="flex-1 bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs" value={link.label || ''} onChange={(e) => {
                                    const newNav = [...config.sections.footer.navigation];
                                    newNav[idx].links[lIdx].label = e.target.value;
                                    updateNestedField('footer', null, 'navigation', newNav);
                                  }} placeholder="Label" />
                                  <input type="text" className="flex-1 bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs" value={link.url || ''} onChange={(e) => {
                                    const newNav = [...config.sections.footer.navigation];
                                    newNav[idx].links[lIdx].url = e.target.value;
                                    updateNestedField('footer', null, 'navigation', newNav);
                                  }} placeholder="URL" />
                                  <button onClick={() => {
                                    const newNav = [...config.sections.footer.navigation];
                                    newNav[idx].links = newNav[idx].links.filter((_, i) => i !== lIdx);
                                    updateNestedField('footer', null, 'navigation', newNav);
                                  }} className="text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button>
                                </div>
                              ))}
                              <button 
                                className="text-[10px] font-bold text-primary-600 flex items-center gap-1 hover:underline"
                                onClick={() => {
                                  const newNav = [...config.sections.footer.navigation];
                                  newNav[idx].links = [...(newNav[idx].links || []), { label: '', url: '/' }];
                                  updateNestedField('footer', null, 'navigation', newNav);
                                }}
                              >
                                <Plus size={10} /> Add Link
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Copyright Text</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                          value={config.sections.footer.copyright || ''}
                          onChange={(e) => updateNestedField('footer', null, 'copyright', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'carousel' && (
          <motion.div 
            key="carousel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CarouselManagement />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 animate-in fade-in duration-500"
          >
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-slate-400">
                <Settings size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">System Parameters</h3>
                <p className="text-slate-500 text-sm">Global contact and communication settings.</p>
              </div>
              
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                    value={config.contact?.email || ''}
                    onChange={(e) => updateNestedField('contact', null, 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hotline Number</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                    value={config.contact?.phone || ''}
                    onChange={(e) => updateNestedField('contact', null, 'phone', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Bridge (No +)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                    value={config.contact?.whatsapp || ''}
                    onChange={(e) => updateNestedField('contact', null, 'whatsapp', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Address</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                    value={config.contact?.address || ''}
                    onChange={(e) => updateNestedField('contact', null, 'address', e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="p-4 bg-white rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cache TTL</p>
                  <p className="text-sm font-bold text-slate-900">3600 Seconds</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">API Version</p>
                  <p className="text-sm font-bold text-slate-900">v1.4.2</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Environment</p>
                  <p className="text-sm font-bold text-emerald-600">Production</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engine Status</p>
                  <p className="text-sm font-bold text-slate-900">Optimal</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
          >
             <div className={`px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
                {toast.type === 'success' ? <CheckCircle2 className="text-emerald-400" size={24} /> : <AlertCircle size={24} />}
                <p className="text-sm font-black uppercase tracking-[0.2em]">{toast.message}</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPageManager;
