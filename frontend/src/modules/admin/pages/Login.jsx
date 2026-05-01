import React, { useState } from 'react';
import { useAuth } from '../../broker/context/AuthContext';

import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../../broker/components/ui/Button';


const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Small delay for professional feel
    setTimeout(async () => {
      const result = await adminLogin(email, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError('Invalid superuser credentials. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-primary-600 rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-primary-600/30 mb-6 rotate-3">
              <ShieldCheck size={32} className="text-white" />
           </div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h1>
           <p className="text-slate-400 font-medium mt-2 uppercase text-[10px] tracking-[3px]">Master Access Authority</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 p-10 relative overflow-hidden">
           {/* Top Accent Bar */}
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-blue-400" />
           
           <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                   <AlertCircle className="text-red-500" size={18} />
                   <p className="text-xs font-bold text-red-900">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Email Identity</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                    <input 
                       disabled={isLoading}
                       type="email" 
                       placeholder="admin@gmail.com"
                       className="w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 focus:ring-8 focus:ring-primary-500/5 transition-all text-sm font-bold text-slate-900"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                    />
                 </div>
              </div>


              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secret Access Key</label>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                    <input 
                       disabled={isLoading}
                       type="password" 
                       placeholder="Enter passcode"
                       className="w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 focus:ring-8 focus:ring-primary-500/5 transition-all text-sm font-bold text-slate-900"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                    />
                 </div>
              </div>

              <Button 
                 type="submit"
                 variant="primary" 
                 fullWidth 
                 loading={isLoading}
                 className="py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary-600/20 mt-4 active:scale-95 transition-all"
                 rightIcon={!isLoading && <ArrowRight size={18} />}
              >
                 Authorize Access
              </Button>
           </form>

           {/* Backdrop elements */}
           <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary-50 rounded-full blur-3xl opacity-50" />
        </div>

        <p className="text-center mt-12 text-slate-400 text-[10px] font-black uppercase tracking-widest">
           Protected by AES-256 System Encryption
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
