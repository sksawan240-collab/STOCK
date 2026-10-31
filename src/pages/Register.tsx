import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Lock, Mail, User as UserIcon, ShieldCheck, ArrowRight, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function Register() {
  const { register, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<'register' | 'otp'>(location.state?.requireOtp ? 'otp' : 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  
  // 4-digit OTP state matching the reference video design
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState('471968'); // Demo OTP for the FILL helper
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (step === 'otp') {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(name, email, password);
      if (res.requireOtp) {
        setStep('otp');
        setSuccessMsg(res.message || 'Verification OTP sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    const digit = cleanVal.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (index < 5 && digit) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleFillDemoOtp = () => {
    const digits = demoOtp.split('');
    setOtpDigits(digits);
    inputRefs[5].current?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otpDigits.join('');
    if (finalOtp.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, finalOtp);
      navigate('/analyzer');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await resendOtp(email);
      setSuccessMsg('A new OTP has been sent to your email.');
      setCountdown(30);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] flex items-center justify-center px-4 relative overflow-hidden py-12">
      {/* Animated Chart Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradRegVideo" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,250 Q350,150 700,280 T1400,220 L1400,800 L0,800 Z" fill="url(#gradRegVideo)" />
          <path d="M0,250 Q350,150 700,280 T1400,220" fill="none" stroke="#8b5cf6" strokeWidth="3" />
          <path d="M0,350 Q450,220 900,320 T1600,280" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6,6" />
        </svg>
      </div>

      <div className="max-w-md w-full bg-[#0c081e] border border-violet-900/55 rounded-3xl p-8 sm:p-10 shadow-[0_0_60px_rgba(139,92,246,0.2)] backdrop-blur-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-violet-600 to-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30">
            <TrendingUp className="w-8 h-8 text-slate-950 font-black" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {step === 'register' ? 'Create Account' : 'Verify your number'}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {step === 'register'
              ? 'Start your AI stock market education journey'
              : `Enter the 6-digit code sent to ${email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black shadow-lg shadow-violet-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 text-base"
            >
              {loading ? 'Creating Account...' : 'Continue to Verification'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-8">
            {/* 4 Digit OTP Boxes matching video design */}
            <div className="flex justify-center gap-4 my-6">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-3xl font-black bg-[#070514] border-2 border-violet-900/70 focus:border-amber-400 rounded-2xl text-white shadow-inner transition-all focus:scale-105 outline-none"
                />
              ))}
            </div>

            {/* Interactive FILL helper matching video */}
            <div className="bg-[#070514]/90 border border-violet-900/60 rounded-2xl p-4 flex items-center justify-between shadow-inner">
              <div className="text-xs text-slate-300 font-mono">
                <span className="text-amber-400 font-bold">MESSAGE : OTP</span> <br />
                {demoOtp} is your verification-code.
              </div>
              <button
                type="button"
                onClick={handleFillDemoOtp}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow hover:opacity-95 transition-all uppercase tracking-wider"
              >
                FILL
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black shadow-lg shadow-violet-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-base"
            >
              {loading ? 'Verifying Code...' : 'Verify & Complete'} <ShieldCheck className="w-5 h-5" />
            </button>

            <div className="text-center text-xs text-slate-400">
              {countdown > 0 ? (
                <span>Didn't receive the code? Resend in <strong className="text-amber-400">{countdown}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-amber-400 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                </button>
              )}
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-400 font-bold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}