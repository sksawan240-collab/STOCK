import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.requireOtp) {
        navigate('/register', { state: { email, requireOtp: true } });
        return;
      }
      navigate('/analyzer');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Chart Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        {/* SVG Animated Chart Wave */}
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradLogin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,300 Q300,100 600,250 T1200,200 L1200,800 L0,800 Z" fill="url(#gradLogin)" />
          <path d="M0,300 Q300,100 600,250 T1200,200" fill="none" stroke="#fbbf24" strokeWidth="3" />
          <path d="M0,400 Q400,200 800,350 T1400,300" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>

      <div className="max-w-md w-full bg-[#0c081e] border border-violet-900/55 rounded-3xl p-8 sm:p-10 shadow-[0_0_60px_rgba(139,92,246,0.2)] backdrop-blur-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-violet-600 to-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30">
            <TrendingUp className="w-8 h-8 text-slate-950 font-black" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">Log in to your AI StockVision account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full pl-11 pr-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-sm shadow-inner"
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
                className="w-full pl-11 pr-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-sm shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black shadow-lg shadow-violet-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-base mt-2"
          >
            {loading ? 'Logging in...' : 'Log In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-400 font-bold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
