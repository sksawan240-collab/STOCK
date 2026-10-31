import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Briefcase, Plus, TrendingUp, TrendingDown, Trash2, DollarSign, ShieldAlert, PieChart as PieIcon } from 'lucide-react';

export default function PortfolioDashboard() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add transaction modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [exchange, setExchange] = useState('NSE');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api.get('/portfolio');
      setPortfolio(res.data.portfolio);
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAddInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !quantity || !buyPrice) return;
    try {
      await api.post('/portfolio/investments', {
        symbol: symbol.trim().toUpperCase(),
        exchange,
        quantity: parseFloat(quantity),
        buyPrice: parseFloat(buyPrice)
      });
      setShowAddModal(false);
      setSymbol('');
      setQuantity('');
      setBuyPrice('');
      fetchPortfolio();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteInvestment = async (id: string) => {
    if (!confirm('Remove this investment from portfolio?')) return;
    try {
      await api.delete(`/portfolio/investments/${id}`);
      fetchPortfolio();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const COLORS = ['#fbbf24', '#8b5cf6', '#06b6d4', '#34d399', '#f43f5e', '#3b82f6'];

  const allocationData = portfolio?.investments?.map((inv: any) => ({
    name: inv.symbol,
    value: inv.currentValue
  })) || [];

  return (
    <div className="min-h-screen bg-[#070514] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0c081e] border border-violet-900/40 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Briefcase className="w-3.5 h-3.5" /> Wealth & Investment Tracking
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Portfolio Management Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track your real-time investment gains/losses, asset allocation charts, and overall portfolio metrics.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-violet-500/25 hover:opacity-95 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5" /> Add Investment
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Portfolio Summary Metrics */}
        {portfolio && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0c081e] border border-violet-900/40 p-6 rounded-3xl shadow-xl">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Invested</div>
              <div className="text-3xl font-black text-white mt-2">₹{portfolio.totalInvested?.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Cost Basis</div>
            </div>

            <div className="bg-[#0c081e] border border-violet-900/40 p-6 rounded-3xl shadow-xl">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Current Portfolio Value</div>
              <div className="text-3xl font-black text-white mt-2">₹{portfolio.totalCurrentValue?.toLocaleString()}</div>
              <div className="text-xs text-cyan-400 mt-1">Real-Time Market Valuation</div>
            </div>

            <div className="bg-[#0c081e] border border-violet-900/40 p-6 rounded-3xl shadow-xl">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Gain / Loss</div>
              <div className={`text-3xl font-black mt-2 flex items-center gap-1 ${portfolio.totalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {portfolio.totalGainLoss >= 0 ? '+' : ''}₹{portfolio.totalGainLoss?.toLocaleString()}
              </div>
              <div className={`text-xs font-bold mt-1 ${portfolio.totalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {portfolio.totalGainLoss >= 0 ? '+' : ''}{portfolio.totalGainLossPct}% Return
              </div>
            </div>

            <div className="bg-[#0c081e] border border-violet-900/40 p-6 rounded-3xl shadow-xl">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Assets</div>
              <div className="text-3xl font-black text-white mt-2">{portfolio.investments?.length || 0}</div>
              <div className="text-xs text-amber-400 mt-1">Active Holdings</div>
            </div>
          </div>
        )}

        {/* Recharts Allocation & Performance Analytics */}
        {portfolio?.investments?.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Allocation Pie Chart */}
            <div className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-amber-400" /> Portfolio Asset Allocation
              </h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {allocationData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#070514', borderColor: '#8b5cf6', borderRadius: '12px' }}
                      formatter={(val: any) => [`₹${val}`, 'Value']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Bar Chart */}
            <div className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" /> Holding-Wise Profit / Loss (₹)
              </h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolio.investments}>
                    <XAxis dataKey="symbol" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#070514', borderColor: '#8b5cf6', borderRadius: '12px' }}
                      formatter={(val: any) => [`₹${val}`, 'P&L']}
                    />
                    <Bar dataKey="gainLoss" fill="#34d399" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Investments Holdings Table */}
        <div className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          <h3 className="text-xl font-black text-white">Investment Holdings</h3>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading portfolio holdings...</div>
          ) : !portfolio || portfolio.investments?.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <Briefcase className="w-12 h-12 text-amber-400/50 mx-auto" />
              <h4 className="text-lg font-black text-white">No investments added yet</h4>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Click "Add Investment" above to record your stock purchases and track real-time valuations and gains/losses.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-violet-950 text-xs font-bold text-slate-400 uppercase">
                    <th className="py-3 px-4">Symbol</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Buy Price</th>
                    <th className="py-3 px-4">Current Price</th>
                    <th className="py-3 px-4">Invested</th>
                    <th className="py-3 px-4">Current Value</th>
                    <th className="py-3 px-4">Gain / Loss</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-violet-950/60 font-medium">
                  {portfolio.investments.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-violet-950/20 transition-colors">
                      <td className="py-4 px-4 font-black text-white flex items-center gap-2">
                        {inv.symbol}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-violet-950 text-amber-300 font-mono border border-violet-800">{inv.exchange}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{inv.quantity}</td>
                      <td className="py-4 px-4 text-slate-300">₹{inv.buyPrice}</td>
                      <td className="py-4 px-4 text-white font-bold">₹{inv.currentPrice}</td>
                      <td className="py-4 px-4 text-slate-300">₹{inv.investedAmount}</td>
                      <td className="py-4 px-4 text-white font-bold">₹{inv.currentValue}</td>
                      <td className={`py-4 px-4 font-bold ${inv.gainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {inv.gainLoss >= 0 ? '+' : ''}₹{inv.gainLoss} ({inv.gainLossPct}%)
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDeleteInvestment(inv.id)}
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors border border-rose-500/20"
                          title="Delete Holding"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Investment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0c081e] border border-violet-900/60 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-black text-white mb-6">Add Investment Holding</h3>
              <form onSubmit={handleAddInvestment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Stock Symbol</label>
                  <input
                    type="text"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="e.g. RELIANCE, AAPL"
                    className="w-full px-4 py-3 bg-[#070514] border border-violet-900/60 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Exchange</label>
                  <select
                    value={exchange}
                    onChange={(e) => setExchange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#070514] border border-violet-900/60 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                  >
                    <option value="NSE">NSE (India)</option>
                    <option value="BSE">BSE (India)</option>
                    <option value="NASDAQ">NASDAQ (US)</option>
                    <option value="NYSE">NYSE (US)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Quantity</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="10"
                    className="w-full px-4 py-3 bg-[#070514] border border-violet-900/60 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Buy Price (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    placeholder="2500"
                    className="w-full px-4 py-3 bg-[#070514] border border-violet-900/60 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-violet-950/60 text-slate-300 font-bold rounded-2xl hover:bg-violet-900/60 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black rounded-2xl shadow-lg hover:opacity-95"
                  >
                    Save Holding
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
