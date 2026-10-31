import { TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#05030e] border-t border-violet-950 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-violet-600 flex items-center justify-center text-slate-950 font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">AI StockVision</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent stock-market chart analysis, AI vision OCR interpretation, price scenarios, and risk management tools in one elite educational platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-amber-400 font-bold text-xs tracking-wider uppercase mb-4">Platform Modules</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/market" className="hover:text-amber-300 transition-colors">Market Data & Quotes</Link></li>
              <li><Link to="/analyzer" className="hover:text-amber-300 transition-colors">AI Chart Analyzer</Link></li>
              <li><Link to="/assistant" className="hover:text-amber-300 transition-colors">StockVision AI Assistant</Link></li>
              <li><Link to="/risk" className="hover:text-amber-300 transition-colors">Risk & Position Calculator</Link></li>
            </ul>
          </div>

          {/* Resources & Reports */}
          <div>
            <h3 className="text-amber-400 font-bold text-xs tracking-wider uppercase mb-4">User & Reports</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/reports" className="hover:text-amber-300 transition-colors">My Saved Reports</Link></li>
              <li><Link to="/watchlist" className="hover:text-amber-300 transition-colors">Stock Watchlist</Link></li>
              <li><Link to="/login" className="hover:text-amber-300 transition-colors">User Login</Link></li>
              <li><Link to="/register" className="hover:text-amber-300 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Regulatory Notice */}
          <div>
            <h3 className="text-amber-400 font-bold text-xs tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Regulatory Notice
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              AI StockVision is an educational platform. Outputs are not guaranteed and must not be treated as personalized financial advice, trading recommendations, or SEBI-certified investment advisory services.
            </p>
          </div>
        </div>

        {/* Mandatory Full Disclaimer Box */}
        <div className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-6 mb-8 text-xs text-slate-400 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>MANDATORY EDUCATIONAL & RISK DISCLOSURE</span>
          </div>
          <p className="leading-relaxed">
            AI StockVision is provided solely for educational, research, and technical analysis demonstration purposes. The analyses, forecasts, chart markings, price scenarios, and risk calculations are uncertain and may be incomplete, inaccurate, or based on limited historical information. They do not guarantee future market performance.
          </p>
          <p className="leading-relaxed">
            <strong>SEBI & Compliance Notice:</strong> This platform does not claim to be approved, endorsed, or authorized by the Securities and Exchange Board of India (SEBI). Users should independently verify market data and consult a suitably qualified and appropriately registered professional before making any financial decisions. Past performance does not guarantee future results.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-violet-950 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>&copy; {new Date().getFullYear()} AI StockVision Elite Platform. All rights reserved.</div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Risk Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
