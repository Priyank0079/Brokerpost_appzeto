import React, { useState } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';

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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl space-y-10 animate-fade-in py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h1>
           <p className="text-slate-500 font-medium mt-1">Manage global platform rules, security, and communication settings.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          loading={isSaving}
          leftIcon={<Save size={18} />} 
          className="px-8 font-bold shadow-lg shadow-primary-600/20"
        >
          Save Changes
        </Button>
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
                  <h4 className="text-xl font-bold text-slate-900 leading-none">General Platform Settings</h4>
                  <p className="text-xs text-slate-400 mt-2">Basic site-wide information and rules.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Identity Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold text-slate-900"
                    value={config.siteName}
                    onChange={(e) => setConfig({...config, siteName: e.target.value})}
                  />
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Support Contact</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold text-slate-900"
                    value={config.supportEmail}
                  />
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Listing Limit</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold text-slate-900"
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
                  <h4 className="text-xl font-bold text-slate-900 leading-none">Security & Access Management</h4>
                  <p className="text-xs text-slate-400 mt-2">Control how users enter and interact.</p>
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
                    className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${config.maintenanceMode ? 'bg-orange-500 justify-end' : 'bg-slate-200 justify-start'}`}
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
                    className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${config.emailNotifications ? 'bg-primary-600 justify-end' : 'bg-slate-200 justify-start'}`}
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
                    className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${config.autoApproveBrokers ? 'bg-red-500 justify-end' : 'bg-slate-200 justify-start'}`}
                  >
                     <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
               </div>
            </div>
         </Card>

         {/* Legal & Compliance */}
         <Card className="border-slate-100 shadow-xl shadow-slate-200/20 px-8 py-10">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
               <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <ShieldAlert size={20} />
               </div>
               <div>
                  <h4 className="text-xl font-bold text-slate-900 leading-none">Legal & Compliance</h4>
                  <p className="text-xs text-slate-400 mt-2">Manage Terms of Service and Privacy Policy content.</p>
               </div>
            </div>

            <div className="space-y-8">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terms and Conditions</label>
                  <textarea 
                    rows="5"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-medium text-slate-700 resize-none"
                    placeholder="Enter Terms and Conditions content..."
                    value={config.termsAndConditions}
                    onChange={(e) => setConfig({...config, termsAndConditions: e.target.value})}
                  />
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Privacy Policy</label>
                  <textarea 
                    rows="5"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-medium text-slate-700 resize-none"
                    placeholder="Enter Privacy Policy content..."
                    value={config.privacyPolicy}
                    onChange={(e) => setConfig({...config, privacyPolicy: e.target.value})}
                  />
               </div>
            </div>
         </Card>

         {/* Infrastructure Stats */}
         <div className="py-6 px-10 bg-slate-900 rounded-[32px] overflow-hidden relative group">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-primary-400 shadow-inner">
                     <Server size={22} />
                  </div>
                  <div>
                     <p className="text-xs font-black text-primary-400 uppercase tracking-widest leading-none">Server Status</p>
                     <h4 className="text-white font-bold text-lg mt-1 tracking-tight">Active & Healthy (99.98% Uptime)</h4>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-6 py-2 bg-slate-800 rounded-full border border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">v2.4.0 Production</span>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
         </div>
      </div>
    </div>
  );
};

export default Settings;
