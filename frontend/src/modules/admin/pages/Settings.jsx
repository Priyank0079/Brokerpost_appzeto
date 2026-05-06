import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Bell, 
  ShieldAlert, 
  Mail, 
  Lock, 
  Server,
  Save,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';
import * as faqService from '../services/faqService';

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [config, setConfig] = useState({
    siteName: 'Brokerspost Platform',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    autoApproveBrokers: false,
    maxListingsPerBroker: 100,
    supportEmail: 'admin@brokerspost.com',
    termsAndConditions: '',
    privacyPolicy: ''
  });

  const [faqs, setFaqs] = useState([]);
  const [isFaqLoading, setIsFaqLoading] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', order: 0 });
  const [showFaqForm, setShowFaqForm] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setIsFaqLoading(true);
    try {
      const response = await faqService.getAdminFAQs();
      if (response.success) {
        setFaqs(response.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setIsFaqLoading(false);
    }
  };

  const handleSaveFaq = async () => {
    try {
      if (editingFaq) {
        await faqService.updateFAQ(editingFaq._id, newFaq);
      } else {
        await faqService.createFAQ(newFaq);
      }
      setNewFaq({ question: '', answer: '', order: 0 });
      setEditingFaq(null);
      setShowFaqForm(false);
      fetchFaqs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await faqService.deleteFAQ(id);
        fetchFaqs();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
      }
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setNewFaq({ question: faq.question, answer: faq.answer, order: faq.order });
    setShowFaqForm(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const navigate = useNavigate();
  return (
    <div className="-mx-6 lg:-mx-10 -my-6 lg:-my-10 px-6 lg:px-10 py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-8 animate-fade-in pb-20">
        {/* Custom Header */}
        <div className="-mx-6 lg:-mx-10 -mt-6 lg:-mt-10 mb-4 px-6 lg:px-10 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-serif text-[#1e3a8a]">System Configuration</h1>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c0922e]" />
              <input 
                type="text" 
                placeholder="Search settings..."
                className="w-[240px] pl-9 pr-4 py-1.5 bg-[#fefce8] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/40 transition-all text-slate-600"
              />
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-1.5 rounded-full border border-slate-200 text-[#1e3a8a] text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Public Site
          </button>
        </div>

        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif text-[#1e3a8a]">System Configuration</h2>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">Manage global platform rules, security, and communication settings.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleSave} 
               className="px-8 h-10 bg-[#c0922e] text-white rounded-xl text-[11px] font-bold hover:bg-[#a67d26] transition-all shadow-lg shadow-[#c0922e]/20 flex items-center gap-2"
             >
                {isSaving ? <SettingsIcon className="animate-spin" size={14} /> : <Save size={14} />}
                Save Changes
             </button>
          </div>
        </div>

      {showSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-500">
           <CheckCircle2 className="text-emerald-500" size={20} />
           <p className="text-sm font-bold text-emerald-900">System settings updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
         {/* General Configuration */}
         <Card className="border-slate-100 shadow-xl shadow-slate-200/20 px-8 py-10">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
               <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Globe size={20} />
               </div>
                <div>
                   <h4 className="text-xl font-serif text-[#1e3a8a] leading-none">General Platform Settings</h4>
                   <p className="text-[11px] text-slate-400 font-medium mt-2">Basic site-wide information and rules.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Identity Name</label>
                   <input 
                     type="text" 
                     className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl outline-none focus:border-[#eab308]/40 transition-all text-[12px] font-bold text-slate-900"
                     value={config.siteName}
                     onChange={(e) => setConfig({...config, siteName: e.target.value})}
                   />
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Support Contact</label>
                   <input 
                     type="email" 
                     className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl outline-none focus:border-[#eab308]/40 transition-all text-[12px] font-bold text-slate-900"
                     value={config.supportEmail}
                   />
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Listing Limit</label>
                   <input 
                     type="number" 
                     className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl outline-none focus:border-[#eab308]/40 transition-all text-[12px] font-bold text-slate-900"
                     value={config.maxListingsPerBroker}
                   />
               </div>
            </div>
         </Card>

         {/* Access & Security */}
         <Card className="border-slate-100 shadow-xl shadow-slate-200/20 px-8 py-10">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
               <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Lock size={20} />
               </div>
                <div>
                   <h4 className="text-xl font-serif text-[#1e3a8a] leading-none">Security & Access Management</h4>
                   <p className="text-[11px] text-slate-400 font-medium mt-2">Control how users enter and interact.</p>
                </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all">
                  <div className="flex gap-4">
                     <ShieldAlert size={20} className="text-slate-400 mt-1" />
                     <div>
                        <h5 className="text-sm font-bold text-slate-900">Maintenance Mode</h5>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Displays a maintenance screen to customers while you work.</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})}
                    className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${config.maintenanceMode ? 'bg-[#c0922e] justify-end' : 'bg-slate-200 justify-start'}`}
                  >
                     <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
               </div>

               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all">
                  <div className="flex gap-4">
                     <Mail size={20} className="text-slate-400 mt-1" />
                     <div>
                        <h5 className="text-sm font-bold text-slate-900">Email Notifications</h5>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Broadcast system updates and verification alerts to users.</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => setConfig({...config, emailNotifications: !config.emailNotifications})}
                    className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${config.emailNotifications ? 'bg-[#c0922e] justify-end' : 'bg-slate-200 justify-start'}`}
                  >
                     <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
               </div>

               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all">
                  <div className="flex gap-4">
                     <AlertTriangle size={20} className="text-slate-400 mt-1" />
                     <div>
                        <h5 className="text-sm font-bold text-slate-900">Auto-Approve Brokers</h5>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Allow brokers to post immediately upon registration without review.</p>
                     </div>
                  </div>
                   <button 
                     onClick={() => setConfig({...config, autoApproveBrokers: !config.autoApproveBrokers})}
                     className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${config.autoApproveBrokers ? 'bg-[#c0922e] justify-end' : 'bg-slate-200 justify-start'}`}
                   >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                   </button>
                </div>
             </div>
          </Card>

         {/* Infrastructure Stats */}
          <div className="py-6 px-10 bg-slate-900 rounded-[32px] overflow-hidden relative group">
             <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-[#c0922e] shadow-inner">
                      <Server size={22} />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-[#c0922e] uppercase tracking-widest leading-none">Server Status</p>
                      <h4 className="text-white font-serif text-lg mt-1 tracking-tight">Active & Healthy (99.98% Uptime)</h4>
                   </div>
                </div>
                <div className="flex items-center gap-2 px-6 py-2 bg-slate-800 rounded-full border border-slate-700">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">v2.4.0 Production</span>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#c0922e]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
