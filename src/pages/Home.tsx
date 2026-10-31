import { Link } from 'react-router-dom';
import { UploadCloud, BarChart2, Bot, ShieldAlert, FileText, Bookmark, ArrowRight, Sparkles, CheckCircle2, TrendingUp, Zap, Activity } from 'lucide-react';

export default function Home() {
  const indices = [
    { symbol: 'NIFTY 50', price: '24,350.25', points: '+185.40', pct: '+0.77%', positive: true, exchange: 'NSE' },
    { symbol: 'BSE SENSEX', price: '79,820.10', points: '+540.20', pct: '+0.68%', positive: true, exchange: 'BSE' },
    { symbol: 'NIFTY BANK', price: '51,240.80', points: '+410.50', pct: '+0.81%', positive: true, exchange: 'NSE' },
    { symbol: 'S&P 500', price: '5,820.40', points: '+42.10', pct: '+0.73%', positive: true, exchange: 'NYSE' },
    { symbol: 'NASDAQ', price: '18,518.60', points: '+175.20', pct: '+0.95%', positive: true, exchange: 'NASDAQ' }
  ];

  const features = [
    {
      title: 'AI Chart Image Analysis',
      description: 'Upload stock chart screenshots for high-precision AI vision OCR pattern recognition and support/resistance mapping.',
      icon: UploadCloud,
      path: '/analyzer',
      badge: 'AI Vision OCR',
      color: 'from-amber-400 via-violet-600 to-cyan-500',
      glow: 'shadow-amber-500/20',
    },
    {
      title: 'Market Quotes & Indicators',
      description: 'Access real-time quotes, RSI momentum oscillators, MACD crossovers, and historical candlestick price series.',
      icon: BarChart2,
      path: '/market',
      badge: 'Live Data',
      color: 'from-violet-600 via-indigo-600 to-cyan-500',
      glow: 'shadow-violet-500/20',
    },
    {
      title: 'StockVision AI Assistant',
      description: 'Interact with a context-aware financial chatbot trained to answer complex technical analysis and risk management queries.',
      icon: Bot,
      path: '/assistant',
      badge: 'Gemini 2.5',
      color: 'from-indigo-600 via-purple-600 to-pink-500',
      glow: 'shadow-indigo-500/20',
    },
    {
      title: 'Risk Management Calculator',
      description: 'Calculate precise position sizing, stop-loss exposure, reward-to-risk ratio, and capital preservation metrics.',
      icon: ShieldAlert,
      path: '/risk',
      badge: 'Capital Safety',
      color: 'from-purple-600 via-pink-600 to-amber-500',
      glow: 'shadow-purple-500/20',
    },
    {
      title: 'Downloadable PDF Reports',
      description: 'Generate multi-page institutional-grade PDF analysis reports complete with mandatory SEBI compliance disclosures.',
      icon: FileText,
      path: '/reports',
      badge: 'Instant Export',
      color: 'from-pink-600 via-rose-600 to-amber-400',
      glow: 'shadow-pink-500/20',
    },
    {
      title: 'Personal Watchlist',
      description: 'Monitor your preferred equities, indices, and crypto assets with live price feeds and instant analysis triggers.',
      icon: Bookmark,
      path: '/watchlist',
      badge: 'Asset Tracker',
      color: 'from-cyan-500 via-teal-500 to-emerald-400',
      glow: 'shadow-cyan-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070514] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-gradient-to-tr from-amber-500/10 via-violet-600/15 to-cyan-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-950/60 border border-violet-500/30 text-amber-300 text-xs font-bold mb-6 shadow-[0_0_25px_rgba(139,92,246,0.2)] backdrop-blur-md animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400" /> Real-Time Nifty 50, Sensex & Global Indices Live Feed
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.08]">
          Understand the Market.{' '}
          <span className="bg-gradient-to-r from-amber-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(251,191,36,0.3)]">
            Analyze the Chart.
          </span>{' '}
          Master the Risk.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          The ultimate elite educational platform combining AI vision chart OCR, technical indicator analysis, scenario forecasting, and robust risk management.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/analyzer"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black text-sm sm:text-base shadow-[0_0_35px_rgba(251,191,36,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            <UploadCloud className="w-5 h-5" /> Launch Chart Analyzer <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/market"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0c081e] border border-violet-900/60 text-slate-200 font-bold text-sm sm:text-base hover:bg-violet-950/40 transition-all flex items-center justify-center gap-3 backdrop-blur-md"
          >
            <BarChart2 className="w-5 h-5 text-amber-400" /> Explore Live Markets
          </Link>
        </div>

        {/* Real-Time Indices Ticker Bar */}
        <div className="mt-14 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 animate-pulse text-amber-400" /> Live Market Indices Points & Prices
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Updated Real-Time</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {indices.map((ind, i) => (
              <div key={i} className="bg-[#0c081e]/80 border border-violet-900/40 rounded-2xl p-4 text-left backdrop-blur-xl shadow-lg hover:border-violet-500/60 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                  <span>{ind.symbol}</span>
                  <span className="px-1.5 py-0.5 rounded bg-violet-950 text-[10px] text-amber-300 font-mono">{ind.exchange}</span>
                </div>
                <div className="text-xl font-black text-white">{ind.price}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{ind.points}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">({ind.pct})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className="flex items-center gap-3 bg-[#0c081e]/60 border border-violet-900/40 p-4 rounded-2xl backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-300">AI Vision OCR Charts</span>
          </div>
          <div className="flex items-center gap-3 bg-[#0c081e]/60 border border-violet-900/40 p-4 rounded-2xl backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-300">RSI & MACD Indicators</span>
          </div>
          <div className="flex items-center gap-3 bg-[#0c081e]/60 border border-violet-900/40 p-4 rounded-2xl backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Risk & Position Sizing</span>
          </div>
          <div className="flex items-center gap-3 bg-[#0c081e]/60 border border-violet-900/40 p-4 rounded-2xl backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-300">SEBI Compliant PDFs</span>
          </div>
        </div>
      </div>

      {/* Feature Grid Section */}
      <div className="relative py-24 bg-gradient-to-b from-[#070514] via-[#0c081e]/60 to-[#070514] border-t border-violet-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4">
              <Zap className="w-3.5 h-3.5" /> Institutional Grade Tools
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Comprehensive Financial & AI Suites
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Engineered with high fidelity for students, researchers, and technical analysts seeking rigorous market understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={idx}
                  to={feat.path}
                  className="group relative bg-[#0c081e]/80 border border-violet-900/40 hover:border-amber-400/60 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 shadow-2xl hover:shadow-[0_0_35px_rgba(251,191,36,0.15)] flex flex-col justify-between backdrop-blur-xl overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-slate-950 shadow-lg ${feat.glow} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 font-bold" />
                      </div>
                      <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-violet-950 text-amber-300 border border-violet-800">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-amber-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-normal">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-violet-950 flex items-center justify-between text-sm font-bold text-amber-400 group-hover:text-amber-300">
                    <span>Explore Module</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
