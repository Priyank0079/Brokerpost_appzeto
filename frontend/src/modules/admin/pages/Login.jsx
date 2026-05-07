import React, { useState } from 'react';
import { useAuth } from '../../broker/context/AuthContext';

import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2, X } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-serif text-[#273a60] tracking-tight">Platform Admin Login</h1>
            <p className="text-[11px] text-slate-400 font-medium">Restricted access — authorised personnel only</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 transition-all border border-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-[1px] bg-slate-200 w-full" />

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          {/* Warning Box */}
          <div className="bg-[#fff7ed] border border-[#ffedd5] p-4 rounded-xl flex gap-3 items-start shadow-sm">
            <div className="mt-0.5">
               <Lock size={14} className="text-[#c95728]" />
            </div>
            <p className="text-[11px] font-bold text-[#c95728] leading-relaxed">
              This login is for platform administrators only. Brokers should use the regular Login button.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
               <AlertCircle className="text-red-500" size={16} />
               <p className="text-[11px] font-bold text-red-900">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">ADMIN EMAIL *</label>
            <input 
              disabled={isLoading}
              type="email" 
              placeholder="admin@gmail.com"
              className="w-full px-5 py-3 bg-[#fefce8] border border-slate-200 rounded-xl outline-none focus:border-[#eab308]/40 transition-all text-[12px] font-bold text-slate-900 shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">ADMIN PASSWORD *</label>
            <input 
              disabled={isLoading}
              type="password" 
              placeholder="Password"
              className="w-full px-5 py-3 bg-[#fefce8] border border-slate-200 rounded-xl outline-none focus:border-[#eab308]/40 transition-all text-[12px] font-bold text-slate-900 shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="w-28 py-2.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-40 py-2.5 bg-[#0F172A] text-white rounded-xl text-[11px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={14} /> : 'Login as Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
