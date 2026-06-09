import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const { login, sendLoginOTP, loginWithOTP, forgotPassword, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpStep, setOtpStep] = useState(1); // 1: Email, 2: OTP
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Phone, 2: OTP & Password

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        onClose();
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const result = await sendLoginOTP(email);
      if (result.success) {
        setOtpStep(2);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginWithOTP(email, otp);
      if (result.success) {
        onClose();
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const result = await forgotPassword(phoneNumber);
      if (result.success) {
        setForgotStep(2);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await resetPassword(phoneNumber, otp, newPassword);
      if (result.success) {
        // Reset successful, go back to normal login
        setIsForgotPassword(false);
        setForgotStep(1);
        setOtp('');
        setPhoneNumber('');
        setNewPassword('');
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };


  const resetView = () => {
    setIsForgotPassword(false);
    setIsOtpLogin(false);
    setForgotStep(1);
    setOtpStep(1);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#f0ebe0] text-slate-400 hover:bg-[#e6ddcd] hover:text-slate-600 transition-all"
        >
          <X size={20} />
        </button>

        <div className="px-4 pt-5 lg:px-5 lg:pt-6 pb-4">
          {/* Header */}
          <div className="">
            <h2 className="text-xl font-serif font-medium text-[#6b515f] mb-1">
              {isForgotPassword ? (forgotStep === 2 ? 'Reset Password' : 'Forgot Password') :
               isOtpLogin && otpStep === 2 ? 'Verify OTP' : 'Broker Login'}
            </h2>
            <p className="text-[#738192] text-[11px] tracking-tight">
              {isForgotPassword ? (forgotStep === 2 ? `OTP sent to ${phoneNumber}` : 'Enter registered phone number') :
               isOtpLogin && otpStep === 2 ? `OTP sent to ${email}` : 'Access your inventory dashboard'}
            </p>
          </div>
        </div>

        <div className="h-[1px] bg-[#f0ede6] w-full" />

        <div className="p-4 lg:p-5 pt-2">
          {error && (
            <p className="text-[10px] font-bold text-red-500 text-center bg-red-50 py-2 rounded-lg mb-4 animate-shake">
              {error}
            </p>
          )}

          {isForgotPassword ? (
             forgotStep === 1 ? (
               /* Forgot Password - Step 1: Phone */
               <form onSubmit={handleForgotPasswordSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-black text-[#6e7d90] uppercase tracking-wider ml-1">
                      PHONE NUMBER *
                    </label>
                    <input 
                      type="tel"
                      required
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 bg-[#fdf8f3] border border-[#ddd6c8] rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/5 focus:border-[#c8962a]/20 transition-all text-xs font-medium text-slate-900 placeholder:text-[#919190]"
                    />
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      type="submit"
                      disabled={loading || phoneNumber.length !== 10}
                      className="w-full py-3.5 rounded-xl bg-[#c8962a] text-white text-sm font-bold shadow-xl shadow-[#c8962a]/20 hover:bg-[#b08425] transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? 'Sending OTP...' : 'Get Reset OTP'}
                    </button>
                    <button 
                      type="button"
                      onClick={resetView}
                      className="text-xs font-bold text-slate-400 hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
               </form>
             ) : (
               /* Forgot Password - Step 2: Reset */
               <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      ENTER 4-DIGIT OTP
                    </label>
                    <input 
                      type="text"
                      maxLength={4}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="0000"
                      className="w-full px-4 py-4 bg-[#fdf8f3] border border-transparent rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/5 focus:border-[#c8962a]/20 transition-all text-center text-2xl font-black tracking-[0.5em] text-[#1a365d] placeholder:text-[#919190]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-black text-[#6e7d90] uppercase tracking-wider ml-1">
                      NEW PASSWORD *
                    </label>
                    <input 
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-4 py-3 bg-[#fdf8f3] border border-[#ddd6c8] rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/5 focus:border-[#c8962a]/20 transition-all text-xs font-medium text-slate-900 placeholder:text-[#919190]"
                    />
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      type="submit"
                      disabled={loading || otp.length < 4 || newPassword.length < 6}
                      className="w-full py-3.5 rounded-xl bg-[#c8962a] text-white text-sm font-bold shadow-xl shadow-[#c8962a]/20 hover:bg-[#b08425] transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="text-xs font-bold text-slate-400 hover:underline"
                    >
                      Change Phone Number
                    </button>
                  </div>
               </form>
             )
          ) : !isOtpLogin ? (
            /* Password Login Form */
            <form onSubmit={handlePasswordLogin} className="space-y-3">
              <div className="space-y-2">
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-black text-[#6e7d90] uppercase tracking-wider ml-1">
                    EMAIL ADDRESS *
                  </label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-[#fdf8f3] border border-[#ddd6c8] rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/5 focus:border-[#c8962a]/20 transition-all text-xs font-medium text-slate-900 placeholder:text-[#919190]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center pr-1">
                    <label className="text-[10.5px] font-black text-[#6e7d90] uppercase tracking-wider ml-1">
                      PASSWORD *
                    </label>
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-[10px] font-bold text-[#c8962a] hover:underline">
                      Forgot?
                    </button>
                  </div>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-3 bg-[#fdf8f3] border border-[#ddd6c8] rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/5 focus:border-[#c8962a]/20 transition-all text-xs font-medium text-slate-900 placeholder:text-[#919190]"
                  />
                </div>
              </div>

              <div className="text-center pt-2 flex flex-col gap-2">
                 <button type="button" onClick={() => setIsOtpLogin(true)} className="text-xs font-bold text-[#1a365d] hover:underline">
                    Login with OTP instead
                 </button>
                <p className="text-xs font-medium text-[#748295]">
                  Not registered? <button type="button" onClick={onSwitchToRegister} className="font-bold text-[#1a365d] hover:underline">Register here</button>
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-3 py-3 rounded-lg border border-[#1a365d] text-xs font-bold text-[#1a365d] hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-3 rounded-lg bg-[#c8962a] text-white text-xs font-bold hover:bg-[#b48c35] transition-all shadow-lg shadow-[#c8962a]/20 flex items-center justify-center gap-2"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          ) : otpStep === 1 ? (
            /* OTP Login - Step 1: Email */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-black text-[#6e7d90] uppercase tracking-wider ml-1">
                  EMAIL ADDRESS
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter registered email"
                  className="w-full px-4 py-3 bg-[#fdf8f3] border border-transparent rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/5 focus:border-[#c8962a]/20 transition-all text-xs font-medium text-slate-900 placeholder:text-[#919190]"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#1a365d] text-white text-sm font-bold shadow-xl shadow-blue-900/10 hover:bg-[#122a4a] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending OTP...' : 'Get Login OTP'}
                </button>
                <button 
                  type="button"
                  onClick={resetView}
                  className="text-xs font-bold text-slate-400 hover:underline"
                >
                  Back to Password Login
                </button>
              </div>
            </form>
          ) : (
            /* OTP Login - Step 2: Verify OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
               <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  ENTER 4-DIGIT OTP
                </label>
                <input 
                  type="text"
                  maxLength={4}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000"
                  className="w-full px-4 py-4 bg-[#fdf8f3] border border-transparent rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/5 focus:border-[#c8962a]/20 transition-all text-center text-2xl font-black tracking-[0.5em] text-[#1a365d] placeholder:text-[#919190]"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  type="submit"
                  disabled={loading || otp.length < 4}
                  className="w-full py-3.5 rounded-xl bg-[#c8962a] text-white text-sm font-bold shadow-xl shadow-[#c8962a]/20 hover:bg-[#b08425] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
                <button 
                  type="button"
                  onClick={() => setOtpStep(1)}
                  className="text-xs font-bold text-slate-400 hover:underline"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}


        </div>
      </div>
    </div>
  );
};

export default LoginModal;
