import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  User, 
  MapPin, 
  Building2, 
  Hash,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Login States
  const [mobile, setMobile] = useState('9111966732');
  const [otp, setOtp] = useState('1234');
  const [error, setError] = useState('');

  // Register States
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    officeAddress: '',
    workLocation: 'Mumbai',
    groupName: '',
    reraNumber: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(mobile, otp);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    register(formData);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-primary-100">
      {/* Dynamic Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
         <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-100/50 rounded-full blur-[100px]" />
         <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className={`w-full transition-all duration-500 ease-in-out ${isRegister ? 'max-w-2xl' : 'max-w-md'}`}>
         {/* Simple Branding */}
         <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center font-black text-xl text-white shadow-xl shadow-primary-600/20 shadow-primary-600/20">B</div>
            <span className="text-xl font-black tracking-tighter text-slate-900">BROKERS<span className="text-primary-600">POST</span></span>
         </div>

         <div className="bg-white border border-slate-200/60 rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 md:p-10">
               {!isRegister ? (
                  /* Compact Login */
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="text-center space-y-2">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Secure Access</h2>
                        <p className="text-slate-400 text-sm font-medium">Authenticate with your mobile number.</p>
                     </div>

                     <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-4">
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                              <div className="relative group">
                                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                 <input 
                                    type="text" 
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Enter mobile..." 
                                    className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-200 transition-all font-bold text-slate-900" 
                                 />
                              </div>
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">OTP Verification</label>
                              <div className="relative group">
                                 <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                 <input 
                                    type="text" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Verify OTP" 
                                    className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-200 transition-all font-bold tracking-[6px] text-slate-900" 
                                 />
                              </div>
                           </div>
                        </div>

                        {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}

                        <Button 
                           variant="primary" 
                           className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/20"
                           type="submit"
                           rightIcon={<ChevronRight size={16} />}
                        >
                           Proceed to Dashboard
                        </Button>
                     </form>

                     <div className="pt-4 text-center">
                         <p className="text-xs font-medium text-slate-400">
                            New to the network? 
                            <Link 
                               to="/register"
                               className="ml-2 font-black text-primary-600 hover:underline"
                            >
                               Create Account
                            </Link>
                         </p>
                     </div>
                  </div>
               ) : (
                  /* Compact Registration */
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Registration</h2>
                           <p className="text-slate-400 text-sm font-medium">Join the professional network.</p>
                        </div>
                        <button 
                           onClick={() => setIsRegister(false)}
                           className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-100"
                        >
                           <ArrowLeft size={20} />
                        </button>
                     </div>

                     <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5 md:col-span-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                           <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600" size={18} />
                              <input 
                                 required
                                 type="text" 
                                 placeholder="Full Name"
                                 className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold"
                                 value={formData.name}
                                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact No.</label>
                           <input 
                              required
                              type="text" 
                              placeholder="Mobile Number"
                              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold"
                              value={formData.mobile}
                              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                           />
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID</label>
                           <input 
                              required
                              type="email" 
                              placeholder="Professional Email"
                              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                           />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Regional Presence</label>
                           <select 
                              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold appearance-none"
                              value={formData.workLocation}
                              onChange={(e) => setFormData({...formData, workLocation: e.target.value})}
                           >
                              <option>Mumbai</option>
                              <option>Delhi NCR</option>
                              <option>Bangalore</option>
                              <option>Pune</option>
                           </select>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RERA / Identity No.</label>
                           <input 
                              type="text" 
                              placeholder="A518000XXXXX"
                              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold"
                              value={formData.reraNumber}
                              onChange={(e) => setFormData({...formData, reraNumber: e.target.value})}
                           />
                        </div>

                        <Button 
                           variant="primary" 
                           className="md:col-span-2 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/20 mt-2"
                           type="submit"
                        >
                           Submit Approval Request
                        </Button>
                     </form>
                  </div>
               )}
            </div>
            
            {/* Footer Notice */}
            <div className="px-8 pb-8 text-center">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Professionals Only Network</span>
               </div>
            </div>
         </div>
         
         <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[3px]">© 2026 Brokerspost Network</p>
      </div>
    </div>
  );
};

export default Login;
