import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import { api } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        const userData = result.user;
        
        if (userData.role === 'Administrator' || userData.role === 'Super Admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-primary-100">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
         <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-100/50 rounded-full blur-[100px]" />
         <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md">
         <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center font-black text-xl text-white shadow-xl shadow-primary-600/20">B</div>
            <span className="text-xl font-black tracking-tighter text-slate-900">BROKERS<span className="text-primary-600">POST</span></span>
         </div>

         <div className="bg-white border border-slate-200/60 rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 text-sm font-medium">Access your broker dashboard.</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                          <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                              <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email..." 
                                className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-200 transition-all font-bold text-slate-900" 
                              />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                          <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                              <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" 
                                className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-200 transition-all font-bold text-slate-900" 
                              />
                              <button 
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                          </div>
                        </div>
                    </div>

                    {error && <p className="text-xs font-bold text-red-500 text-center bg-red-50 py-2 rounded-lg">{error}</p>}

                    <Button 
                        variant="primary" 
                        className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/20"
                        type="submit"
                        disabled={loading}
                        rightIcon={loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ChevronRight size={16} />}
                    >
                        {loading ? 'Authenticating...' : 'Sign In Now'}
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
            </div>
            
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
