import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        onClose();
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[400px] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-5 lg:p-6 pb-2">
          {/* Header */}
          <div className="">
            <h2 className="text-2xl font-serif font-medium text-[#273a60] mb-1">Broker Login</h2>
            <p className="text-slate-400 text-xs">Access your inventory dashboard</p>
          </div>
        </div>

        <div className="h-[1px] bg-slate-300 w-full" />

        <div className="p-5 lg:p-6 pt-2">
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-2">
              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  EMAIL ADDRESS *
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[#fdf8f3] border border-transparent rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/5 focus:border-[#c8962a]/20 transition-all font-medium text-xs text-slate-900 placeholder:text-slate-600"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  PASSWORD *
                </label>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-3 bg-[#fdf8f3] border border-transparent rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/5 focus:border-[#c8962a]/20 transition-all font-medium text-xs text-slate-900 placeholder:text-slate-600"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-500 text-center bg-red-50 py-2 rounded-lg animate-shake">
                {error}
              </p>
            )}

            {/* Registration Link */}
            <div className="text-center pt-2">
              <p className="text-xs font-medium text-slate-400">
                Not registered? <Link to="/register" onClick={onClose} className="font-bold text-[#1a365d] hover:underline">Register here</Link>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-1">
              <button 
                type="button"
                onClick={onClose}
                className="w-28 py-2.5 rounded-lg border-2 border-slate-100 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="w-28 py-2.5 rounded-lg bg-[#c8962a] text-white text-[12px] font-bold shadow-xl shadow-[#c8962a]/20 hover:bg-[#b08425] transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
