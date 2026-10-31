import React, { useState } from 'react';
import api from '../services/api';
import { ShieldAlert, Calculator, TrendingUp, AlertTriangle } from 'lucide-react';

export default function RiskManagement() {
  const [entryPrice, setEntryPrice] = useState('150');
  const [stopLossPrice, setStopLossPrice] = useState('144');
  const [targetPrice, setTargetPrice] = useState('168');
  const [capital, setCapital] = useState('100000');
  const [riskPct, setRiskPct] = useState('2');
  const [calculation, setCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/risk/calculate', {
        entryPrice,
        stopLossPrice,
        targetPrice,
        capital,
        riskPct
      });
      setCalculation(res.data.calculation);
    } catch (err: any) {
      setError(err.message || 'Calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4 shadow-[0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-md">
            <ShieldAlert className="w-4 h-4" /> Capital Preservation & Position Sizing
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Risk Management Calculator
          </h1>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Calculate precise position quantity, risk-to-reward ratio, and maximum planned exposure before entering any educational trade scenario.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-amber-400" /> Trade Parameters
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Reference Entry Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Stop-Loss Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Target Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Total Capital (₹)</label>
                  <input
                    type="number"
                    required
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Risk Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={riskPct}
                    onChange={(e) => setRiskPct(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black shadow-lg shadow-violet-500/25 hover:opacity-95 transition-all mt-4 text-base"
              >
                {loading ? 'Calculating...' : 'Calculate Risk & Position'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-black text-white mb-6">Educational Risk Breakdown</h2>
              {calculation ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#070514]/80 border border-violet-900/40 p-5 rounded-2xl shadow-md">
                      <div className="text-xs text-slate-400 uppercase font-bold">Recommended Quantity</div>
                      <div className="text-2xl font-black text-amber-400 mt-1">{calculation.recommendedQuantity} Shares</div>
                    </div>
                    <div className="bg-[#070514]/80 border border-violet-900/40 p-5 rounded-2xl shadow-md">
                      <div className="text-xs text-slate-400 uppercase font-bold">Risk : Reward Ratio</div>
                      <div className="text-2xl font-black text-emerald-400 mt-1">{calculation.riskRewardRatio}</div>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between py-2.5 border-b border-violet-950">
                      <span className="text-slate-400">Allowed Capital At Risk</span>
                      <span className="font-bold text-white">₹{calculation.allowedCapitalAtRisk}</span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-violet-950">
                      <span className="text-slate-400">Total Position Exposure</span>
                      <span className="font-bold text-white">₹{calculation.totalExposure}</span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-violet-950">
                      <span className="text-slate-400">Potential Profit</span>
                      <span className="font-bold text-emerald-400">+₹{calculation.potentialProfit}</span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-violet-950">
                      <span className="text-slate-400">Potential Loss</span>
                      <span className="font-bold text-rose-400">-₹{calculation.potentialLoss}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
                  <Calculator className="w-12 h-12 mb-3 stroke-1 text-violet-600" />
                  <p className="text-sm">Enter your trade parameters and click calculate to view risk breakdown.</p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>Stop-loss orders do not guarantee execution at exact prices during gap downs. Actual losses can exceed calculated estimates.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
