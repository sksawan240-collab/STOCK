import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bookmark, Plus, Trash2, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any>(null);
  const [quotes, setQuotes] = useState<Record<string, any>>({});
  const [newSymbol, setNewSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/watchlist');
      setWatchlist(res.data.watchlist);
      const stocks = res.data.watchlist.stocks || [];
      const quoteMap: Record<string, any> = {};
      for (const s of stocks) {
        try {
          const qRes = await api.get(`/market/quote/${s.symbol}`);
          quoteMap[s.symbol] = qRes.data.quote;
        } catch (e) {
          // ignore
        }
      }
      setQuotes(quoteMap);
    } catch (err: any) {
      setError(err.message || 'Failed to load watchlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    try {
      const res = await api.post('/watchlist', { symbol: newSymbol.trim().toUpperCase() });
      setWatchlist(res.data.watchlist);
      setNewSymbol('');
      fetchWatchlist();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRemove = async (symbol: string) => {
    try {
      const res = await api.delete(`/watchlist/${symbol}`);
      setWatchlist(res.data.watchlist);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0c081e] border border-violet-900/40 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Bookmark className="w-3.5 h-3.5" /> Favorite Assets
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Stock Watchlist
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track your favorite stocks and assets with real-time market quotes and analysis shortcuts.
            </p>
          </div>

          <form onSubmit={handleAddStock} className="flex gap-2.5">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Add symbol (e.g. NIFTY50, TSLA)..."
              className="px-4 py-3 bg-[#070514] border border-violet-900/60 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-72 shadow-inner"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-violet-500/20 hover:opacity-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading watchlist...</div>
        ) : !watchlist || watchlist.stocks?.length === 0 ? (
          <div className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-16 text-center space-y-5 shadow-2xl">
            <Bookmark className="w-14 h-14 text-amber-400/60 mx-auto" />
            <h3 className="text-xl font-black text-white">Your watchlist is empty</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Add stock symbols using the input above to monitor their prices and performance in real-time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.stocks.map((item: any) => {
              const q = quotes[item.symbol];
              return (
                <div key={item.symbol} className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-7 backdrop-blur-2xl shadow-2xl flex flex-col justify-between space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl font-black text-white">{item.symbol}</span>
                        <span className="text-xs px-2.5 py-1 rounded-xl bg-violet-950 text-amber-300 font-mono border border-violet-800">{item.exchange}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{q?.name || 'Asset Security'}</div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.symbol)}
                      className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors border border-rose-500/20"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-violet-950">
                    <div>
                      <div className="text-3xl font-black text-white">₹{q?.price || '---'}</div>
                      <div className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${q?.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {q?.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {q?.change >= 0 ? '+' : ''}{q?.changePct || '0.00'}%
                      </div>
                    </div>

                    <Link
                      to="/market"
                      className="px-4 py-3 rounded-2xl bg-violet-950 hover:bg-violet-900 text-amber-400 font-bold text-xs flex items-center gap-2 border border-violet-800 transition-colors shadow"
                    >
                      <BarChart2 className="w-4 h-4" /> View Market
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
