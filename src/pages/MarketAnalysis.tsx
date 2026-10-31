import { useState, useEffect } from 'react';
import api from '../services/api';
import { StockQuote } from '../types';
import { Search, TrendingUp, TrendingDown, BarChart2, Activity, ShieldAlert, Bookmark } from 'lucide-react';
import SectorHeatmap from '../components/SectorHeatmap';
import MarketSentimentCard from '../components/MarketSentimentCard';

export default function MarketAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<StockQuote | null>(null);
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultSymbols = ['NIFTY50', 'SENSEX', 'BANKNIFTY', 'SPX', 'NASDAQ', 'RELIANCE', 'TCS', 'AAPL'];

  const fetchDefaultQuotes = async () => {
    setLoading(true);
    try {
      const results = [];
      for (const sym of defaultSymbols) {
        const res = await api.get(`/market/quote/${sym}`);
        results.push(res.data.quote);
      }
      setQuotes(results);
      if (results.length > 0) {
        selectStock(results[0].symbol);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load market quotes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultQuotes();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/market/search?q=${encodeURIComponent(searchQuery)}`);
      setQuotes(res.data.results);
      if (res.data.results.length > 0) {
        selectStock(res.data.results[0].symbol);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectStock = async (symbol: string) => {
    try {
      const qRes = await api.get(`/market/quote/${symbol}`);
      setSelectedQuote(qRes.data.quote);
      const hRes = await api.get(`/market/history/${symbol}`);
      setHistory(hRes.data.history);
    } catch (err: any) {
      console.error(err);
    }
  };

  const addToWatchlist = async (symbol: string) => {
    try {
      await api.post('/watchlist', { symbol });
      alert(`Added ${symbol} to your watchlist!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0c081e] border border-violet-900/40 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <BarChart2 className="w-3.5 h-3.5" /> Real-Time Quotes & Order Flow
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Market Data & Sector Analysis
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Explore live quotes, historical candles, RSI indicators, Nifty 50 sector heatmaps, and AI sentiment analysis.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol (e.g. NIFTY50, AAPL)..."
                className="pl-10 pr-4 py-3 bg-[#070514] border border-violet-900/60 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-72 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-violet-500/20 hover:opacity-95"
            >
              Search
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* D3.js Sector Heatmap Section */}
        <SectorHeatmap />

        {/* AI News Sentiment Analysis Section */}
        <MarketSentimentCard />

        {/* Selected Quote Details & Chart */}
        {selectedQuote && (
          <div className="bg-[#0c081e] border border-violet-900/50 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-violet-950 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-white">{selectedQuote.symbol}</span>
                  <span className="text-xs px-3 py-1 rounded-xl bg-violet-950 text-amber-300 font-mono border border-violet-800">{selectedQuote.exchange}</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">{selectedQuote.name}</div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-4xl font-black text-white">₹{selectedQuote.price.toLocaleString()}</div>
                  <div className={`flex items-center justify-end gap-1.5 text-sm font-bold ${selectedQuote.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedQuote.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {selectedQuote.change >= 0 ? '+' : ''}{selectedQuote.change} ({selectedQuote.changePct}%)
                  </div>
                </div>

                <button
                  onClick={() => addToWatchlist(selectedQuote.symbol)}
                  className="p-3.5 rounded-2xl bg-violet-950/60 hover:bg-violet-900/60 text-amber-400 border border-violet-800 transition-colors shadow-lg"
                  title="Add to Watchlist"
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Technical Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#070514]/80 border border-violet-900/40 p-5 rounded-2xl shadow-md">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">RSI (14)</div>
                <div className="text-2xl font-black text-white mt-1">{selectedQuote.rsi}</div>
                <div className="text-[11px] text-amber-400 mt-1 font-semibold">{selectedQuote.rsi > 70 ? 'Overbought' : selectedQuote.rsi < 30 ? 'Oversold' : 'Neutral Zone'}</div>
              </div>

              <div className="bg-[#070514]/80 border border-violet-900/40 p-5 rounded-2xl shadow-md">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">MACD Signal</div>
                <div className="text-xl font-black text-white mt-1">{selectedQuote.macd}</div>
                <div className="text-[11px] text-slate-400 mt-1">Momentum Oscillator</div>
              </div>

              <div className="bg-[#070514]/80 border border-violet-900/40 p-5 rounded-2xl shadow-md">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Day High / Low</div>
                <div className="text-lg font-black text-white mt-1">₹{selectedQuote.high} / ₹{selectedQuote.low}</div>
                <div className="text-[11px] text-slate-400 mt-1">Intraday Range</div>
              </div>

              <div className="bg-[#070514]/80 border border-violet-900/40 p-5 rounded-2xl shadow-md">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Volume</div>
                <div className="text-lg font-black text-white mt-1">{selectedQuote.volume}</div>
                <div className="text-[11px] text-slate-400 mt-1">Traded Shares</div>
              </div>
            </div>

            {/* Historical Candlestick representation preview */}
            <div className="bg-[#070514] border border-violet-900/50 rounded-3xl p-6 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-200">Historical Price Action (30 Days)</h3>
                <span className="text-xs text-amber-400 font-mono">Source: Real-Time Feed</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {history?.candles?.map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs py-2.5 px-3 rounded-xl bg-violet-950/20 border border-violet-900/20 font-mono">
                    <span className="text-slate-400">{c.time}</span>
                    <span className="text-slate-300">O: ₹{c.open}</span>
                    <span className="text-emerald-400">H: ₹{c.high}</span>
                    <span className="text-rose-400">L: ₹{c.low}</span>
                    <span className="text-white font-bold">C: ₹{c.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stock List Grid */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6">Market Indices & Assets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quotes.map((q) => (
              <div
                key={q.symbol}
                onClick={() => selectStock(q.symbol)}
                className={`bg-[#0c081e] border rounded-3xl p-6 cursor-pointer transition-all hover:-translate-y-1.5 shadow-xl ${
                  selectedQuote?.symbol === q.symbol ? 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.2)]' : 'border-violet-900/40 hover:border-violet-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-white text-lg">{q.symbol}</span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-violet-950 text-amber-300 font-mono border border-violet-800">{q.exchange}</span>
                </div>
                <div className="text-xs text-slate-400 truncate mb-4">{q.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-white">₹{q.price}</span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${q.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {q.change >= 0 ? '+' : ''}{q.changePct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
